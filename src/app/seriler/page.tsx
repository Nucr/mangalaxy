"use client";

import Link from "next/link";
import styles from "../page.module.css";
import { useState, useMemo } from "react";

const types = ["Tümü", "Anime", "Manga", "Novel", "Webtoon"];
const categories = [
  "Tümü", "Aksiyon", "Bilim Kurgu", "Canavar", "Dahi Mc", "Doğaüstü", "Dövüş Sanatları", "Dram", "Fantastik", "Fantezi", "Gender Bender", "Geri Dönüş", "Gizem", "Harem", "Hayattan Kesitler", "İntikam", "Josei", "Komedi", "Korku", "Macera", "Murim", "Okul Yaşamı", "Psikolojik", "Reenkarnasyon", "Romantik", "Romantizm", "Seinen", "Shoujo", "Shounen", "Spor", "Tarihi", "Trajedi"];
const statuses = ["Tümü", "Devam Ediyor", "Tamamlandı", "Ara Verildi", "Bırakıldı"];
const sorts = ["En Çok Okunan", "En Az Okunan", "En Yeni", "En Eski", "İsme Göre (A-Z)", "Puana Göre", "Görüntülenmeye Göre"];

export default function Seriler() {
  const [selectedType, setSelectedType] = useState("Tümü");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [selectedSort, setSelectedSort] = useState("En Çok Okunan");
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteStates, setFavoriteStates] = useState(Array(50).fill(false));

  const allMangas = useMemo(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      title: `Soylu Ailenin İşe Yaramaz Oğlu #${i+1}`,
      cover: "/soylu-ailenin-oglu.png",
      description: "Kısa açıklama örneği...",
      href: `/manga/soylu-ailenin-ise-yaramaz-oglu-${i+1}`,
      reads: 1000 + i * 500,
      chapters: 10 + (i * 2) % 91, // 10 ile 100 arası bölüm
      type: ["Manga", "Webtoon", "Anime", "Novel"][i%4],
      category: categories[1 + (i % (categories.length-1))],
      status: statuses[1 + (i % (statuses.length-1))]
    }))
  , []);

  let mangas = allMangas.filter(manga =>
    (selectedType === "Tümü" || manga.type === selectedType) &&
    (selectedCategory === "Tümü" || manga.category === selectedCategory) &&
    (selectedStatus === "Tümü" || manga.status === selectedStatus)
  );
  if(selectedSort === "En Çok Okunan") mangas = mangas.slice().sort((a,b)=>b.reads-a.reads);
  if(selectedSort === "En Az Okunan") mangas = mangas.slice().sort((a,b)=>a.reads-b.reads);
  if(selectedSort === "En Yeni") mangas = mangas.slice().reverse();
  if(selectedSort === "En Eski") mangas = mangas.slice();
  if(selectedSort === "İsme Göre (A-Z)") mangas = mangas.slice().sort((a,b)=>a.title.localeCompare(b.title));

  const mangasPerPage = 20;
  const totalPages = Math.ceil(mangas.length / mangasPerPage);
  const pagedMangas = mangas.slice((currentPage-1)*mangasPerPage, currentPage*mangasPerPage);

  return (
    <div className={styles.page}>
      <div style={{maxWidth: 1200, margin: '0 auto', width: '100%'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2.2em',marginTop:'1.5em'}}>
          <h1 className={styles.title} style={{marginBottom:0}}>Seriler</h1>
        </div>
        <div style={{
          background:'rgba(13,13,13,0.85)',
          borderRadius:18,
          padding:'1.5em 1.2em',
          marginBottom:'2em',
          display:'flex',
          flexDirection:'column',
          gap:'1.2em',
          position: 'relative', // eklendi
          zIndex: 1 // eklendi
        }}>
          <button
            onClick={() => {
              setSelectedType('Tümü');
              setSelectedCategory('Tümü');
              setSelectedStatus('Tümü');
              setSelectedSort('En Çok Okunan');
              setCurrentPage(1);
            }}
            style={{
              position: 'absolute',
              top: 16,
              right: 18,
              background: 'var(--accent-red)',
              color: '#fff',
              border: '1.5px solid var(--accent-red)',
              borderRadius: 7,
              padding: '6px 18px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 12px #e6394644',
              transition: 'background 0.22s cubic-bezier(.4,1.6,.6,1), color 0.22s cubic-bezier(.4,1.6,.6,1), box-shadow 0.22s, transform 0.22s',
              transform: 'scale(1)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'var(--accent-red)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0 2px 12px #e6394644';
              e.currentTarget.style.transform = 'scale(1.07)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'var(--accent-red)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0 2px 12px #e6394644';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >Sıfırla</button>
          <div style={{display:'flex',alignItems:'center',gap:'0.7em',marginBottom:4}}>
            <span style={{color:'var(--accent-blue)',fontWeight:700,fontSize:'1.08rem',display:'flex',alignItems:'center'}}>
              <span style={{fontSize:'1.2em',marginRight:6}}>🗂️</span>Tür:
            </span>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5em'}}>
              {types.map((t,i) => (
                <button key={i} onClick={() => {
                  setSelectedType(t);
                  setCurrentPage(1);
                }} style={{
                  background: t===selectedType ? 'var(--accent-red)' : 'none',
                  color: t===selectedType ? '#fff' : 'var(--accent-red)',
                  border: '1.5px solid var(--accent-red)',
                  borderRadius: 7,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.22s cubic-bezier(.4,1.6,.6,1), color 0.22s cubic-bezier(.4,1.6,.6,1), box-shadow 0.22s, transform 0.22s',
                  boxShadow: t===selectedType ? '0 2px 12px #e6394644' : 'none',
                  transform: t===selectedType ? 'scale(1.07)' : 'scale(1)',
                }}
                onMouseOver={e => {
                  if (t !== selectedType) {
                    e.currentTarget.style.background = 'var(--accent-red)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 2px 12px #e6394644';
                    e.currentTarget.style.transform = 'scale(1.07)';
                  }
                }}
                onMouseOut={e => {
                  if (t !== selectedType) {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'var(--accent-red)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                >{t}</button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'0.7em',marginBottom:4,flexWrap:'wrap'}}>
            <span style={{color:'var(--accent-blue)',fontWeight:700,fontSize:'1.08rem',display:'flex',alignItems:'center'}}>
              <span style={{fontSize:'1.2em',marginRight:6}}>🏷️</span>Kategori:
            </span>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5em'}}>
              {categories.map((cat,i) => (
                <button key={i} onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }} style={{
                  background: cat===selectedCategory ? 'var(--accent-red)' : 'none',
                  color: cat===selectedCategory ? '#fff' : 'var(--accent-red)',
                  border: '1.5px solid var(--accent-red)',
                  borderRadius: 7,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.22s cubic-bezier(.4,1.6,.6,1), color 0.22s cubic-bezier(.4,1.6,.6,1), box-shadow 0.22s, transform 0.22s',
                  boxShadow: cat===selectedCategory ? '0 2px 12px #e6394644' : 'none',
                  transform: cat===selectedCategory ? 'scale(1.07)' : 'scale(1)',
                }}
                onMouseOver={e => {
                  if (cat !== selectedCategory) {
                    e.currentTarget.style.background = 'var(--accent-red)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 2px 12px #e6394644';
                    e.currentTarget.style.transform = 'scale(1.07)';
                  }
                }}
                onMouseOut={e => {
                  if (cat !== selectedCategory) {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'var(--accent-red)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                >{cat}</button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'0.7em',marginBottom:4,flexWrap:'wrap'}}>
            <span style={{color:'var(--accent-blue)',fontWeight:700,fontSize:'1.08rem',display:'flex',alignItems:'center'}}>
              <span style={{fontSize:'1.2em',marginRight:6}}>🟢</span>Durum:
            </span>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5em'}}>
              {statuses.map((s,i) => (
                <button key={i} onClick={() => {
                  setSelectedStatus(s);
                  setCurrentPage(1);
                }} style={{
                  background: s===selectedStatus ? 'var(--accent-red)' : 'none',
                  color: s===selectedStatus ? '#fff' : 'var(--accent-red)',
                  border: '1.5px solid var(--accent-red)',
                  borderRadius: 7,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.22s cubic-bezier(.4,1.6,.6,1), color 0.22s cubic-bezier(.4,1.6,.6,1), box-shadow 0.22s, transform 0.22s',
                  boxShadow: s===selectedStatus ? '0 2px 12px #e6394644' : 'none',
                  transform: s===selectedStatus ? 'scale(1.07)' : 'scale(1)',
                }}
                onMouseOver={e => {
                  if (s !== selectedStatus) {
                    e.currentTarget.style.background = 'var(--accent-red)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 2px 12px #e6394644';
                    e.currentTarget.style.transform = 'scale(1.07)';
                  }
                }}
                onMouseOut={e => {
                  if (s !== selectedStatus) {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'var(--accent-red)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                >{s}</button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'0.7em',marginBottom:4,flexWrap:'wrap'}}>
            <span style={{color:'var(--accent-blue)',fontWeight:700,fontSize:'1.08rem',display:'flex',alignItems:'center'}}>
              <span style={{fontSize:'1.2em',marginRight:6}}>↕️</span>Sırala:
            </span>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5em'}}>
              {sorts.map((s,i) => (
                <button key={i} onClick={() => {
                  setSelectedSort(s);
                  setCurrentPage(1);
                }} style={{
                  background: s===selectedSort ? 'var(--accent-red)' : 'none',
                  color: s===selectedSort ? '#fff' : 'var(--accent-red)',
                  border: '1.5px solid var(--accent-red)',
                  borderRadius: 7,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.22s cubic-bezier(.4,1.6,.6,1), color 0.22s cubic-bezier(.4,1.6,.6,1), box-shadow 0.22s, transform 0.22s',
                  boxShadow: s===selectedSort ? '0 2px 12px #e6394644' : 'none',
                  transform: s===selectedSort ? 'scale(1.07)' : 'scale(1)',
                }}
                onMouseOver={e => {
                  if (s !== selectedSort) {
                    e.currentTarget.style.background = 'var(--accent-red)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 2px 12px #e6394644';
                    e.currentTarget.style.transform = 'scale(1.07)';
                  }
                }}
                onMouseOut={e => {
                  if (s !== selectedSort) {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'var(--accent-red)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{background:'rgba(13,13,13,0.85)',borderRadius:14,padding:'1em 1.2em',display:'flex',alignItems:'center',gap:'1.5em',marginBottom:'1.2em',flexWrap:'wrap'}}>
          <div style={{fontWeight:600,fontSize:'1.08rem',color:'var(--accent-blue)'}}>
            Toplam {mangas.length} manga bulundu.
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'2em',marginBottom:'2.5em'}}>
          {pagedMangas.map((manga,i) => {
            const globalIndex = (currentPage-1)*mangasPerPage + i;
            const isFav = favoriteStates[globalIndex];
            return (
              <Link href={manga.href} key={i} style={{
                background: 'rgba(13,13,13,0.85)',
                borderRadius: 14,
                boxShadow: '0 2px 16px #0005',
                padding: '1.2em 1.2em 1em 1.2em',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#fff',
                transition: 'transform 0.22s cubic-bezier(.4,1.6,.6,1), box-shadow 0.22s cubic-bezier(.4,1.6,.6,1), background 0.22s cubic-bezier(.4,1.6,.6,1)',
                cursor: 'pointer',
                minHeight: 320,
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.045)';
                e.currentTarget.style.boxShadow = '0 8px 32px #e6394633, 0 2px 16px #0007';
                e.currentTarget.style.background = 'rgba(230,57,70,0.13)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 16px #0005';
                e.currentTarget.style.background = 'rgba(13,13,13,0.85)';
              }}
              >
                <button
                  onClick={e => {
                    e.preventDefault();
                    const updated = [...favoriteStates];
                    updated[globalIndex] = !updated[globalIndex];
                    setFavoriteStates(updated);
                  }}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 26,
                    color: isFav ? 'var(--accent-red)' : '#fff',
                    filter: isFav ? 'drop-shadow(0 2px 8px #e6394644)' : 'drop-shadow(0 2px 8px #0007)',
                    transition: 'color 0.18s, filter 0.18s',
                    zIndex: 2
                  }}
                  aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                >
                  {isFav ? '❤️' : '🤍'}
                </button>
                <img src={manga.cover} alt={manga.title} style={{borderRadius:8,boxShadow:'0 2px 8px #0003',width:120,height:170,objectFit:'cover',marginBottom:16}} />
                <div style={{fontWeight:700,fontSize:'1.08rem',fontFamily:'Orbitron,sans-serif',color:'var(--primary)',marginBottom:8,textAlign:'center'}}>{manga.title}</div>
                <div style={{fontSize:'0.98rem',color:'var(--secondary-muted)',textAlign:'center',marginBottom:8}}>{manga.description}</div>
                <div style={{fontSize:'0.95rem',color:'var(--accent-blue)',fontWeight:600,marginTop:'auto',textAlign:'center'}}>
                  Okunma: {manga.reads.toLocaleString()}<br/>
                  Bölüm: {manga.chapters}
                </div>
              </Link>
            );
          })}
        </div>
        <div style={{
          display:'flex',
          justifyContent:'center',
          gap:'0.5em',
          marginBottom:'2em',
          position: 'relative',
          zIndex: 2
        }}>
          {Array.from({length: totalPages}, (_, i) => i+1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              style={{
                background: p===currentPage ? 'var(--accent-red)' : '#23232b',
                color: p===currentPage ? '#fff' : 'var(--accent-red)',
                border: 'none',
                borderRadius: 7,
                padding: '0.4em 1.1em',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.22s cubic-bezier(.4,1.6,.6,1), color 0.22s cubic-bezier(.4,1.6,.6,1), box-shadow 0.22s, transform 0.22s',
                pointerEvents: 'auto',
                boxShadow: p===currentPage ? '0 2px 12px #e6394644' : 'none',
                transform: p===currentPage ? 'scale(1.07)' : 'scale(1)',
              }}
              onMouseOver={e => {
                if (p !== currentPage) {
                  e.currentTarget.style.background = 'var(--accent-red)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.boxShadow = '0 2px 12px #e6394644';
                  e.currentTarget.style.transform = 'scale(1.07)';
                }
              }}
              onMouseOut={e => {
                if (p !== currentPage) {
                  e.currentTarget.style.background = '#23232b';
                  e.currentTarget.style.color = 'var(--accent-red)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
} 