import Image from 'next/image'
import Link from 'next/link'
import LatestUpdatesSection from '@/components/LatestUpdatesSection'
import TrendingMangaSection from '@/components/TrendingMangaSection'
import AnnouncementBoard from '@/components/AnnouncementBoard'
import PopularMangaSection from '@/components/PopularMangaSection'

export default async function Home() {
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

      {/* En Son Güncellemeler Bölümü */}
      <LatestUpdatesSection />

      {/* Trend Olanlar Bölümü */}
      <TrendingMangaSection />

      {/* Duyuru Panosu Bölümü */}
      <AnnouncementBoard />

      {/* Son Zamanlarda Popüler Bölümü */}
      <PopularMangaSection />

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