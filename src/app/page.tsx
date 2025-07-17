'use client';
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

const featuredManga = [
  {
    title: "One Piece",
    cover: "https://mangalaxy-static.vercel.app/onepiece.jpg",
    description: "Efsanevi korsanların macerası!",
  },
  {
    title: "Attack on Titan",
    cover: "https://mangalaxy-static.vercel.app/aot.jpg",
    description: "İnsanlığın devlere karşı mücadelesi!",
  },
  {
    title: "Naruto",
    cover: "https://mangalaxy-static.vercel.app/naruto.jpg",
    description: "Bir ninja olma hayaliyle yola çıkan Naruto'nun hikayesi!",
  },
];

const navLinks = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Seriler", href: "/seriler" },
  { name: "Topluluk", href: "/topluluk" },
  { name: "Galaxy Plus", href: "/plus" },
  { name: "Başarımlar", href: "/basarimlar" },
];

const lastRead = [
  { title: 'Solo Leveling', lastChapter: 'Bölüm 120', cover: '/soylu-ailenin-oglu.png' },
  { title: 'One Piece', lastChapter: 'Bölüm 1112', cover: '/soylu-ailenin-oglu.png' },
  { title: 'Soylu Ailenin İşe Yaramaz Oğlu', lastChapter: 'Bölüm 156', cover: '/soylu-ailenin-oglu.png' },
  { title: 'Akademinin Dehası', lastChapter: 'Bölüm 106', cover: '/soylu-ailenin-oglu.png' },
  { title: 'Dahi Kara Büyücünün Yaşamı', lastChapter: 'Bölüm 36', cover: '/soylu-ailenin-oglu.png' },
];

const latestMangaAll = Array.from({ length: 36 }).map((_, i) => ({
  title: 'Soylu Ailenin İşe Yaramaz Oğlu',
  cover: '/soylu-ailenin-oglu.png',
  chapters: [
    { name: `Bölüm ${i * 3 + 1}`, url: '#' },
    { name: `Bölüm ${i * 3 + 2}`, url: '#' },
    { name: `Bölüm ${i * 3 + 3}`, url: '#' },
  ]
}));

const trendingManga = [
  { title: "Trend Manga 1", cover: "/soylu-ailenin-oglu.png", reads: 9889 },
  { title: "Trend Manga 2", cover: "/soylu-ailenin-oglu.png", reads: 5909 },
  { title: "Trend Manga 3", cover: "/soylu-ailenin-oglu.png", reads: 12034 },
  { title: "Trend Manga 4", cover: "/soylu-ailenin-oglu.png", reads: 8450 },
  { title: "Trend Manga 5", cover: "/soylu-ailenin-oglu.png", reads: 11002 },
  { title: "Trend Manga 6", cover: "/soylu-ailenin-oglu.png", reads: 13456 },
  { title: "Trend Manga 7", cover: "/soylu-ailenin-oglu.png", reads: 10234 },
  { title: "Trend Manga 8", cover: "/soylu-ailenin-oglu.png", reads: 9001 },
  { title: "Trend Manga 9", cover: "/soylu-ailenin-oglu.png", reads: 15000 },
  { title: "Trend Manga 10", cover: "/soylu-ailenin-oglu.png", reads: 11200 },
];

const communityUpdates = [
  {
    title: 'Yeni Tema: Galactic Eclipse Yayında!',
    author: 'Admin',
    date: '10.07.2025',
    excerpt: 'Sitemizin yeni teması yayında! Artık daha modern ve uzay temalı bir arayüz ile mangalarınızı keşfedebilirsiniz...'
  },
  {
    title: 'Mobil Uyumlu Okuyucu!',
    author: 'Moderatör',
    date: '08.07.2025',
    excerpt: 'Manga okuyucu artık tüm mobil cihazlarda çok daha hızlı ve akıcı çalışıyor. Deneyimlerinizi bizimle paylaşın!'
  }
];

const galaxyPlusFeatures = [
  { icon: '⭐', title: 'Reklamsız Deneyim', desc: 'Hiçbir reklam görmeden okuyun' },
  { icon: '💬', title: 'Yorum Özellikleri', desc: 'Gelişmiş yorum ve etkileşim imkanları' },
];

// Tip tanımları
interface Chapter {
  bolum_no: string;
  bolum_adi?: string;
}

interface Manga {
  _id?: string;
  title: string;
  cover: string;
  chapters: Chapter[];
}

export async function fetchMangalar(
  setMangalar: React.Dispatch<React.SetStateAction<Manga[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  setLoading(true);
  try {
    const res = await fetch("/api/mangalar");
    if (!res.ok) throw new Error("Veri alınamadı");
    const data = await res.json();
    setMangalar(data);
    setLoading(false);
  } catch (err) {
    setError("Manga verileri alınamadı.");
    setLoading(false);
  }
}

export default function Home() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [mangalar, setMangalar] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mangasPerPage = 12;
  const totalPages = Math.ceil(mangalar.length / mangasPerPage);
  const latestManga = mangalar.slice((page - 1) * mangasPerPage, page * mangasPerPage);

  useEffect(() => {
    fetchMangalar(setMangalar, setLoading, setError);
    const interval = setInterval(() => {
      fetchMangalar(setMangalar, setLoading, setError);
    }, 10000); // 10 saniyede bir günceller
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/arama?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Mangalaxy&apos;ye Hoşgeldiniz!</h1>
        <p className={styles.description}>
          En popüler mangaları keşfet, oku ve favorilerini listele. <br />
          Manga evrenine adım atmak için doğru yerdesin!
        </p>
        <section className={styles.communitySection}>
          <h2 className={styles.communityTitle}>Topluluk Güncellemeleri</h2>
          <div className={styles.communityList}>
            {communityUpdates.map((item, i) => (
              <div className={styles.communityItem} key={i}>
                <div className={styles.communityHeader}>
                  <span className={styles.communityUpdateTitle}>{item.title}</span>
                  <span className={styles.communityMeta}>{item.author} • {item.date}</span>
                </div>
                <div className={styles.communityExcerpt}>{item.excerpt}</div>
                <a href="/topluluk" className={styles.communityReadMore}>Devamını oku</a>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.lastReadSection}>
          <h2 className={styles.lastReadTitle}>Son Okunanlar</h2>
          <div className={styles.lastReadList}>
            {lastRead.map((item, i) => {
              const slug = item.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
              const bolumNo = item.lastChapter.replace(/\D/g, '');
              return (
                <div className={styles.lastReadItem} key={i}>
                  <Link href={`/manga/${slug}`}>
                    <Image src={item.cover} alt={item.title} className={styles.lastReadCover} width={48} height={68} />
                  </Link>
                  <Link href={`/manga/${slug}`} className={styles.lastReadManga}>{item.title}</Link>
                  <Link href={`/manga/${slug}/bolum/${bolumNo}`} className={styles.lastReadChapter}>{item.lastChapter}</Link>
                </div>
              );
            })}
          </div>
        </section>
        <section className={styles.galaxyPlusSection}>
          <div className={styles.galaxyPlusMain}>
            <div className={styles.galaxyPlusIcon}>👑</div>
            <div className={styles.galaxyPlusTitle}>Galaxy Plus'a Yükselt!</div>
            <div className={styles.galaxyPlusDesc}>Galaxy Plus üyesi olarak reklamsız, hızlı ve ayrıcalıklı bir deneyim yaşayın.</div>
            <a href="/plus" className={styles.galaxyPlusBtn}>Galaxy Plus'a Geç</a>
          </div>
          <div className={styles.galaxyPlusFeatures}>
            {galaxyPlusFeatures.map((f, i) => (
              <div className={styles.galaxyPlusFeature} key={i}>
                <span className={styles.galaxyPlusFeatureIcon}>{f.icon}</span>
                <div>
                  <div className={styles.galaxyPlusFeatureTitle}>{f.title}</div>
                  <div className={styles.galaxyPlusFeatureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.latestAndTrendingWrapper}>
          <section className={styles.latestSection}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5em'}}>
              <h2 className={styles.latestTitle} style={{marginBottom:0}}>Son Yüklenenler</h2>
              <Link href="/seriler" className={styles.seeAllBtn}>Tümünü Gör</Link>
            </div>
            {loading ? (
              <div style={{color:'#00c3ff',textAlign:'center',margin:'2em 0'}}>Yükleniyor...</div>
            ) : error ? (
              <div style={{color:'#ff2d55',textAlign:'center',margin:'2em 0'}}>{error}</div>
            ) : (
              <div className={styles.latestGrid}>
                {latestManga.map((manga, i) => {
                  const slug = manga.title?.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') || '';
                  return (
                    <div className={styles.latestCard} key={manga._id || i}>
                      <Link href={`/manga/${slug}`}>
                        <Image
                          src={manga.cover || "/soylu-ailenin-oglu.png"}
                          alt={manga.title || "Manga"}
                          width={100}
                          height={140}
                          className={styles.latestCover}
                        />
                      </Link>
                      <div className={styles.latestCardContent}>
                        <Link href={`/manga/${slug}`} className={styles.latestCardTitle}>
                          <h3>{manga.title}</h3>
                        </Link>
                        <div className={styles.chapterList}>
                          {Array.isArray(manga.chapters) && manga.chapters.length > 0 ? (
                            manga.chapters.slice(-3).reverse().map((chapter: Chapter, idx: number) => (
                              <Link href={`/manga/${slug}/bolum/${chapter.bolum_no}`} className={styles.chapterBox} key={idx}>
                                {chapter.bolum_adi ? chapter.bolum_adi : `Bölüm No: ${chapter.bolum_no}`}
                              </Link>
                            ))
                          ) : (
                            <span style={{color:'#888',fontSize:'0.98rem'}}>Bölüm yok</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {mangalar.length > mangasPerPage && (
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={page === i + 1 ? styles.activePage : styles.pageBtn}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
          <aside className={styles.trendingSection}>
            <h2 className={styles.trendingTitle}>Trend Mangalar</h2>
            <div className={styles.trendingList}>
              {trendingManga.map((manga, i) => {
                const slug = manga.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
                return (
                  <div className={styles.trendingCard} key={i}>
                    <Link href={`/manga/${slug}`}>
                      <Image
                        src={manga.cover}
                        alt={manga.title}
                        width={60}
                        height={90}
                        className={styles.trendingCover}
                      />
                    </Link>
                    <div className={styles.trendingInfo}>
                      <Link href={`/manga/${slug}`} className={styles.trendingName}>{manga.title}</Link>
                      <span className={styles.trendingReads}>{manga.reads.toLocaleString()} okunma</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
