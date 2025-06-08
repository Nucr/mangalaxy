'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold gradient-text">
            MangaReader
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/manga" className="text-gray-300 hover:text-white transition-colors">
              Mangalar
            </Link>
            <Link href="/latest" className="text-gray-300 hover:text-white transition-colors">
              Son Eklenenler
            </Link>
            <Link href="/popular" className="text-gray-300 hover:text-white transition-colors">
              Popüler
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 