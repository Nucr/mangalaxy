import Link from 'next/link'

export default function AnnouncementBoard() {
  return (
    <section className="py-16 bg-[#0f1019]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Aylık Editör Seçimi */}
          <div className="card p-6 flex items-center space-x-6">
            <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src="/editor-choice-bg.jpg"
                alt="Editor's Choice"
                className="absolute inset-0 object-cover w-full h-full"
              />
            </div>
            <div>
              <span className="bg-[#6c5ce7] text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">Webtoon</span>
              <h3 className="font-bold text-xl mb-2">Bilge Okuyucunun Bakış Açısı</h3>
              <p className="text-gray-400 text-sm">son zamanlarda en popüler</p>
            </div>
          </div>

          {/* Topluluk Güncelleme */}
          <div className="card p-6">
            <h3 className="font-bold text-xl mb-2">Topluluk güncelleme</h3>
            <p className="text-gray-400 text-sm mb-4">duyuru panosu</p>
            <p className="text-gray-300 text-sm mb-4">
              Merlin Plus satışları yeniden başlamıştır. İlgilenenler veya destek olmak isteyenler, Merlin Plus sayfasını ziyaret ederek detaylı bilgi alabilirsiniz.
            </p>
            <div className="flex items-center justify-between text-gray-500 text-xs">
              <span>07.06.2025</span>
              <Link href="#" className="text-[#6c5ce7] hover:text-[#a29bfe] transition-colors duration-200">
                Devamını Oku →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 