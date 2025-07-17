import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = await db.collection('users').countDocuments();
    const mangas = await db.collection('mangalar').countDocuments();
    // Tüm mangalardaki toplam bölüm sayısı
    const mangaDocs = await db.collection('mangalar').find({}, { projection: { chapters: 1 } }).toArray();
    const chapters = mangaDocs.reduce((acc, m) => acc + (Array.isArray(m.chapters) ? m.chapters.length : 0), 0);
    return NextResponse.json({ users, mangas, chapters });
  } catch (e: any) {
    return NextResponse.json({ error: 'İstatistikler alınamadı', detail: e?.message }, { status: 500 });
  }
} 