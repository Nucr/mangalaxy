'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchAnilistData, GET_RECENT_MANGAS } from '@/lib/anilist'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [latestUpdates, setLatestUpdates] = useState([])

  useEffect(() => {
    const loadLatestUpdates = async () => {
      try {
        const data = await fetchAnilistData(GET_RECENT_MANGAS, { page: 1, perPage: 9 })
        const updates = data.Page.media.map((manga: any) => ({
          id: manga.id,
          title: manga.title.romaji || manga.title.english || manga.title.native,
          image: manga.coverImage.large || manga.coverImage.medium || manga.coverImage.extraLarge,
        }))
        setLatestUpdates(updates)
      } catch (error) {
        console.error("Failed to fetch latest updates:", error)
      }
    }

    loadLatestUpdates()
  }, [])

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

        {/* Latest Updates Grid */}
        <div className="hidden md:grid grid-cols-9 gap-2 py-4 border-t border-[#2a2b3e]">
          {latestUpdates.length > 0 ? (
            latestUpdates.map((manga: any) => (
              <Link href={`/manga/${manga.id}`} key={manga.id} className="group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                  <Image
                    src={manga.image}
                    alt={manga.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium truncate">{manga.title}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-9">
              <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-9 gap-2">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-[#2a2b3e] rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 