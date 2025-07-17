import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Bu e-posta ile zaten kayıtlı bir kullanıcı var." }, { status: 409 });
    }
    const hashed = await hash(password, 10);
    const user = {
      name: username,
      email,
      emailVerified: null,
      image: null,
      password: hashed,
      createdAt: new Date(),
      favorites: [], // Favori mangalar için boş array
      role: 'user', // Varsayılan rol
    };
    await db.collection("users").insertOne(user);
    return NextResponse.json({ message: "Kayıt başarılı" }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
} 