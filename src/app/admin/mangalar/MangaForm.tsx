"use client";
import React, { useState } from "react";
import axios from 'axios';
import Image from "next/image";

const categories = [
  "Aksiyon", "Macera", "Fantastik", "Komedi", "Romantik", "Dram", "Doğaüstü", "Okul", "Tarihi", "Bilim Kurgu", "Korku", "Gerilim", "Seinen", "Shounen", "Shoujo", "Josei", "Isekai", "Reenkarnasyon", "Manhwa", "Manhua", "Webtoon", "Slice of Life", "Spor", "Yaoi", "Yuri", "Harem", "Ecchi", "Polisiye", "Psikolojik", "Askeri", "Vampir", "Müzik", "Mecha", "One Shot", "Superpower", "Gizem", "Martial Arts", "Shoujo Ai", "Shounen Ai"
];
const statuses = ["Devam Ediyor", "Tamamlandı"];

interface Chapter {
  bolum_no: string;
  bolum_adi?: string;
  // Diğer alanlar gerekiyorsa ekle
}

type MangaFormType = {
  title: string;
  author: string;
  categories: string[];
  chapters: Chapter[];
  status: string;
  desc: string;
  cover?: string;
};

export default function MangaForm({
  initial,
  onSubmit,
  loading,
  errorMsg,
  successMsg,
  submitText = "Kaydet"
}: {
  initial: MangaFormType,
  onSubmit: (form: MangaFormType) => void,
  loading?: boolean,
  errorMsg?: string,
  successMsg?: string,
  submitText?: string
}) {
  const [form, setForm] = useState<MangaFormType>(initial);
  const [coverUrl, setCoverUrl] = useState<string|null>(initial.cover || null);
  const [coverFile, setCoverFile] = useState<File|null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState<string|null>(null);

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setCoverFile(file);
    setCoverError(null);
    if (file) {
      setCoverUploading(true);
      try {
        const formData = new FormData();
        formData.append('cover', file);
        const res = await axios.post('/api/upload/cover', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data?.url) {
          setCoverUrl(res.data.url);
          setForm((f:MangaFormType)=>({...f,cover: res.data.url}));
        } else {
          setCoverUrl(null);
          setForm((f:MangaFormType)=>({...f,cover: ''}));
          setCoverError('Kapak yüklenemedi.');
        }
      } catch (err: unknown) {
        setCoverUrl(null);
        setForm((f:MangaFormType)=>({...f,cover: ''}));
        setCoverError('Kapak yüklenemedi.');
      }
      setCoverUploading(false);
    } else {
      setCoverUrl(null);
      setForm((f:MangaFormType)=>({...f,cover: ''}));
    }
  }

  function handleCategoryChange(cat: string) {
    setForm((f:MangaFormType)=>{
      const cats = Array.isArray(f.categories) ? f.categories : [];
      return cats.includes(cat)
        ? { ...f, categories: cats.filter((c:string)=>c!==cat) }
        : { ...f, categories: [...cats, cat] };
    });
  }

  return (
    <form onSubmit={e=>{e.preventDefault();onSubmit({...form, cover: coverFile ? coverUrl : form.cover, coverFile});}} style={{display:'flex',gap:32,alignItems:'flex-start'}}>
      {/* Sol: Kapak */}
      <div style={{minWidth:220,maxWidth:220,display:'flex',flexDirection:'column',alignItems:'center',gap:18}}>
        <input type="file" accept="image/*" onChange={handleCoverChange} style={{marginBottom:8}} />
        <div style={{width:120,height:180,background:'#23232b',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',color:'#888',fontWeight:600,fontSize:'1.1rem',boxShadow:'0 2px 8px #0003',position:'relative'}}>
          {coverUploading && <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'#0008',color:'#00c3ff',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:12,fontWeight:700,fontSize:'1.1rem',zIndex:2}}>Yükleniyor...</div>}
          {coverUrl ? (
            <Image src={coverUrl} alt="Kapak" width={120} height={180} style={{objectFit:'cover',borderRadius:12}} />
          ) : "Kapak Yok"}
        </div>
        {coverError && <div style={{color:'#e63946',marginTop:6,fontWeight:600}}>{coverError}</div>}
      </div>
      {/* Sağ: Form alanları */}
      <div style={{flex:1}}>
        <h2 style={{color:'#00c3ff',fontWeight:800,fontSize:'1.35rem',marginBottom:18}}>Manga {submitText === "Kaydet" ? "Ekle" : "Düzenle"}</h2>
        <div style={{marginBottom:16}}>
          <label>Manga Adı *</label>
          <input value={form.title || ""} onChange={e=>setForm((f:MangaFormType)=>({...f,title:e.target.value}))} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #23232b',background:'#23232b',color:'#fff',marginTop:4,fontSize:'1.1rem'}} required />
        </div>
        <div style={{marginBottom:16}}>
          <label>Yazar *</label>
          <input value={form.author || ""} onChange={e=>setForm((f:MangaFormType)=>({...f,author:e.target.value}))} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #23232b',background:'#23232b',color:'#fff',marginTop:4,fontSize:'1.1rem'}} required />
        </div>
        <div style={{marginBottom:16}}>
          <label>Türler (birden fazla seçilebilir)</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:8}}>
            {categories.map(cat => (
              <label key={cat} style={{background:Array.isArray(form.categories)&&form.categories.includes(cat)?'#00c3ff':'#23232b',color:Array.isArray(form.categories)&&form.categories.includes(cat)?'#fff':'#b3b3b3',padding:'7px 16px',borderRadius:8,cursor:'pointer',fontWeight:600,fontSize:'1rem',userSelect:'none'}}>
                <input type="checkbox" checked={Array.isArray(form.categories)&&form.categories.includes(cat)} onChange={()=>handleCategoryChange(cat)} style={{display:'none'}} />
                {cat}
              </label>
            ))}
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <label>Bölüm Sayısı</label>
          <input type="number" value={Array.isArray(form.chapters)?form.chapters.length:form.chapters||""} onChange={e=>setForm((f:MangaFormType)=>({...f,chapters:parseInt(e.target.value)||0}))} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #23232b',background:'#23232b',color:'#fff',marginTop:4,fontSize:'1.1rem'}} />
        </div>
        <div style={{marginBottom:16}}>
          <label>Durum</label>
          <select value={form.status||statuses[0]} onChange={e=>setForm((f:MangaFormType)=>({...f,status:e.target.value}))} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #23232b',background:'#23232b',color:'#fff',marginTop:4,fontSize:'1.1rem'}}>
            {statuses.map(s=>(<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
        <div style={{marginBottom:16}}>
          <label>Açıklama</label>
          <textarea value={form.desc||""} onChange={e=>setForm((f:MangaFormType)=>({...f,desc:e.target.value}))} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #23232b',background:'#23232b',color:'#fff',marginTop:4,fontSize:'1.1rem',minHeight:70}} />
        </div>
        {errorMsg && <div style={{color:'#e63946',margin:'10px 0',fontWeight:600}}>{errorMsg}</div>}
        {successMsg && <div style={{color:'#00c3ff',margin:'10px 0',fontWeight:600}}>{successMsg}</div>}
        <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:18}}>
          <button type="submit" disabled={loading} style={{background:'#00c3ff',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:700,fontSize:'1.1rem',cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1}}>{loading ? 'Kaydediliyor...' : submitText}</button>
        </div>
      </div>
    </form>
  );
} 