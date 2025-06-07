'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchAnilistData, GET_TRENDING_MANGAS, AnilistResponse, FeaturedManga } from '@/lib/anilist'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [latestUpdates, setLatestUpdates] = useState<FeaturedManga[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        const data = await fetchAnilistData<AnilistResponse>(GET_TRENDING_MANGAS, { page: 1, perPage: 9 })
        const updates = data.Page.media.map((manga) => ({
          id: manga.id,
          title: manga.title.romaji || manga.title.english || manga.title.native,
          description: manga.description ? manga.description.replace(/<br>/g, ' ').replace(/<i>/g, '').replace(/<\/i>/g, '') : "No description available.",
          image: manga.coverImage.large || manga.coverImage.medium || manga.coverImage.extraLarge,
          rating: manga.averageScore ? (manga.averageScore / 10).toFixed(1) : "N/A"
        }))
        setLatestUpdates(updates)
      } catch (error) {
        console.error("Failed to fetch latest updates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestUpdates()
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#0f1019]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-text">MangaGalaxy</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="nav-link">
              Browse
            </Link>
            <Link href="/popular" className="nav-link">
              Popular
            </Link>
            <Link href="/latest" className="nav-link">
              Latest
            </Link>
            <Link href="/categories" className="nav-link">
              Categories
            </Link>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search manga..."
                className="input-primary w-64"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200">
                🔍
              </button>
            </div>
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>

        {/* Latest Updates Grid */}
        <div className="hidden md:grid grid-cols-3 gap-4 py-4 border-t border-[#1a1b2e]">
          {isLoading ? (
            // Loading skeleton
            [...Array(9)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <div className="w-12 h-16 loading-skeleton rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 loading-skeleton rounded w-3/4" />
                  <div className="h-3 loading-skeleton rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            latestUpdates.map((manga) => (
              <Link
                key={manga.id}
                href={`/manga/${manga.id}`}
                className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-[#1a1b2e] transition-colors duration-200"
              >
                <div className="relative w-12 h-16 flex-shrink-0">
                  <Image
                    src={manga.image}
                    alt={manga.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate group-hover:text-[#6c5ce7] transition-colors duration-200">
                    {manga.title}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    Rating: {manga.rating}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </nav>
  )
} 