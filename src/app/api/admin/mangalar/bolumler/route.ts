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

export async function POST(req: NextRequest) {
  try {
    console.log('Bölüm ekleme isteği alındı');
    const contentType = req.headers.get('content-type');
    if (!contentType) throw new Error('Content-Type header eksik!');
    return await new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: { 'content-type': contentType } });
      const bolumData: any = {};
      const files: string[] = [];
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

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

      busboy.on("finish", async () => {
        try {
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
          resolve(
            NextResponse.json({
              message: "Bölüm ve dosyalar başarıyla yüklendi.",
              bolum: bolumData,
              dosyalar: files,
              yeniBolum
            })
          );
        } catch (e: any) {
          reject(NextResponse.json({ error: "DB ekleme hatası", detail: e.message }, { status: 500 }));
        }
      });

      busboy.on("error", (err: any) => {
        console.error('Busboy error:', err);
        reject(NextResponse.json({ error: "Yükleme hatası", detail: err.message }, { status: 500 }));
      });

      // Next.js 13+ için req.body bir ReadableStream'dir, Node stream'e çevirmek gerekir
      const nodeStream = require('stream').Readable.from(req.body);
      nodeStream.pipe(busboy);
    });
  } catch (err: any) {
    console.error('API Bölüm ekleme genel hata:', err);
    return NextResponse.json({ error: "Sunucu hatası", detail: err.message, stack: err.stack }, { status: 500 });
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