import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Manga Galaxy - Your Ultimate Manga Reading Experience',
  description: 'Discover and read your favorite manga series in a modern, user-friendly interface. Browse thousands of titles, from popular series to hidden gems.',
  keywords: 'manga, anime, comics, reading, japanese comics, manga reader, online manga',
  authors: [{ name: 'Manga Galaxy Team' }],
  openGraph: {
    title: 'Manga Galaxy - Your Ultimate Manga Reading Experience',
    description: 'Discover and read your favorite manga series in a modern, user-friendly interface.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Manga Galaxy',
  },
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
        <footer className="bg-[#1a1b2e] py-12 mt-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold gradient-text">Manga Galaxy</h3>
                <p className="text-gray-400">Your ultimate destination for manga reading. Discover new stories, follow your favorite series, and join our community of manga enthusiasts.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li><a href="/browse" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Browse</a></li>
                  <li><a href="/popular" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Popular</a></li>
                  <li><a href="/latest" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Latest</a></li>
                  <li><a href="/random" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Random</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Categories</h4>
                <ul className="space-y-3">
                  <li><a href="/category/action" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Action</a></li>
                  <li><a href="/category/romance" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Romance</a></li>
                  <li><a href="/category/fantasy" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Fantasy</a></li>
                  <li><a href="/category/horror" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Horror</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-3">
                  <li><a href="/terms" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Privacy Policy</a></li>
                  <li><a href="/dmca" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">DMCA</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-[#6c5ce7] transition-colors">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[#2a2b3e] mt-12 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Manga Galaxy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 