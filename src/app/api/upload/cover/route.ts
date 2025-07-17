import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('cover');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'kapaklar');
    await mkdir(uploadDir, { recursive: true });
    const fileName = Date.now() + '-' + (file.name || 'kapak') + path.extname(file.name || '.png');
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    const url = `/uploads/kapaklar/${fileName}`;
    return NextResponse.json({ url });
  } catch (e: unknown) {
    console.error('Kapak yükleme hatası:', e);
    return NextResponse.json({ error: 'Yükleme başarısız', detail: (e as Error)?.message }, { status: 500 });
  }
} 