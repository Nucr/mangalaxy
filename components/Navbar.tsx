'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchAnilistData, GET_RECENT_MANGAS } from '@/lib/anilist'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    <nav className="bg-[#1a1b2e]/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#2a2b3e]">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-text">Manga Galaxy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-300 hover:text-[#6c5ce7] transition-colors">
              Browse
            </Link>
            <Link href="/popular" className="text-gray-300 hover:text-[#6c5ce7] transition-colors">
              Popular
            </Link>
            <Link href="/latest" className="text-gray-300 hover:text-[#6c5ce7] transition-colors">
              Latest
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-[#6c5ce7] transition-colors">
              Categories
            </Link>
          </div>

          {/* Search and User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search manga..."
                className="bg-[#2a2b3e] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] w-64"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6c5ce7]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <button className="bg-[#6c5ce7] text-white px-4 py-2 rounded-lg hover:bg-[#5b4bc4] transition-colors">
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-[#6c5ce7]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2a2b3e]">
            <div className="flex flex-col space-y-4">
              <Link href="/browse" className="text-gray-300 hover:text-[#6c5ce7] transition-colors px-4">
                Browse
              </Link>
              <Link href="/popular" className="text-gray-300 hover:text-[#6c5ce7] transition-colors px-4">
                Popular
              </Link>
              <Link href="/latest" className="text-gray-300 hover:text-[#6c5ce7] transition-colors px-4">
                Latest
              </Link>
              <Link href="/categories" className="text-gray-300 hover:text-[#6c5ce7] transition-colors px-4">
                Categories
              </Link>
              <div className="px-4">
                <input
                  type="text"
                  placeholder="Search manga..."
                  className="bg-[#2a2b3e] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] w-full"
                />
              </div>
              <button className="bg-[#6c5ce7] text-white px-4 py-2 rounded-lg hover:bg-[#5b4bc4] transition-colors mx-4">
                Sign In
              </button>
            </div>
          </div>
        )}
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
    </nav>
  )
} 