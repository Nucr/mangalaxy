import React from 'react';
import Image from 'next/image';
import { slugify } from '@/lib/utils';
import { AnilistResponse, fetchAnilistData, GET_MANGA_DETAILS_BY_TITLE } from '@/lib/anilist';
import { redirect } from 'next/navigation';

export async function generateStaticParams(): Promise<{ mangaId: string }[]> {
  const data = await fetchAnilistData<AnilistResponse>(GET_MANGA_DETAILS_BY_TITLE, { title: 'One Piece' });
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

  const title = cleanMangaId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const data = await fetchAnilistData<AnilistResponse>(GET_MANGA_DETAILS_BY_TITLE, { title });
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="card p-4">
            <Image
              src={manga.coverImage.extraLarge}
              alt={manga.title.romaji || manga.title.english || manga.title.native}
              width={300}
              height={450}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-white mb-2">Detaylar</h2>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-400">Yazar:</span> {author}</p>
                <p><span className="text-gray-400">Durum:</span> {manga.status}</p>
                <p><span className="text-gray-400">Format:</span> {manga.format}</p>
                <p><span className="text-gray-400">Bölüm Sayısı:</span> {manga.chapters || 'Bilinmiyor'}</p>
                <p><span className="text-gray-400">Cilt Sayısı:</span> {manga.volumes || 'Bilinmiyor'}</p>
                <p><span className="text-gray-400">Puan:</span> {manga.averageScore ? (manga.averageScore / 10).toFixed(1) : 'Bilinmiyor'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="card p-6">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              {manga.title.romaji || manga.title.english || manga.title.native}
            </h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {manga.genres?.map((genre) => (
                <span key={genre} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">{manga.description}</p>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Bölümler</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: Math.min(manga.chapters || 1, 6) }, (_, i) => (
                  <a
                    key={i + 1}
                    href={`/manga/${cleanMangaId}/chapter/${i + 1}`}
                    className="card p-4 hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-lg font-medium">Bölüm {i + 1}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 