import React from 'react';
import { slugify } from '@/lib/utils';
import { AnilistResponse, fetchAnilistData, GET_RECENT_MANGAS } from '@/lib/anilist';

export async function generateStaticParams(): Promise<{ mangaId: string; bolumNumarasi: string }[]> {
  const data = await fetchAnilistData<AnilistResponse>(GET_RECENT_MANGAS, { page: 1, perPage: 20 });
  const mangas = data.Page.media;

  const params: { mangaId: string; bolumNumarasi: string }[] = [];

  for (const manga of mangas) {
    const mangaId = slugify(manga.title.romaji || manga.title.english || manga.title.native || '');
    const chapterCount = manga.chapters || 1;
    for (let i = 1; i <= Math.min(chapterCount, 5); i++) {
      params.push({ mangaId, bolumNumarasi: `${i}` });
    }
  }
  return params;
}

interface PageProps {
  params: {
    mangaId: string;
    bolumNumarasi: string;
  };
}

export default async function ChapterDetailPage({ params }: PageProps) {
  const { mangaId, bolumNumarasi } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold gradient-text mb-6">
        Manga ID: {mangaId} - Bölüm: {bolumNumarasi}
      </h1>
      <div className="card p-6">
        <p className="text-gray-400 mb-4">
          Bu, {mangaId} ID&apos;li manganın {bolumNumarasi}. bölümüdür.
        </p>
        <p className="text-gray-300">Burada bölümün içeriği yer alacak.</p>
        <div className="flex justify-between mt-8">
          <button className="btn-secondary">← Önceki Bölüm</button>
          <button className="btn-primary">Sonraki Bölüm →</button>
        </div>
      </div>
    </div>
  );
} 