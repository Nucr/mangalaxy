import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection';

export async function generateStaticParams() {
  // Gerçek bir uygulamada, burada API'den veya veritabanından dinamik manga ID'lerini alırsınız.
  // Şimdilik, statik olarak oluşturulacak birkaç örnek ID sağlıyoruz.
  return [
    { mangaId: '1' },
    { mangaId: '2' },
    { mangaId: '3' },
  ];
}

export default async function MangaDetailPage({ params }: { params: Promise<{ mangaId: string }> }) {
  const { mangaId } = await params;

  // Dummy data for demonstration. In a real application, you would fetch this from an API.
  const manga = {
    id: mangaId,
    title: "Fitness'çı Kahraman",
    image: "/hero-bg.jpg", // Placeholder image, replace with actual manga image
    genres: ["Aksiyon", "Fantezi", "Komedi", "Macera"],
    description: `Yıl 20XX. Bir B-filminden fırlamış canavarların istilasıyla insanlık, gözlerini yeni
güçlere açıyor!

Egzersiz yapmak zorunda kalmadan güç ve kuvvet saçan kahramanlar arasında,
Stronger Gym'i koruyan bir "kaplan" var.

Gerçek bir kaplan değil. Kaplan desenli tişört ve don giyen bir adam!

Gym bebeklerini her zamanki gibi sevinçle karşılıyor!

"Ah, gym bebeği mi? Korkma, gel içerii!"

Buyurun, ana karakterimiz ve Stronger Gym yoldaşlarının sağlıklı birer zihin ve
beden elde edişlerini beraber izleyelim!`,
    rating: "0.0/5 (0 oy)",
    chapters: [
      { number: 11, date: "06.06.2025" },
      { number: 10, date: "03.06.2025" },
      { number: 8, date: "03.06.2025" },
      { number: 7, date: "03.06.2025" },
      { number: 6, date: "02.06.2025" },
      { number: 5, date: "01.06.2025" },
    ],
    updateSchedule: "Bilinmiyor",
    writer: "Bilinmiyor",
    type: "WEBTOON",
    status: "Devam Ediyor",
    chapterCount: 11,
    lastUpdated: "2025-06-08",
    createdDate: "2025-05-31",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Rating */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <div className="relative w-full aspect-[2/3] mb-4">
              <Image
                src={manga.image}
                alt={manga.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Değerlendirme</h3>
            <p className="text-gray-400">{manga.rating}</p>
          </div>

          {/* Buttons */}
          <div className="mt-6 space-y-4">
            <button className="btn-primary w-full">Favorilere Ekle</button>
            <button className="btn-secondary w-full">Paylaş</button>
            <button className="btn-tertiary w-full">Hata Bildirme</button>
          </div>
        </div>

        {/* Middle Column: Description and Details */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h1 className="text-4xl font-bold gradient-text mb-4">{manga.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {manga.genres.map((genre, index) => (
                <span key={index} className="badge badge-primary">{genre}</span>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Şuna bir bakın!!!</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-line">{manga.description}</p>
          </div>

          {/* Chapters Section */}
          <div className="card p-6 mt-8">
            <h2 className="text-3xl font-bold gradient-text mb-6">Bölümler</h2>
            <div className="flex flex-wrap gap-4 mb-6">
              <button className="btn-primary">Okumaya Başla</button>
              <button className="btn-secondary">Son Bölüm</button>
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Bölüm numarasına göre ara..."
                  className="input-primary w-full pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {/* Chapter Info (Left Column) */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <span className="mr-2">🗓️</span>
                  <span>Güncellenme Takvimi</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-gray-400">
                  <span className="day-circle">P</span>
                  <span className="day-circle">S</span>
                  <span className="day-circle">Ç</span>
                  <span className="day-circle">P</span>
                  <span className="day-circle">C</span>
                  <span className="day-circle">C</span>
                  <span className="day-circle">P</span>
                </div>
                <div className="text-gray-400">
                  <p>Yazar: {manga.writer}</p>
                  <p>Tür: {manga.type}</p>
                  <p>Durum: {manga.status}</p>
                  <p>Bölüm Sayısı: {manga.chapterCount}</p>
                  <p>Güncellenme Tarihi: {manga.lastUpdated}</p>
                  <p>Oluşturulma Tarihi: {manga.createdDate}</p>
                </div>
              </div>

              {/* Chapter List (Right Column) */}
              <div className="lg:col-span-3 space-y-4">
                {manga.chapters.map((chapter) => (
                  <Link
                    key={chapter.number}
                    href={`/manga/${manga.id}/chapter/${chapter.number}`}
                    className="flex items-center bg-[#0f1019] p-4 rounded-lg hover:bg-[#1a1b2e] transition-colors duration-200"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 mr-4">
                      <Image
                        src={manga.image} // Use manga image as chapter thumbnail for now
                        alt={`Bölüm ${chapter.number}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white">{chapter.number}. Bölüm</h3>
                      <p className="text-sm text-gray-400">{chapter.date}</p>
                    </div>
                    {/* Add a play icon or similar if desired */}
                  </Link>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button className="btn-pagination">&lt; Önceki</button>
              <button className="btn-pagination active">1</button>
              <button className="btn-pagination">2</button>
              <button className="btn-pagination">3</button>
              <button className="btn-pagination">Sonraki &gt;</button>
            </div>
          </div>

          {/* Comment Section */}
          <CommentSection />
        </div>
      </div>
    </div>
  );
} 