import Image from 'next/image'
import Link from 'next/link'
import { fetchAnilistData, GET_TRENDING_MANGAS, AnilistResponse, FeaturedManga } from '@/lib/anilist'

export default async function Home() {
  let featuredManga: FeaturedManga[] = []
  try {
    const data = await fetchAnilistData<AnilistResponse>(GET_TRENDING_MANGAS, { page: 1, perPage: 3 })
    featuredManga = data.Page.media.map((manga) => ({
      id: manga.id,
      title: manga.title.romaji || manga.title.english || manga.title.native,
      description: manga.description ? manga.description.replace(/<br>/g, ' ').replace(/<i>/g, '').replace(/<\/i>/g, '') : "No description available.",
      image: manga.coverImage.large || manga.coverImage.medium || manga.coverImage.extraLarge,
      rating: manga.averageScore ? (manga.averageScore / 10).toFixed(1) : "N/A"
    }))
  } catch (error) {
    console.error("Failed to fetch featured mangas for Home page:", error)
    featuredManga = []
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1b2e]/80 via-[#1a1b2e]/50 to-[#0f1019] z-10" />
        <Image
          src="/hero-placeholder.jpg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="container relative z-20 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 gradient-text">
              Discover Your Next Favorite Manga
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore thousands of manga titles, from popular series to hidden gems.
              Start your reading journey today.
            </p>
            <div className="flex gap-4">
              <Link href="/browse" className="btn-primary">
                Start Reading
              </Link>
              <Link href="/popular" className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors duration-200">
                Popular Titles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Manga Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold gradient-text">Featured Manga</h2>
            <Link href="/browse" className="text-[#6c5ce7] hover:text-[#a29bfe] transition-colors duration-200">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredManga.length > 0 ? (
              featuredManga.map((manga) => (
                <Link href={`/manga/${manga.id}`} key={manga.id} className="group">
                  <div className="card h-full">
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={manga.image}
                        alt={manga.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b2e] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 line-clamp-1">{manga.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{manga.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-[#6c5ce7] mr-1">★</span>
                          <span className="text-sm font-medium">{manga.rating}</span>
                        </div>
                        <span className="text-[#6c5ce7] text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                          Read Now →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-[#1a1b2e] rounded w-1/4 mx-auto"></div>
                  <div className="h-4 bg-[#1a1b2e] rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-[#1a1b2e]/50">
        <div className="container">
          <h2 className="text-3xl font-bold gradient-text mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Action', 'Romance', 'Fantasy', 'Horror'].map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="card p-6 text-center hover:bg-[#6c5ce7]/10 transition-colors duration-200"
              >
                <h3 className="font-semibold text-lg">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 