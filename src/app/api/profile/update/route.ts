import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { name, image, about, twitter, instagram, facebook, website, banner, level, xp, streak, lastLogin, favorites } = data;

  const client = await clientPromise;
  const db = client.db();

  // Mevcut kullanıcıyı bul
  const user = await db.collection("users").findOne({ email: session.user.email });
  const currentLevel = user?.level ?? 1;
  const currentXp = user?.xp ?? 0;
  const currentStreak = user?.streak ?? 1;
  const currentLastLogin = user?.lastLogin ?? new Date().toISOString();

  await db.collection("users").updateOne(
    { email: session.user.email },
    {
      $set: {
        name,
        image,
        about,
        twitter,
        instagram,
        facebook,
        website,
        banner,
        level: typeof level === 'number' ? level : currentLevel,
        xp: typeof xp === 'number' ? xp : currentXp,
        streak: typeof streak === 'number' ? streak : currentStreak,
        lastLogin: lastLogin || currentLastLogin,
        ...(favorites !== undefined ? { favorites } : {}), // Favoriler güncellenmek istenirse ekle
      },
    }
  );

  return NextResponse.json({ success: true });
} 