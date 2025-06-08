import Link from 'next/link'
import Image from 'next/image'
import { fetchAnilistData, GET_TRENDING_MANGAS, AnilistResponse, FeaturedManga } from '@/lib/anilist'

interface PopularManga extends FeaturedManga {
  rank: number;
}

export default async function PopularMangaSection() {
  let popularMangas: PopularManga[] = []
  try {
    // AniList API'sinde doğrudan POPULAR_DESC sort seçeneği var, bunu kullanacağım.
    const data = await fetchAnilistData<AnilistResponse>(GET_TRENDING_MANGAS, { page: 1, perPage: 6, sort: "POPULARITY_DESC" })
    popularMangas = data.Page.media.map((manga, index) => ({
      id: manga.id,
      title: manga.title.romaji || manga.title.english || manga.title.native,
      description: manga.description ? manga.description.replace(/<br>/g, ' ').replace(/<i>/g, '').replace(/<\/i>/g, '') : "No description available.",
      image: manga.coverImage.large || manga.coverImage.medium || manga.coverImage.extraLarge,
      rating: manga.averageScore ? (manga.averageScore / 10).toFixed(1) : "N/A",
      rank: index + 1, // Simüle edilmiş rank
    }))
  } catch (error) {
    console.error("Failed to fetch popular mangas for PopularMangaSection:", error)
    popularMangas = []
  }

  return (
    <section className="py-16 bg-[#0f1019]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold gradient-text">Son Zamanlarda Popüler</h2>
          <Link href="/popular" className="text-[#6c5ce7] hover:text-[#a29bfe] transition-colors duration-200">
            Tümünü Gör →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {popularMangas.length > 0 ? (
            popularMangas.map((manga) => (
              <Link
                key={manga.id}
                href={`/manga/${manga.id}`}
                className="group block rounded-lg overflow-hidden card transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative w-full aspect-[2/3]">
                  <Image
                    src={manga.image}
                    alt={manga.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate group-hover:text-[#6c5ce7] transition-colors duration-200">
                    {manga.title}
                  </h3>
                  <div className="flex items-center mt-3">
                    <span className="text-[#6c5ce7] mr-1">★</span>
                    <span className="text-sm font-medium">{manga.rating}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Loading skeleton for 6 items
            [...Array(6)].map((_, i) => (
              <div key={i} className="card h-full animate-pulse">
                <div className="relative w-full aspect-[2/3] loading-skeleton rounded-t-lg" />
                <div className="p-4">
                  <div className="h-5 loading-skeleton rounded w-3/4 mb-2" />
                  <div className="h-3 loading-skeleton rounded w-1/2 mb-1" />
                  <div className="h-4 loading-skeleton rounded w-1/4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
} 