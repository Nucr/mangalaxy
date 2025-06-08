import React from 'react';

export default function SeriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold gradient-text mb-8">Tüm Seriler</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Section */}
        <aside className="w-full lg:w-1/4 bg-[#1a1b2e] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-white">Filtreler</h2>

          {/* Tür Filter */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-[#6c5ce7]">Tür:</h3>
            <div className="flex flex-wrap gap-2">
              <button className="filter-button active">Tümü</button>
              <button className="filter-button">Anime</button>
              <button className="filter-button">Manga</button>
              <button className="filter-button">Novel</button>
              <button className="filter-button">Webtoon</button>
            </div>
          </div>

          {/* Kategori Filter */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-[#6c5ce7]">Kategori:</h3>
            <div className="flex flex-wrap gap-2">
              <button className="filter-button active">Tümü</button>
              <button className="filter-button">Aksiyon</button>
              <button className="filter-button">Bilim Kurgu</button>
              <button className="filter-button">Canavar</button>
              <button className="filter-button">Dahi Mc</button>
              <button className="filter-button">Doğaüstü</button>
              <button className="filter-button">Dövüş Sanatları</button>
              <button className="filter-button">Dram</button>
              <button className="filter-button">Fantastik</button>
              <button className="filter-button">Fantezi</button>
              <button className="filter-button">Gender Bender</button>
              <button className="filter-button">Geri Dönüş</button>
              <button className="filter-button">Gizem</button>
              <button className="filter-button">Harem</button>
              <button className="filter-button">Hayattan Kesitler</button>
              <button className="filter-button">İntikam</button>
              <button className="filter-button">Josei</button>
              <button className="filter-button">Komedi</button>
              <button className="filter-button">Korku</button>
              <button className="filter-button">Macera</button>
              <button className="filter-button">Murim</button>
              <button className="filter-button">Okul Yaşamı</button>
              <button className="filter-button">Psikolojik</button>
              <button className="filter-button">Reenkarnme</button>
              <button className="filter-button">Romantik</button>
              <button className="filter-button">Romantizm</button>
              <button className="filter-button">Seinen</button>
              <button className="filter-button">Shoujo</button>
              <button className="filter-button">Shounen</button>
              <button className="filter-button">Spor</button>
              <button className="filter-button">Tarihi</button>
              <button className="filter-button">Trajedi</button>
            </div>
          </div>

          {/* Durum Filter */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-[#6c5ce7]">Durum:</h3>
            <div className="flex flex-wrap gap-2">
              <button className="filter-button active">Tümü</button>
              <button className="filter-button">Devam Ediyor</button>
              <button className="filter-button">Tamamlandı</button>
              <button className="filter-button">Ara Verildi</button>
              <button className="filter-button">İptal Edildi</button>
            </div>
          </div>

          {/* Sırala Filter */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-[#6c5ce7]">Sırala:</h3>
            <div className="flex flex-wrap gap-2">
              <button className="filter-button active">En Yeni</button>
              <button className="filter-button">En Eski</button>
              <button className="filter-button">İsme Göre (A-Z)</button>
              <button className="filter-button">Puana Göre</button>
              <button className="filter-button">Görüntülenmeye Göre</button>
            </div>
          </div>
        </aside>

        {/* Manga List Section */}
        <main className="w-full lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Toplam Manga: <span className="text-[#6c5ce7]">12345</span></h2>
            {/* You can add sorting/view options here if needed */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Manga cards will go here */}
            {[...Array(8)].map((_, i) => ( // Placeholder for 8 manga cards
              <div key={i} className="card h-full animate-pulse">
                <div className="relative w-full aspect-[2/3] loading-skeleton rounded-t-lg" />
                <div className="p-4">
                  <div className="h-5 loading-skeleton rounded w-3/4 mb-2" />
                  <div className="h-3 loading-skeleton rounded w-1/2 mb-1" />
                  <div className="h-3 loading-skeleton rounded w-2/3 mb-3" />
                  <div className="h-4 loading-skeleton rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
          {/* Pagination will go here */}
        </main>
      </div>
    </div>
  );
} 