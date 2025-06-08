import React from 'react';
import Image from 'next/image';
import { slugify } from '@/lib/utils';
import { AnilistResponse, fetchAnilistData, GET_RECENT_MANGAS } from '@/lib/anilist';

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
  const title = mangaId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const data = await fetchAnilistData<AnilistResponse>(GET_RECENT_MANGAS, { page: 1, perPage: 20 });
  const manga = data.Page.media[0];

  if (!manga) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold gradient-text mb-6">Manga Bulunamadı</h1>
        <p className="text-gray-400">Aradığınız manga bulunamadı.</p>
      </div>
    );
  }

  const author = manga.staff?.edges.find(edge => edge.role === 'Story & Art')?.node.name.full || 'Bilinmiyor';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold gradient-text mb-6">
        Manga ID: {mangaId}
      </h1>
      <div className="card p-6">
        <p className="text-gray-400 mb-4">
          Bu, {mangaId} ID&apos;li manganın detay sayfasıdır.
        </p>
        <p className="text-gray-300">Burada manganın detayları yer alacak.</p>
      </div>
    </div>
  );
} 