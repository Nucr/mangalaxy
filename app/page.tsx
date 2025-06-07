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
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
        <div className="container relative z-20 h-full flex items-center">
          <div className="max-w-2xl animate-fade-in">
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
              <Link href="/popular" className="btn-secondary">
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
              featuredManga.map((manga, index) => (
                <Link 
                  href={`/manga/${manga.id}`} 
                  key={manga.id} 
                  className="group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card h-full">
                    <div className="manga-card">
                      <Image
                        src={manga.image}
                        alt={manga.title}
                        fill
                        className="manga-card-image"
                      />
                      <div className="manga-card-overlay" />
                      <div className="manga-card-content">
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
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="card h-full">
                      <div className="manga-card">
                        <div className="loading-skeleton w-full h-full" />
                      </div>
                    </div>
                  ))}
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
            {[
              { name: 'Action', icon: '⚔️' },
              { name: 'Romance', icon: '❤️' },
              { name: 'Fantasy', icon: '✨' },
              { name: 'Horror', icon: '👻' }
            ].map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name.toLowerCase()}`}
                className="card p-6 text-center hover:bg-[#6c5ce7]/10 transition-colors duration-200"
              >
                <span className="text-4xl mb-2 block">{category.icon}</span>
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold gradient-text mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-8">
              Subscribe to our newsletter to get the latest updates on new manga releases and exclusive content.
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-primary flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
} 