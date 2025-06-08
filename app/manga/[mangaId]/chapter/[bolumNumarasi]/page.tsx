import React from 'react';
import { slugify } from '@/lib/utils';
import { fetchAnilistData, GET_RECENT_MANGAS, AnilistResponse } from '@/lib/anilist';

interface PageProps {
  params: Promise<{ mangaId: string; bolumNumarasi: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateStaticParams() {
  const data = await fetchAnilistData<AnilistResponse>(GET_RECENT_MANGAS, { page: 1, perPage: 20 });
  const mangas = data.Page.media;

  const params: { mangaId: string; bolumNumarasi: string }[] = [];

  for (const manga of mangas) {
    const mangaId = slugify(manga.title.romaji || manga.title.english || manga.title.native || '');
    // Her manga için mevcut chapter sayısına göre dummy bölüm numaraları oluştur
    const chapterCount = manga.chapters || 1; // Eğer chapters yoksa en az 1 bölüm olarak kabul et
    for (let i = 1; i <= Math.min(chapterCount, 5); i++) { // İlk 5 bölümü veya mevcut bölüm sayısını al
      params.push({ mangaId: mangaId, bolumNumarasi: `${i}` });
    }
  }
  return params;
}

export default async function ChapterDetailPage(props: PageProps) {
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