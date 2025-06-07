import Image from 'next/image'
import Link from 'next/link'

const featuredManga = [
  {
    id: 1,
    title: "Featured Manga 1",
    description: "An exciting adventure manga with amazing artwork",
    image: "/placeholder.jpg",
    rating: 4.8
  },
  {
    id: 2,
    title: "Featured Manga 2",
    description: "A thrilling mystery manga that will keep you guessing",
    image: "/placeholder.jpg",
    rating: 4.7
  },
  {
    id: 3,
    title: "Featured Manga 3",
    description: "A heartwarming slice of life story",
    image: "/placeholder.jpg",
    rating: 4.9
  }
]

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-[60vh] rounded-xl overflow-hidden">
        <Image
          src="/hero-placeholder.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center">
          <div className="max-w-2xl p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to Manga Reader</h1>
            <p className="text-lg mb-6">Discover and read your favorite manga series</p>
            <Link
              href="/browse"
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Start Reading
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Manga */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Manga</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredManga.map((manga) => (
            <Link href={`/manga/${manga.id}`} key={manga.id} className="group">
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative aspect-[2/3]">
                  <Image
                    src={manga.image}
                    alt={manga.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{manga.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{manga.description}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm">{manga.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
} 