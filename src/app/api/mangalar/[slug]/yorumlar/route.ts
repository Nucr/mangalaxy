import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

async function getParams(context: unknown) {
  // Next.js 13+ ile params artık async olarak çekilmeli
  return await (context as { params: { slug: string } }).params;
}

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const params = await getParams(context);
    const { slug } = params;
    const { searchParams } = new URL(req.url);
    const bolum_no = searchParams.get("bolum_no");
    const user = searchParams.get("user");

    if (!bolum_no) {
      return NextResponse.json({ error: "Bölüm numarası gerekli" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const manga = await db.collection("mangalar").findOne({ slug: new RegExp(`^${slug}$`, 'i') });
    if (!manga) {
      return NextResponse.json({ error: "Manga bulunamadı" }, { status: 404 });
    }

    const bolum = (manga.chapters || []).find(
      (b: Partial<Chapter>) =>
        String(b.bolum_no) === String(bolum_no) ||
        String(b.no) === String(bolum_no)
    );

    if (!bolum) {
      return NextResponse.json({ error: "Bölüm bulunamadı" }, { status: 404 });
    }

    let selectedEmoji = null;
    if (user && bolum.emojiLikes) {
      const found = bolum.emojiLikes.find((l: {user: string}) => l.user === user);
      if (found) selectedEmoji = found.emoji;
    }

    // Yorumlara kullanıcı bilgilerini ekle
    const commentsWithUser = await Promise.all(
      (bolum.comments || []).map(async (comment: Partial<Comment>) => {
        const userDoc = await db.collection("users").findOne({ email: comment.user });
        return {
          ...comment,
          avatar: userDoc?.image || null,
          role: userDoc?.role || 'uye',
          streak: userDoc?.streak || 0,
        };
      })
    );

    return NextResponse.json({
      comments: commentsWithUser,
      emojiCounts: bolum.emojiCounts || { '👍': 0, '😂': 0, '😍': 0, '😮': 0, '😢': 0, '👎': 0 },
      selectedEmoji,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const params = await getParams(context);
    const { slug } = params;
    const body = await req.json();
    const { bolum_no, name, text, emoji, user } = body;

    if (!bolum_no || !text || !user || !user.trim()) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const manga = await db.collection("mangalar").findOne({ slug: new RegExp(`^${slug}$`, 'i') });

    if (!manga) {
      return NextResponse.json({ error: "Manga bulunamadı" }, { status: 404 });
    }

    // Kullanıcı bilgilerini çek
    const userDoc = await db.collection("users").findOne({ email: user });
    const avatar = userDoc?.image || null;
    const role = userDoc?.role || 'uye';
    const streak = userDoc?.streak || 0;

    const chapters = manga.chapters.map((b: Partial<Chapter>) => {
      if (String(b.bolum_no) === String(bolum_no) || String(b.no) === String(bolum_no)) {
        const comments = b.comments || [];
        comments.unshift({ name, text, emoji, user, date: new Date().toISOString() });
        return { ...b, comments };
      }
      return b;
    });

    await db.collection("mangalar").updateOne({ slug: new RegExp(`^${slug}$`, 'i') }, { $set: { chapters } });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const params = await getParams(context);
    const { slug } = params;
    const body = await req.json();
    const { bolum_no, emoji, user, action, commentIndex, reply } = body;

    if (!bolum_no || !user || !user.trim()) {
      return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const manga = await db.collection("mangalar").findOne({ slug: new RegExp(`^${slug}$`, 'i') });

    if (!manga) {
      return NextResponse.json({ error: "Manga bulunamadı" }, { status: 404 });
    }

    const chapters = await Promise.all(manga.chapters.map(async (b: Partial<Chapter>) => {
      if (String(b.bolum_no) === String(bolum_no) || String(b.no) === String(bolum_no)) {
        let comments = b.comments || [];
        // Yorum silme
        if (typeof commentIndex === 'number' && action === 'delete') {
          const comment = comments[commentIndex];
          if (comment && comment.user === user) {
            comments.splice(commentIndex, 1);
          }
        }
        // Like/Dislike
        if (typeof commentIndex === 'number' && (action === 'like' || action === 'dislike')) {
          const comment = comments[commentIndex];
          if (!comment) return b;
          if (!comment.likes) comment.likes = [];
          if (!comment.dislikes) comment.dislikes = [];
          // Like
          if (action === 'like') {
            if (!comment.likes.includes(user)) comment.likes.push(user);
            comment.dislikes = comment.dislikes.filter((u: string) => u !== user);
          }
          // Dislike
          if (action === 'dislike') {
            if (!comment.dislikes.includes(user)) comment.dislikes.push(user);
            comment.likes = comment.likes.filter((u: string) => u !== user);
          }
        }
        // Yanıt ekleme
        if (typeof commentIndex === 'number' && action === 'reply' && reply) {
          const comment = comments[commentIndex];
          if (!comment) return b;
          if (!comment.replies) comment.replies = [];
          // Kullanıcı bilgilerini çek
          const userDoc = await db.collection("users").findOne({ email: user });
          comment.replies.unshift({
            name: reply.name,
            text: reply.text,
            user,
            date: new Date().toISOString(),
            avatar: userDoc?.image || null,
            role: userDoc?.role || 'uye',
            streak: userDoc?.streak || 0,
            likes: [],
            dislikes: [],
            replies: [],
          });
        }
        // Emoji işlemleri (eski kod)
        if (emoji) {
          let emojiLikes = b.emojiLikes || [];
          const prev = emojiLikes.find((l: {user: string}) => l.user === user);
          if (!b.emojiCounts) {
            b.emojiCounts = { '👍': 0, '😂': 0, '😍': 0, '😮': 0, '😢': 0, '👎': 0 };
          }
          if (prev) {
            if (prev.emoji && b.emojiCounts[prev.emoji] > 0) {
              b.emojiCounts[prev.emoji]--;
            }
            prev.emoji = emoji;
          } else {
            emojiLikes.push({ user, emoji });
          }
          b.emojiCounts[emoji] = (b.emojiCounts[emoji] || 0) + 1;
          return { ...b, emojiLikes, emojiCounts: b.emojiCounts, comments };
        }
        return { ...b, comments };
      }
      return b;
    }));

    await db.collection("mangalar").updateOne({ slug: new RegExp(`^${slug}$`, 'i') }, { $set: { chapters } });

    const updatedManga = await db.collection("mangalar").findOne({ slug: new RegExp(`^${slug}$`, 'i') });
    if (!updatedManga) return NextResponse.json({ error: "Manga bulunamadı" }, { status: 404 });

    const updatedBolum = (updatedManga.chapters || []).find(
      (b: Partial<Chapter>) =>
        String(b.bolum_no) === String(bolum_no) ||
        String(b.no) === String(bolum_no)
    );

    if (!updatedBolum) {
      return NextResponse.json({ error: "Bölüm bulunamadı" }, { status: 404 });
    }

    let selectedEmoji = null;
    if (user && updatedBolum.emojiLikes) {
      const found = updatedBolum.emojiLikes.find((l: {user: string}) => l.user === user);
      if (found) selectedEmoji = found.emoji;
    }

    // Yorumlara kullanıcı bilgilerini ekle
    const commentsWithUser = await Promise.all(
      (updatedBolum.comments || []).map(async (comment: Partial<Comment>) => {
        const userDoc = await db.collection("users").findOne({ email: comment.user });
        return {
          ...comment,
          avatar: userDoc?.image || null,
          role: userDoc?.role || 'uye',
          streak: userDoc?.streak || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      emojiCounts: updatedBolum.emojiCounts || { '👍': 0, '😂': 0, '😍': 0, '😮': 0, '😢': 0, '👎': 0 },
      selectedEmoji,
      comments: commentsWithUser,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
