import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, mangaId, chapterNo, date, mangaTitle, mangaCover } = body;
    if (!userId || !mangaId || !chapterNo) {
      return NextResponse.json({ error: 'Eksik veri' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    // Aynı kullanıcı aynı mangada aynı bölümü birden fazla kez okursa, sadece tarihi güncelle
    await db.collection('user_reads').updateOne(
      { userId, mangaId, chapterNo },
      { $set: { date: date || new Date(), mangaTitle, mangaCover } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: 'Okuma kaydı eklenemedi', detail: (e as Error)?.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId gerekli' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const reads = await db.collection('user_reads')
      .find({ userId })
      .sort({ date: -1 })
      .limit(10)
      .project({ _id: 0, mangaId: 1, chapterNo: 1, date: 1, mangaTitle: 1, mangaCover: 1 })
      .toArray();
    return NextResponse.json({ reads });
  } catch (e: unknown) {
    return NextResponse.json({ error: 'Okuma geçmişi alınamadı', detail: (e as Error)?.message }, { status: 500 });
  }
} 