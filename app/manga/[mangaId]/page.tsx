import React from 'react';
import { slugify } from '@/lib/utils';
import { AnilistResponse, fetchAnilistData, GET_RECENT_MANGAS } from '@/lib/anilist';
import { redirect } from 'next/navigation';

export async function generateStaticParams(): Promise<{ mangaId: string }[]> {
  const data = await fetchAnilistData<AnilistResponse>(GET_RECENT_MANGAS, { page: 1, perPage: 20 });
  const mangas = data.Page.media;

  return mangas.map((manga) => ({
    mangaId: slugify(manga.title.romaji || manga.title.english || manga.title.native || ''),
  }));
}

type PageProps = {
  params: Promise<{
    mangaId: string;
  }>;
};

export default async function MangaDetailPage({ params }: PageProps) {
  const { mangaId } = await params;

  // URL'yi temizle
  let cleanMangaId = mangaId;
  if (mangaId.endsWith('.txt')) {
    cleanMangaId = mangaId.slice(0, -4);
  }
  if (cleanMangaId.endsWith(',')) {
    cleanMangaId = cleanMangaId.slice(0, -1);
  }

  // Eğer URL değiştiyse yönlendir
  if (cleanMangaId !== mangaId) {
    redirect(`/manga/${cleanMangaId}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold gradient-text mb-6">
        Manga ID: {cleanMangaId}
      </h1>
      <div className="card p-6">
        <p className="text-gray-400 mb-4">
          Bu, {cleanMangaId} ID&apos;li manganın detay sayfasıdır.
        </p>
        <p className="text-gray-300">Burada manganın detayları yer alacak.</p>
      </div>
    </div>
  );
} 