"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../AdminSidebar";

const categories = ["Shounen", "Seinen", "Shoujo", "Josei", "Isekai", "Fantezi", "Macera", "Aksiyon"];
const statuses = ["Devam Ediyor", "Tamamlandı"];

export default function YeniMangaEkle() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [chapters, setChapters] = useState("");
  const [status, setStatus] = useState(statuses[0]);
  const [desc, setDesc] = useState("");
  const router = useRouter();

  return (
    <div style={{
      minHeight: "80vh",
      padding: "48px 0",
      maxWidth: 1200,
      margin: "0 auto",
      display: "flex",
      flexDirection: "row"
    }}>
      <AdminSidebar />
      <main style={{ flex: 1 }}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
          <h1 style={{color:'#00c3ff',fontWeight:800,fontSize:'2rem',fontFamily:'Orbitron, Poppins, sans-serif',margin:0}}>Yeni Manga Ekle</h1>
          <span style={{
            background:'#23232b',
            color:'#b3b3b3',
            fontWeight:600,
            fontSize:'1rem',
            borderRadius:8,
            padding:'4px 14px',
            letterSpacing:'.5px',
            border:'1.5px solid #222',
            boxShadow:'0 2px 8px #0002',
            userSelect:'none',
          }}>Formu doldur ve kaydet</span>
        </div>
        <form style={{maxWidth:500,margin:'0 auto',background:'#18181b',padding:32,borderRadius:16,boxShadow:'0 2px 12px #0005',display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label style={{color:'#00c3ff',fontWeight:600}}>Manga Adı *</label>
            <input value={name} onChange={e=>setName(e.target.value)} required style={{padding:'10px 14px',borderRadius:8,border:'1.5px solid #222',background:'#23232b',color:'#fff',fontSize:'1.08rem',outline:'none',transition:'border 0.18s'}} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label style={{color:'#00c3ff',fontWeight:600}}>Yazar *</label>
            <input value={author} onChange={e=>setAuthor(e.target.value)} required style={{padding:'10px 14px',borderRadius:8,border:'1.5px solid #222',background:'#23232b',color:'#fff',fontSize:'1.08rem',outline:'none',transition:'border 0.18s'}} />
          </div>
          <div style={{display:'flex',gap:16}}>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
              <label style={{color:'#00c3ff',fontWeight:600}}>Kategori</label>
              <select value={category} onChange={e=>setCategory(e.target.value)} style={{padding:'10px 14px',borderRadius:8,border:'1.5px solid #222',background:'#23232b',color:'#fff',fontSize:'1.08rem',outline:'none'}}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
              <label style={{color:'#00c3ff',fontWeight:600}}>Bölüm Sayısı</label>
              <input type="number" min={1} value={chapters} onChange={e=>setChapters(e.target.value)} style={{padding:'10px 14px',borderRadius:8,border:'1.5px solid #222',background:'#23232b',color:'#fff',fontSize:'1.08rem',outline:'none'}} />
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label style={{color:'#00c3ff',fontWeight:600}}>Yayın Durumu</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={{padding:'10px 14px',borderRadius:8,border:'1.5px solid #222',background:'#23232b',color:'#fff',fontSize:'1.08rem',outline:'none'}}>
              {statuses.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label style={{color:'#00c3ff',fontWeight:600}}>Kısa Açıklama</label>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={4} style={{padding:'10px 14px',borderRadius:8,border:'1.5px solid #222',background:'#23232b',color:'#fff',fontSize:'1.08rem',outline:'none',resize:'vertical'}} />
          </div>
          <div style={{display:'flex',gap:16,marginTop:8}}>
            <button type="submit" style={{flex:1,background:'#00c3ff',color:'#fff',border:'none',borderRadius:8,padding:'12px 0',fontWeight:700,fontSize:'1.08rem',cursor:'pointer',boxShadow:'0 2px 8px #00c3ff44',transition:'background 0.18s'}}>Kaydet</button>
            <button type="button" onClick={()=>router.back()} style={{flex:1,background:'#23232b',color:'#b3b3b3',border:'none',borderRadius:8,padding:'12px 0',fontWeight:700,fontSize:'1.08rem',cursor:'pointer',transition:'background 0.18s'}}>Vazgeç</button>
          </div>
        </form>
      </main>
    </div>
  );
} 