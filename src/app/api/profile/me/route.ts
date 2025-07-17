import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne(
    { email: session.user.email },
    { projection: { _id: 0, password: 0 } }
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Level alanı yoksa 1 olarak ekle
  if (typeof user.level !== 'number') user.level = 1;
  if (typeof user.xp !== 'number') user.xp = 0;
  if (typeof user.streak !== 'number') user.streak = 1;
  if (!user.lastLogin) user.lastLogin = new Date().toISOString();
  if (!Array.isArray(user.favorites)) user.favorites = [];

  return NextResponse.json(user);
} 