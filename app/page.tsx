import Image from 'next/image'
import Link from 'next/link'
import LatestUpdatesSection from '@/components/LatestUpdatesSection'
import TrendingMangaSection from '@/components/TrendingMangaSection'
import AnnouncementBoard from '@/components/AnnouncementBoard'

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
              Bir Sonraki Favori Manganızı Keşfedin
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Popüler serilerden gizli mücevherlere kadar binlerce manga başlığını keşfedin.
              Okuma yolculuğunuza bugün başlayın.
            </p>
            <div className="flex gap-4">
              <Link href="/browse" className="btn-primary">
                Okumaya Başla
              </Link>
              <Link href="/popular" className="btn-secondary">
                Popüler Başlıklar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Duyuru Panosu Bölümü - En üste taşıdık */}
      <AnnouncementBoard />

      {/* En Son Güncellemeler ve Trend Olanlar Bölümü - Yan yana */}
      <section className="py-16 bg-[#0f1019]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LatestUpdatesSection />
            </div>
            <div>
              <TrendingMangaSection />
            </div>
          </div>
        </div>
      </section>

      {/* Kategoriler Bölümü */}
      <section className="py-16 bg-[#1a1b2e]/50">
        <div className="container">
          <h2 className="text-3xl font-bold gradient-text mb-8">Kategoriye Göre Göz At</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Aksiyon', icon: '⚔️' },
              { name: 'Romantik', icon: '❤️' },
              { name: 'Fantastik', icon: '✨' },
              { name: 'Korku', icon: '👻' }
            ].map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name.toLowerCase().replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ü/g, 'u')}`}
                className="card p-6 text-center hover:bg-[#6c5ce7]/10 transition-colors duration-200"
              >
                <span className="text-4xl mb-2 block">{category.icon}</span>
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Haber Bülteni Bölümü */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold gradient-text mb-4">Haberdar Kalın</h2>
            <p className="text-gray-400 mb-8">
              Yeni manga yayınları ve özel içerikler hakkında en son güncellemeleri almak için bültenimize abone olun.
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresinizi girin"
                className="input-primary flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Abone Ol
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
} 