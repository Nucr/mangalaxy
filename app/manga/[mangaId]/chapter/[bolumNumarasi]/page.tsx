import React from 'react';
import { slugify } from '@/lib/utils';

interface ChapterDetailPageProps {
  params: Promise<{ mangaId: string; bolumNumarasi: string }>;
}

export async function generateStaticParams() {
  // Gerçek bir uygulamada, API'den veya veritabanından dinamik manga ve bölüm ID'lerini alırsınız.
  // Şimdilik, statik olarak oluşturulacak birkaç örnek ID sağlıyoruz.
  const dummyMangaTitles = [
    "Fitness'çı Kahraman",
    "Kılıç Ustası",
    "Sonsuz Büyücü",
    "Karanlık Lordun Yükselişi"
  ];

  const params = [];
  for (const title of dummyMangaTitles) {
    const mangaId = slugify(title);
    // Her manga için birkaç örnek bölüm
    for (let i = 1; i <= 3; i++) {
      params.push({ mangaId: mangaId, bolumNumarasi: `${i}` });
    }
  }
  return params;
}

export default async function ChapterDetailPage(props: ChapterDetailPageProps) {
  const { mangaId, bolumNumarasi } = await props.params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold gradient-text mb-6">
        Manga ID: {mangaId} - Bölüm: {bolumNumarasi}
      </h1>
      <div className="card p-6">
        <p className="text-gray-400 mb-4">Bu, {mangaId} ID'li manganın {bolumNumarasi}. bölümüdür.</p>
        <p className="text-gray-300">Burada bölümün içeriği yer alacak.</p>
        {/* Gezinme butonları */}
        <div className="flex justify-between mt-8">
          <button className="btn-secondary">← Önceki Bölüm</button>
          <button className="btn-primary">Sonraki Bölüm →</button>
        </div>
      </div>
    </div>
  );
} 