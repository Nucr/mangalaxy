import Link from 'next/link'
import Image from 'next/image'
import { slugify } from '@/lib/utils'
import { fetchAnilistData, GET_TRENDING_MANGAS, AnilistResponse, FeaturedManga } from '@/lib/anilist'

interface TrendingManga extends FeaturedManga {
  views: string;
}

export default async function TrendingMangaSection() {
  let trendingMangas: TrendingManga[] = []
  try {
    const data = await fetchAnilistData<AnilistResponse>(GET_TRENDING_MANGAS, { page: 1, perPage: 6 })
    trendingMangas = data.Page.media.map((manga) => ({
      id: slugify(manga.title.romaji || manga.title.english || manga.title.native),
      title: manga.title.romaji || manga.title.english || manga.title.native,
      description: manga.description ? manga.description.replace(/<br>/g, ' ').replace(/<i>/g, '').replace(/<\/i>/g, '') : "No description available.",
      image: manga.coverImage.large || manga.coverImage.medium || manga.coverImage.extraLarge,
      rating: manga.averageScore ? (manga.averageScore / 10).toFixed(1) : "N/A",
      views: `${(Math.random() * 5 + 1).toFixed(1)}M` // Simüle edilmiş görüntülenme sayısı
    }))
  } catch (error) {
    console.error("Failed to fetch trending mangas for TrendingMangaSection:", error)
    trendingMangas = []
  }

  return (
    <section className="py-16 bg-[#0f1019]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold gradient-text">Trend Olanlar</h2>
          <Link href="/popular" className="text-[#6c5ce7] hover:text-[#a29bfe] transition-colors duration-200">
            Tümünü Gör →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {trendingMangas.length > 0 ? (
            trendingMangas.map((manga, index) => (
              <Link
                key={manga.id}
                href={`/manga/${manga.id}`}
                className="group flex items-center p-4 rounded-lg bg-[#1a1b2e] hover:bg-[#2a2b3e] transition-colors duration-200"
              >
                <span className="text-4xl font-bold text-gray-600 mr-4">{index + 1}</span>
                <div className="relative w-20 h-24 flex-shrink-0 mr-4">
                  <Image
                    src={manga.image}
                    alt={manga.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-bold text-lg mb-1 w-full truncate overflow-hidden group-hover:text-[#6c5ce7] transition-colors duration-200">
                    {manga.title}
                  </h3>
                  <p className="text-sm text-gray-400">Webtoon</p>
                  <div className="flex items-center text-sm text-gray-400 mt-2">
                    <span className="text-[#6c5ce7] mr-1">👁️</span>
                    <span>{manga.views}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Loading skeleton for 6 items
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center p-4 rounded-lg bg-[#1a1b2e] animate-pulse">
                <div className="w-10 h-10 loading-skeleton rounded-full mr-4" />
                <div className="relative w-20 h-24 loading-skeleton rounded mr-4" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 loading-skeleton rounded w-3/4" />
                  <div className="h-3 loading-skeleton rounded w-1/2" />
                  <div className="h-3 loading-skeleton rounded w-1/4 mt-2" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
} 