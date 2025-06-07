import Link from 'next/link'
import Image from 'next/image'
import { fetchAnilistData, GET_RECENT_MANGAS } from '@/lib/anilist'

export default async function Navbar() {
  let latestUpdates = []
  try {
    const data = await fetchAnilistData(GET_RECENT_MANGAS, { page: 1, perPage: 9 })
    latestUpdates = data.Page.media.map((manga: any) => ({
      id: manga.id,
      title: manga.title.romaji || manga.title.english || manga.title.native,
      // AniList API does not directly provide "last updated chapter" or "date".
      // For now, we'll use placeholder values or the total chapter count if available.
      chapter: manga.chapters ? `Chapter ${manga.chapters}` : "N/A",
      image: manga.coverImage.large || manga.coverImage.medium || manga.coverImage.extraLarge,
      date: "Recently Updated" // Placeholder
    }))
  } catch (error) {
    console.error("Failed to fetch latest updates for Navbar:", error)
    // Fallback to empty array or a default set if API call fails
    latestUpdates = []
  }

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
          {latestUpdates.length > 0 ? (latestUpdates.map((update: any) => (
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
          ))) : (
            <p className="col-span-3 text-center text-gray-400">Loading latest updates...</p>
          )}
        </div>
      </div>
    </nav>
  )
} 