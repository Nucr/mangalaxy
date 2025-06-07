import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Manga Galaxy - Your Ultimate Manga Reading Experience',
  description: 'Discover and read your favorite manga series in a modern, user-friendly interface.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#0f1019] text-white min-h-screen`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-[#1a1b2e] py-8 mt-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 gradient-text">Manga Galaxy</h3>
                <p className="text-gray-400">Your ultimate destination for manga reading.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/browse" className="hover:text-[#6c5ce7] transition-colors">Browse</a></li>
                  <li><a href="/popular" className="hover:text-[#6c5ce7] transition-colors">Popular</a></li>
                  <li><a href="/latest" className="hover:text-[#6c5ce7] transition-colors">Latest</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/category/action" className="hover:text-[#6c5ce7] transition-colors">Action</a></li>
                  <li><a href="/category/romance" className="hover:text-[#6c5ce7] transition-colors">Romance</a></li>
                  <li><a href="/category/fantasy" className="hover:text-[#6c5ce7] transition-colors">Fantasy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/terms" className="hover:text-[#6c5ce7] transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="hover:text-[#6c5ce7] transition-colors">Privacy Policy</a></li>
                  <li><a href="/dmca" className="hover:text-[#6c5ce7] transition-colors">DMCA</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[#2a2b3e] mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Manga Galaxy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 