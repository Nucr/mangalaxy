"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "../../page.module.css";
import Image from "next/image";

// Tip tanımları
type Chapter = {
  bolum_no: string;
  bolum_adi?: string;
};

type Manga = {
  _id?: string;
  title: string;
  cover: string;
  desc?: string;
  categories?: string[];
  chapters: Chapter[];
};

export default function MangaOzetPage() {
  const { slug } = useParams();
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Bölüm arama ve sayfalama için state
  const [chapterSearch, setChapterSearch] = useState("");
  const [chapterPage, setChapterPage] = useState(1);
  const chaptersPerPage = 12;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/mangalar/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setManga(data);
        setError("");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Bölüm filtreleme ve sayfalama
  const filteredChapters = Array.isArray(manga?.chapters)
    ? manga.chapters.filter((c: Chapter) => (c.bolum_adi || "").toLowerCase().includes(chapterSearch.toLowerCase()) || (c.bolum_no || "").toString().includes(chapterSearch))
    : [];
  const totalChapterPages = Math.ceil(filteredChapters.length / chaptersPerPage);
  const paginatedChapters = filteredChapters.slice((chapterPage-1)*chaptersPerPage, chapterPage*chaptersPerPage);

  if (loading) return <div style={{color:'#00c3ff',textAlign:'center',margin:'2em 0'}}>Yükleniyor...</div>;
  if (error) return <div style={{color:'#e63946',textAlign:'center',margin:'2em 0'}}>{error}</div>;
  if (!manga) return null;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{display:'flex',justifyContent:'center',alignItems:'flex-start',marginTop:32}}>
          <div style={{background:'#18181b',borderRadius:18,padding:'32px 32px 24px 32px',boxShadow:'0 2px 16px #0007',display:'flex',gap:32,minWidth:700,maxWidth:900,width:'100%'}}>
            {/* Sol: Kapak ve değerlendirme */}
            <div style={{minWidth:220,maxWidth:220,display:'flex',flexDirection:'column',alignItems:'center',gap:18}}>
              <Image src={manga.cover || "/soylu-ailenin-oglu.png"} alt={manga.title} width={200} height={280} style={{objectFit:'cover',borderRadius:14,boxShadow:'0 2px 16px #0007'}} />
              {/* Değerlendirme kutusu */}
              <div style={{background:'#23232b',borderRadius:14,padding:'18px 24px',display:'inline-block',boxShadow:'0 2px 8px #0005',minWidth:180,marginTop:8}}>
                <div style={{color:'#fff',fontWeight:700,fontSize:'1.13rem',marginBottom:8}}>Değerlendirme</div>
                <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:6}}>
                  {[1,2,3,4,5].map(i=>(<span key={i} style={{fontSize:26,color:'#FFD700'}}>★</span>))}
                </div>
                <div style={{color:'#b3b3b3',fontWeight:600,fontSize:'1.05rem'}}>5.0/5 (1 oy)</div>
              </div>
            </div>
            {/* Sağ: Bilgiler */}
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:18}}>
              <h1 style={{color:'#fff',fontWeight:800,fontSize:'2.1rem',fontFamily:'Orbitron, Poppins, sans-serif',marginBottom:0}}>{manga.title}</h1>
              <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:2}}>
                {Array.isArray(manga.categories) && manga.categories.map((cat:string,i:number)=>(
                  <span key={i} style={{background:'#00c3ff',color:'#fff',padding:'7px 18px',borderRadius:18,fontWeight:700,fontSize:'1.02rem',letterSpacing:0.5,boxShadow:'0 2px 8px #00c3ff33'}}>{cat}</span>
                ))}
              </div>
              <div style={{color:'#fff',fontSize:'1.13rem',margin:'10px 0 18px 0',fontWeight:500,lineHeight:1.6}}>{manga.desc}</div>
              <div style={{display:'flex',gap:16,margin:'18px 0 0 0'}}>
                <button style={{background:'#00c3ff',color:'#fff',border:'none',borderRadius:8,padding:'12px 28px',fontWeight:700,fontSize:'1.08rem',cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:20}}>🔖</span> Favorilere Ekle
                </button>
                <button style={{background:'#23232b',color:'#00c3ff',border:'none',borderRadius:8,padding:'12px 28px',fontWeight:700,fontSize:'1.08rem',cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:20}}>🔗</span> Paylaş
                </button>
                <button style={{background:'#e63946',color:'#fff',border:'none',borderRadius:8,padding:'12px 28px',fontWeight:700,fontSize:'1.08rem',cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:20}}>🚩</span> Hata Bildirme
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Bölümler kutusu */}
        <div style={{background:'#18181b',borderRadius:16,padding:'2em',boxShadow:'0 2px 16px #0005',margin:'32px auto 0 auto',maxWidth:900,minWidth:400}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
            <h2 style={{color:'#00c3ff',fontWeight:700,fontSize:'1.25rem',margin:0}}>Bölümler</h2>
            <input value={chapterSearch} onChange={e=>{setChapterSearch(e.target.value);setChapterPage(1);}} placeholder="Bölüm ara..." style={{padding:'8px 14px',borderRadius:8,minWidth:180,border:'1px solid #23232b',background:'#23232b',color:'#00c3ff',fontSize:'1rem',outline:'none',boxShadow:'0 2px 8px #0002',transition:'border 0.18s'}} />
          </div>
          {paginatedChapters.length > 0 ? (
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5em',justifyItems:'center'}}>
              {paginatedChapters.map((chapter: Chapter,idx:number)=>(
                <Link href={`/manga/${slug}/bolum/${chapter.bolum_no}`} key={idx} style={{background:'#23232b',color:'#00c3ff',padding:'22px 0',borderRadius:14,fontWeight:700,fontSize:'1.13rem',textDecoration:'none',boxShadow:'0 2px 8px #00c3ff22',transition:'background 0.18s',display:'flex',alignItems:'center',justifyContent:'center',width:'100%',textAlign:'center',minHeight:60}}>
                  {chapter.bolum_adi ? chapter.bolum_adi : `Bölüm No: ${chapter.bolum_no}`}
                </Link>
              ))}
            </div>
          ) : (
            <div style={{color:'#888',fontSize:'1.08rem',textAlign:'center'}}>Henüz bölüm eklenmemiş.</div>
          )}
          {/* Sayfalama */}
          {totalChapterPages > 1 && (
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8,marginTop:32}}>
              <button onClick={() => setChapterPage(p => Math.max(1, p - 1))} disabled={chapterPage === 1} style={{padding:'6px 14px',borderRadius:6,border:'none',background:'#23232b',color:'#00c3ff',fontWeight:600,cursor:chapterPage===1?'not-allowed':'pointer',opacity:chapterPage===1?0.5:1}}>Geri</button>
              {Array.from({length: totalChapterPages}, (_, i) => i + 1).map(num => (
                <button key={num} onClick={() => setChapterPage(num)} style={{padding:'6px 12px',borderRadius:6,border:'none',background:num===chapterPage?'#00c3ff':'#23232b',color:num===chapterPage?'#fff':'#00c3ff',fontWeight:700,cursor:'pointer',transition:'background 0.18s, color 0.18s'}}>{num}</button>
              ))}
              <button onClick={() => setChapterPage(p => Math.min(totalChapterPages, p + 1))} disabled={chapterPage === totalChapterPages} style={{padding:'6px 14px',borderRadius:6,border:'none',background:'#23232b',color:'#00c3ff',fontWeight:600,cursor:chapterPage===totalChapterPages?'not-allowed':'pointer',opacity:chapterPage===totalChapterPages?0.5:1}}>İleri</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 