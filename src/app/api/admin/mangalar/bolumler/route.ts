// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { pipeline } from "stream";
import Busboy from "busboy";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const pump = promisify(pipeline);

export const config = {
  api: {
    bodyParser: false, // Form-data için kapalı olmalı
  },
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    console.log('Bölüm ekleme isteği alındı');
    const contentType = req.headers.get('content-type');
    if (!contentType) throw new Error('Content-Type header eksik!');
    const busboy = Busboy({ headers: { 'content-type': contentType } });
    const bolumData: any = {};
    const files: string[] = [];
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const busboyPromise = new Promise<void>((resolve, reject) => {
      busboy.on("field", (fieldname: any, val: any) => {
        bolumData[fieldname] = val;
        console.log('Field:', fieldname, val);
      });

      busboy.on("file", (fieldname: any, file: any, filename: any) => {
        let realFilename = filename;
        if (filename && typeof filename === 'object' && filename.filename) {
          realFilename = filename.filename;
        }
        const saveTo = path.join(uploadDir, realFilename);
        files.push(realFilename);
        console.log('File:', realFilename, '->', saveTo);
        file.pipe(fs.createWriteStream(saveTo));
      });

      busboy.on("finish", () => resolve());
      busboy.on("error", (err: any) => reject(err));
    });

    // Next.js 13+ için req.body bir ReadableStream'dir, Node stream'e çevirmek gerekir
    const nodeStream = require('stream').Readable.from(req.body);
    nodeStream.pipe(busboy);
    await busboyPromise;

    const client = await clientPromise;
    const db = client.db();
    const yeniBolum = {
      bolum_no: bolumData.bolum_no,
      bolum_adi: bolumData.bolum_adi,
      yayin_tarihi: bolumData.yayin_tarihi,
      sayfalar: files,
      createdAt: new Date().toISOString()
    };
    await db.collection("mangalar").updateOne(
      { _id: new ObjectId(bolumData.manga_id) },
      { $push: { chapters: yeniBolum } }
    );
    return NextResponse.json({
      message: "Bölüm ve dosyalar başarıyla yüklendi.",
      bolum: bolumData,
      dosyalar: files,
      yeniBolum
    });
  } catch (e: any) {
    console.error('API Bölüm ekleme genel hata:', e);
    return NextResponse.json({ error: "Sunucu hatası", detail: e.message, stack: e.stack }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { manga_id, bolum_no } = body;
    if (!manga_id || !bolum_no) {
      return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("mangalar").updateOne(
      { _id: new ObjectId(manga_id) },
      { $pull: { chapters: { bolum_no: bolum_no } } }
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Bölüm bulunamadı veya silinemedi" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Silme hatası", detail: err.message }, { status: 500 });
  }
} 