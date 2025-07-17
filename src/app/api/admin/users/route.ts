import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  // Sadece admin erişimi (örnek: admin@gmail.com veya pejkopat@gmail.com veya role: 'admin')
  const session = await getServerSession(authOptions);
  const adminEmails = ["admin@gmail.com", "pejkopat@gmail.com"];
  let isAdmin = false;
  if (session && session.user?.email) {
    // E-posta admin listesinde mi?
    if (adminEmails.includes(session.user.email)) {
      isAdmin = true;
    } else {
      // Kullanıcı role: 'admin' mi?
      const client = await clientPromise;
      const db = client.db();
      const user = await db.collection("users").findOne({ email: session.user.email });
      if (user && user.role === "admin") {
        isAdmin = true;
      }
    }
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Eğer ?makeAdmin=email@adres.com parametresi varsa, ilgili kullanıcıya role: 'admin' ata
  const { searchParams } = new URL(req.url);
  const makeAdmin = searchParams.get("makeAdmin");
  const newRole = searchParams.get("role") || "admin";
  if (makeAdmin) {
    const result = await db.collection("users").updateOne(
      { email: makeAdmin },
      { $set: { role: newRole } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ message: `${makeAdmin} artık ${newRole}!` });
  }

  const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();

  return NextResponse.json(users);
} 