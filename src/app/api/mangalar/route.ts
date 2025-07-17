import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db();
  // Son eklenen 24 mangayı, en yeniye göre sırala
  const mangalar = await db.collection("mangalar").find({})
    .sort({ createdAt: -1 })
    .limit(24)
    .toArray();
  return NextResponse.json(mangalar);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, author, categories, chapters, status, desc, coverUrl } = body;
    if (!title || !author) {
      return NextResponse.json({ success: false, error: "Başlık ve yazar zorunlu." }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    const newManga = {
      title,
      author,
      categories: categories || [],
      chapters: chapters || [],
      status: status || "Devam Ediyor",
      desc: desc || "",
      cover: coverUrl || "",
      createdAt: new Date().toISOString(),
      slug, // slug alanı eklendi
    };
    const result = await db.collection("mangalar").insertOne(newManga);
    return NextResponse.json({ success: true, manga: { ...newManga, _id: result.insertedId } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID zorunlu." }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("mangalar").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Manga bulunamadı." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Sunucu hatası" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID zorunlu." }, { status: 400 });
    }
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const updateFields: any = {};
    ["title", "author", "categories", "chapters", "status", "desc", "cover"].forEach(key => {
      if (body[key] !== undefined) updateFields[key] = body[key];
    });
    const result = await db.collection("mangalar").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Manga bulunamadı." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Sunucu hatası" }, { status: 500 });
  }
} 