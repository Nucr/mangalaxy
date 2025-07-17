import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  const { slug } = context.params;
  const client = await clientPromise;
  const db = client.db();
  const manga = await db.collection("mangalar").findOne({ slug: new RegExp(`^${slug}$`, 'i') });
  if (!manga) return NextResponse.json({ error: "Manga bulunamadı" }, { status: 404 });
  return NextResponse.json(manga);
} 