import Link from 'next/link'
import Image from 'next/image'

const latestUpdates = [
  {
    id: 1,
    title: "Manga 1",
    chapter: "Chapter 156",
    image: "/placeholder.jpg",
    date: "2 hours ago"
  },
  {
    id: 2,
    title: "Manga 2",
    chapter: "Chapter 89",
    image: "/placeholder.jpg",
    date: "3 hours ago"
  },
  {
    id: 3,
    title: "Manga 3",
    chapter: "Chapter 234",
    image: "/placeholder.jpg",
    date: "4 hours ago"
  },
  {
    id: 4,
    title: "Manga 4",
    chapter: "Chapter 45",
    image: "/placeholder.jpg",
    date: "5 hours ago"
  },
  {
    id: 5,
    title: "Manga 5",
    chapter: "Chapter 67",
    image: "/placeholder.jpg",
    date: "6 hours ago"
  },
  {
    id: 6,
    title: "Manga 6",
    chapter: "Chapter 123",
    image: "/placeholder.jpg",
    date: "7 hours ago"
  },
  {
    id: 7,
    title: "Manga 7",
    chapter: "Chapter 78",
    image: "/placeholder.jpg",
    date: "8 hours ago"
  },
  {
    id: 8,
    title: "Manga 8",
    chapter: "Chapter 90",
    image: "/placeholder.jpg",
    date: "9 hours ago"
  },
  {
    id: 9,
    title: "Manga 9",
    chapter: "Chapter 34",
    image: "/placeholder.jpg",
    date: "10 hours ago"
  }
]

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Manga Reader
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link href="/latest" className="hover:text-gray-300">Latest</Link>
            <Link href="/popular" className="hover:text-gray-300">Popular</Link>
            <Link href="/genres" className="hover:text-gray-300">Genres</Link>
            <Link href="/search" className="hover:text-gray-300">Search</Link>
          </div>
        </div>
        
        {/* Latest Updates Grid */}
        <div className="grid grid-cols-3 gap-4 py-4">
          {latestUpdates.map((update) => (
            <Link href={`/manga/${update.id}`} key={update.id} className="group">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <Image
                  src={update.image}
                  alt={update.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <h3 className="text-sm font-semibold">{update.title}</h3>
                  <p className="text-xs text-gray-300">{update.chapter}</p>
                  <p className="text-xs text-gray-400">{update.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
} 