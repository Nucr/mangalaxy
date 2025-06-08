import React from 'react';

interface ChapterDetailPageProps {
  params: { mangaId: string; bolumNumarasi: string };
}

export async function generateStaticParams() {
  // Gerçek bir uygulamada, API'den veya veritabanından dinamik manga ve bölüm ID'lerini alırsınız.
  // Şimdilik, statik olarak oluşturulacak birkaç örnek ID sağlıyoruz.
  return [
    { mangaId: '1', bolumNumarasi: '1' },
    { mangaId: '1', bolumNumarasi: '2' },
    { mangaId: '2', bolumNumarasi: '1' },
  ];
}

export default async function ChapterDetailPage({ params }: ChapterDetailPageProps) {
  const { mangaId, bolumNumarasi } = params;

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