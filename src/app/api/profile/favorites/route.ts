import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mangaId, action } = await req.json();
  if (!mangaId || !["add", "remove"].includes(action)) {
    return NextResponse.json({ error: "Eksik veya hatalı parametre" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  let favorites = Array.isArray(user.favorites) ? user.favorites : [];

  if (action === "add") {
    if (!favorites.includes(mangaId)) favorites.push(mangaId);
  } else if (action === "remove") {
    favorites = favorites.filter((id: string) => id !== mangaId);
  }

  await db.collection("users").updateOne(
    { email: session.user.email },
    { $set: { favorites } }
  );

  return NextResponse.json({ success: true, favorites });
} 