import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection';
import { slugify } from '@/lib/utils';
import { fetchAnilistData, GET_RECENT_MANGAS, GET_MANGA_DETAILS_BY_TITLE, AnilistResponse } from '@/lib/anilist';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const data = await fetchAnilistData<AnilistResponse>(GET_RECENT_MANGAS, { page: 1, perPage: 20 });
  const mangas = data.Page.media;

  const params = mangas.map(manga => ({
    mangaId: slugify(manga.title.romaji || manga.title.english || manga.title.native || '')
  }));

  console.log("Generated manga detail params:", params);
  return params;
}

export default async function MangaDetailPage({ params }: { params: { mangaId: string } }) {
  const { mangaId } = params;

  // Slug'ı okunabilir bir başlığa dönüştür (AniList arama için)
  const searchableTitle = mangaId.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  const data = await fetchAnilistData<AnilistResponse>(GET_MANGA_DETAILS_BY_TITLE, { title: searchableTitle });
  const manga = data.Page.media[0];

  if (!manga) {
    notFound();
  }

  // API'den gelen verileri kullanarak bileşeni doldur
  const displayTitle = manga.title.english || manga.title.romaji || manga.title.native;
  const description = manga.description ? manga.description.replace(/<br>/g, '\n') : 'Açıklama mevcut değil.';
  const rating = manga.averageScore ? `${manga.averageScore}/100` : 'N/A';
  const lastUpdatedDate = new Date(manga.endDate?.year, (manga.endDate?.month || 1) - 1, manga.endDate?.day);
  const createdDate = new Date(manga.startDate?.year, (manga.startDate?.month || 1) - 1, manga.startDate?.day);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Rating */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <div className="relative w-full aspect-[2/3] mb-4">
              <Image
                src={manga.coverImage.extraLarge || manga.coverImage.large || manga.coverImage.medium}
                alt={displayTitle}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Değerlendirme</h3>
            <p className="text-gray-400">{rating}</p>
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
            <h1 className="text-4xl font-bold gradient-text mb-4">{displayTitle}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {(manga.genres || []).map((genre, index) => (
                <span key={index} className="badge badge-primary">{genre}</span>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Şuna bir bakın!!!</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: description }}></p>
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
                  <p>Yazar: {manga.staff?.edges?.find(edge => edge.role === 'Story & Art')?.node?.name?.full || 'Bilinmiyor'}</p>
                  <p>Tür: {manga.format || 'Bilinmiyor'}</p>
                  <p>Durum: {manga.status || 'Bilinmiyor'}</p>
                  <p>Bölüm Sayısı: {manga.chapters || 'Bilinmiyor'}</p>
                  <p>Güncellenme Tarihi: {lastUpdatedDate.toLocaleDateString('tr-TR')}</p>
                  <p>Oluşturulma Tarihi: {createdDate.toLocaleDateString('tr-TR')}</p>
                </div>
              </div>

              {/* Chapter List (Right Column) */}
              <div className="lg:col-span-3 space-y-4">
                {/* Burası için gerçek bölüm verilerine ihtiyacımız var, şimdilik boş bırakıyorum */}
                <p className="text-gray-400">Bölüm verileri mevcut değil.</p>
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