"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import AdminSidebar from "../../AdminSidebar";
import MangaForm from "../MangaForm";
import { useRef } from "react";

export default function MangaDuzenlePage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState<any|null>(null);
  const [bolumAd, setBolumAd] = useState("");
  const [bolumNo, setBolumNo] = useState("");
  const [yayinTarihi, setYayinTarihi] = useState("");
  const [bolumDosyalar, setBolumDosyalar] = useState<FileList|null>(null);
  const [bolumLoading, setBolumLoading] = useState(false);
  const [bolumMsg, setBolumMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletingBolum, setDeletingBolum] = useState<string|null>(null);
  const [activeBolumNo, setActiveBolumNo] = useState<string|null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Filtre ve sıralama için state
  const [filterText, setFilterText] = useState("");
  const [filterField, setFilterField] = useState("bolum_no");
  // Sıralama için state
  const [sortField, setSortField] = useState<'bolum_no' | 'bolum_adi' | 'yayin_tarihi'>('bolum_no');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`/api/mangalar?id=${id}`)
      .then(res => {
        const manga = Array.isArray(res.data) ? res.data[0] : res.data;
        setForm({
          title: manga.title || "",
          author: manga.author || "",
          categories: manga.categories || [],
          chapters: manga.chapters || [],
          status: manga.status || "",
          desc: manga.desc || "",
          cover: manga.cover || ""
        });
        setLoading(false);
      })
      .catch(err => {
        setError("Manga verisi alınamadı.");
        setLoading(false);
      });
  }, [id]);

  // Bölüm no ve adı otomatik doldurma
  useEffect(() => {
    if (form && form.chapters && form.chapters.length > 0) {
      // En büyük bölüm no'yu bul
      const maxNo = Math.max(...form.chapters.map((b:any) => parseInt(b.bolum_no || b.no || "0")).filter(Boolean));
      setBolumNo((maxNo + 1).toString());
      setBolumAd(`Bölüm ${maxNo + 1}`);
    } else {
      setBolumNo("1");
      setBolumAd("Bölüm 1");
    }
  }, [form]);

  // Bölüm no değişince bölüm adı otomatik güncellensin (elle değişmediyse)
  useEffect(() => {
    if (!bolumAd || bolumAd.startsWith("Bölüm ")) {
      setBolumAd(bolumNo ? `Bölüm ${bolumNo}` : "");
    }
  }, [bolumNo]);

  // Varsayılan yayın tarihi bugünün tarihi olsun
  useEffect(() => {
    if (!yayinTarihi) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setYayinTarihi(`${yyyy}-${mm}-${dd}`);
    }
  }, [form]);

  // Filtrelenmiş ve sıralanmış bölümler
  const filteredChapters = form?.chapters
    ?.filter((b:any) => {
      const val = filterField === "bolum_no" ? (b.bolum_no || b.no || "") :
                  filterField === "bolum_adi" ? (b.bolum_adi || b.name || b.adi || "") :
                  filterField === "yayin_tarihi" ? (b.yayin_tarihi || "") :
                  b._id || "";
      return val.toString().toLowerCase().includes(filterText.toLowerCase());
    })
    ?.sort((a:any, b:any) => {
      let va = sortField === "bolum_no" ? parseInt(a.bolum_no || a.no || "0") :
               sortField === "bolum_adi" ? (a.bolum_adi || a.name || a.adi || "") :
               sortField === "yayin_tarihi" ? (a.yayin_tarihi || "") :
               a._id || "";
      let vb = sortField === "bolum_no" ? parseInt(b.bolum_no || b.no || "0") :
               sortField === "bolum_adi" ? (b.bolum_adi || b.name || b.adi || "") :
               sortField === "yayin_tarihi" ? (b.yayin_tarihi || "") :
               b._id || "";
      if (typeof va === "number" && typeof vb === "number") return sortDir === "asc" ? va - vb : vb - va;
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  async function handleSubmit(newForm: any) {
    setError("");
    setSuccessMsg("");
    try {
      // Eğer yeni kapak seçilmemişse eski kapak URL'sini kullan
      const coverToSend = newForm.cover || (form && form.cover) || "";
      const res = await axios.patch(`/api/mangalar?id=${id}`, {
        title: newForm.title,
        author: newForm.author,
        categories: newForm.categories,
        chapters: newForm.chapters,
        status: newForm.status,
        desc: newForm.desc,
        cover: coverToSend
      });
      if (!res.data.success) throw new Error(res.data.error || "Güncellenemedi");
      setSuccessMsg("Başarıyla güncellendi!");
      setTimeout(()=>setSuccessMsg(""), 2000);
    } catch (err: any) {
      setError("Güncelleme hatası: " + (err.response?.data?.error || err.message));
    }
  }

  async function handleBolumEkle(e: any) {
    e.preventDefault();
    setBolumMsg("");
    setBolumLoading(true);
    try {
      if (!id) throw new Error("Manga ID bulunamadı");
      if (!bolumNo || !bolumAd || !bolumDosyalar) throw new Error("Tüm alanları doldurun ve dosya seçin.");
      const formData = new FormData();
      formData.append("manga_id", id);
      formData.append("bolum_no", bolumNo);
      formData.append("bolum_adi", bolumAd);
      formData.append("yayin_tarihi", yayinTarihi || new Date().toISOString().slice(0,10));
      Array.from(bolumDosyalar).forEach(file => formData.append("sayfalar", file));
      const res = await axios.post("/api/admin/mangalar/bolumler", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBolumMsg("✔️ Bölüm başarıyla eklendi!");
      setBolumAd(""); setBolumNo(""); setYayinTarihi(""); setBolumDosyalar(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setBolumMsg("❌ " + (err.response?.data?.error || err.message));
    }
    setBolumLoading(false);
  }

  async function handleBolumSil(bolumNo: string) {
    if (!id) return;
    if (!confirm('Bu bölümü silmek istediğinize emin misiniz?')) return;
    setDeletingBolum(bolumNo);
    try {
      const res = await axios.delete(`/api/admin/mangalar/bolumler`, {
        data: { manga_id: id, bolum_no: bolumNo }
      });
      if (res.data.success) {
        // Güncel manga verisini tekrar çek
        const mangaRes = await axios.get(`/api/mangalar?id=${id}`);
        const manga = Array.isArray(mangaRes.data) ? mangaRes.data[0] : mangaRes.data;
        setForm({
          title: manga.title || "",
          author: manga.author || "",
          categories: manga.categories || [],
          chapters: manga.chapters || [],
          status: manga.status || "",
          desc: manga.desc || "",
          cover: manga.cover || ""
        });
      } else {
        alert(res.data.error || 'Silinemedi');
      }
    } catch (err: any) {
      alert('Silme hatası: ' + (err.response?.data?.error || err.message));
    }
    setDeletingBolum(null);
  }

  return (
    <div style={{ minHeight: "80vh", padding: "48px 0", maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "row" }}>
      <AdminSidebar />
      <main style={{ flex: 1 }}>
        <h1 style={{color:'#00c3ff',fontWeight:800,fontSize:'2rem',fontFamily:'Orbitron, Poppins, sans-serif',marginBottom:24}}>Manga Düzenle</h1>
        {loading ? <div style={{color:'#00c3ff'}}>Yükleniyor...</div> : error ? <div style={{color:'#e63946'}}>{error}</div> : form && (
          <div style={{maxWidth:950,minWidth:400,margin:'0 auto',background:'#18181b',padding:32,borderRadius:20,boxShadow:'0 2px 16px #0005'}}>
            <MangaForm
              initial={form}
              onSubmit={handleSubmit}
              loading={false}
              errorMsg={error||undefined}
              successMsg={successMsg||undefined}
              submitText="Kaydet"
            />
            {/* Bölüm Ekle Formu */}
            <div style={{marginTop:48,paddingTop:32,borderTop:'1.5px solid #23232b'}}>
              <h2 style={{color:'#00c3ff',fontWeight:700,fontSize:'1.25rem',marginBottom:18}}>Bölüm Ekle</h2>
              <form onSubmit={handleBolumEkle} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div style={{display:'flex',gap:16}}>
                  <div style={{flex:1}}>
                    <label>Bölüm No *</label>
                    <input value={bolumNo} onChange={e=>setBolumNo(e.target.value)} required style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #23232b',background:'#23232b',color:'#fff',marginTop:4}} />
                  </div>
                  <div style={{flex:2}}>
                    <label>Bölüm Adı *</label>
                    <input value={bolumAd} onChange={e=>setBolumAd(e.target.value)} required style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #23232b',background:'#23232b',color:'#fff',marginTop:4}} />
                  </div>
                  <div style={{flex:1}}>
                    <label>Yayın Tarihi</label>
                    <input type="date" value={yayinTarihi} onChange={e=>setYayinTarihi(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #23232b',background:'#23232b',color:'#fff',marginTop:4}} />
                  </div>
                </div>
                <div>
                  <label>Sayfa Dosyaları *</label>
                  <input type="file" multiple ref={fileInputRef} onChange={e=>setBolumDosyalar(e.target.files)} style={{marginTop:4}} />
                  {/* Modern sürükle-bırak alanı */}
                  <div
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                    onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
                    onDrop={async e => {
                      e.preventDefault(); e.stopPropagation(); setDragActive(false);
                      const items = e.dataTransfer.items;
                      if (!items) return;
                      const files = [];
                      for (let i = 0; i < items.length; i++) {
                        const item = items[i].webkitGetAsEntry?.() || items[i].getAsFile();
                        if (item && item.isDirectory) {
                          await traverseFileTree(item, files);
                        } else if (items[i].getAsFile()) {
                          files.push(items[i].getAsFile());
                        }
                      }
                      if (files.length > 0) setBolumDosyalar({ length: files.length, item: (i:number)=>files[i], ...files });
                    }}
                    style={{
                      border: dragActive ? '2.5px solid #00c3ff' : '2.5px dashed #333',
                      background: dragActive ? '#23232b' : '#18181b',
                      borderRadius: 16,
                      padding: '32px 0',
                      color: '#b3b3b3',
                      fontSize: '1.08rem',
                      fontWeight: 600,
                      marginTop: 12,
                      marginBottom: 8,
                      transition: 'background 0.18s, border 0.18s',
                      cursor: 'pointer',
                      textAlign: 'center',
                      position: 'relative',
                    }}
                  >
                    <span style={{display:'block',marginBottom:10}}>
                      <svg width="40" height="40" fill={dragActive ? '#00c3ff' : '#444'} style={{marginBottom:4,transition:'fill 0.18s'}} viewBox="0 0 24 24"><path d="M12 16.5a1 1 0 0 1-1-1V7.83l-2.59 2.58a1 1 0 1 1-1.41-1.41l4.3-4.29a1 1 0 0 1 1.41 0l4.3 4.29a1 1 0 1 1-1.41 1.41L13 7.83V15.5a1 1 0 0 1-1 1Z"/><path d="M20 18.5a1 1 0 0 1-1 1H5a1 1 0 0 1 0-2h14a1 1 0 0 1 1 1Z"/></svg>
                    </span>
                    <span style={{fontWeight:700}}>{dragActive ? 'Bırakabilirsin!' : 'Klasör veya dosyaları buraya sürükle-bırak yap'}</span>
                  </div>
                </div>
                {bolumMsg && <div style={{color:bolumMsg.startsWith('✔️')?'#00c3ff':'#e63946',fontWeight:600}}>{bolumMsg}</div>}
                <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:8}}>
                  <button type="submit" disabled={bolumLoading} style={{background:'#00c3ff',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:700,fontSize:'1.1rem',cursor:bolumLoading?'not-allowed':'pointer',opacity:bolumLoading?0.7:1}}>{bolumLoading ? 'Ekleniyor...' : 'Bölüm Ekle'}</button>
                </div>
              </form>
            </div>
            {/* Mevcut Bölümler Listesi */}
            <div style={{marginTop:32}}>
              <h3 style={{color:'#00c3ff',fontWeight:700,fontSize:'1.1rem',marginBottom:12}}>Mevcut Bölümler</h3>
              {/* Sadece arama inputu */}
              <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:18,flexWrap:'wrap'}}>
                <input value={filterText} onChange={e=>setFilterText(e.target.value)} placeholder="Bölüm ara..." style={{padding:'10px 14px',borderRadius:8,minWidth:220,border:'1px solid #23232b',background:'#23232b',color:'#00c3ff',fontSize:'1rem',outline:'none',boxShadow:'0 2px 8px #0002',transition:'border 0.18s'}} />
              </div>
              {/* Tablo formatında bölüm listesi */}
              <div style={{background:'#18181b',borderRadius:14,padding:'1em',marginTop:8,boxShadow:'0 2px 16px #0005'}}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1.2fr 80px',
                  gap: 12,
                  padding: '8px 0',
                  borderBottom: '1.5px solid #23232b',
                  color: '#00c3ff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  <span
                    onClick={() => {
                      if (sortField === 'bolum_no') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                      setSortField('bolum_no');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'color 0.18s',
                      color: sortField === 'bolum_no' ? '#fff' : '#00c3ff',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = sortField === 'bolum_no' ? '#fff' : '#00c3ff'}
                  >
                    Bölüm No
                    <span style={{fontSize: '1.1em', transition: 'transform 0.18s', transform: sortField === 'bolum_no' && sortDir === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'}}>
                      ▼
                    </span>
                  </span>
                  <span
                    onClick={() => {
                      if (sortField === 'bolum_adi') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                      setSortField('bolum_adi');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'color 0.18s',
                      color: sortField === 'bolum_adi' ? '#fff' : '#00c3ff',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = sortField === 'bolum_adi' ? '#fff' : '#00c3ff'}
                  >
                    Bölüm Adı
                    <span style={{fontSize: '1.1em', transition: 'transform 0.18s', transform: sortField === 'bolum_adi' && sortDir === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'}}>
                      ▼
                    </span>
                  </span>
                  <span
                    onClick={() => {
                      if (sortField === 'yayin_tarihi') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                      setSortField('yayin_tarihi');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'color 0.18s',
                      color: sortField === 'yayin_tarihi' ? '#fff' : '#00c3ff',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = sortField === 'yayin_tarihi' ? '#fff' : '#00c3ff'}
                  >
                    Yayın Tarihi
                    <span style={{fontSize: '1.1em', transition: 'transform 0.18s', transform: sortField === 'yayin_tarihi' && sortDir === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'}}>
                      ▼
                    </span>
                  </span>
                  <span></span>
                </div>
                {filteredChapters && filteredChapters.length > 0 ? (
                  [...filteredChapters].sort((a:any, b:any) => {
                    let va, vb;
                    if (sortField === 'bolum_no') {
                      va = parseInt(a.bolum_no || a.no || "0");
                      vb = parseInt(b.bolum_no || b.no || "0");
                    } else if (sortField === 'bolum_adi') {
                      va = (a.bolum_adi || a.name || a.adi || '').toLowerCase();
                      vb = (b.bolum_adi || b.name || b.adi || '').toLowerCase();
                    } else if (sortField === 'yayin_tarihi') {
                      va = a.yayin_tarihi || '';
                      vb = b.yayin_tarihi || '';
                    }
                    if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va;
                    return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
                  }).map((bolum:any, idx:number) => (
                    <div key={`${bolum.bolum_no || bolum.no}-${idx}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 1.2fr 80px',
                        gap: 12,
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: '1px solid #23232b',
                        color: activeBolumNo === (bolum.no || bolum.bolum_no) ? '#00c3ff' : '#fff',
                        background: activeBolumNo === (bolum.no || bolum.bolum_no) ? '#00c3ff22' : 'transparent',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'background 0.22s, color 0.22s',
                        boxShadow: activeBolumNo === (bolum.no || bolum.bolum_no) ? '0 2px 12px #00c3ff33' : 'none',
                        transform: activeBolumNo === (bolum.no || bolum.bolum_no) ? 'scale(1.01)' : 'scale(1)',
                      }}
                      onClick={() => setActiveBolumNo(bolum.no || bolum.bolum_no)}
                      onMouseEnter={e => e.currentTarget.style.background = '#23232b'}
                      onMouseLeave={e => e.currentTarget.style.background = activeBolumNo === (bolum.no || bolum.bolum_no) ? '#00c3ff22' : 'transparent'}
                    >
                      <span style={{fontWeight:600}}>{bolum.no || bolum.bolum_no}</span>
                      <span>{bolum.bolum_adi || bolum.name || bolum.adi || ''}</span>
                      <span>{bolum.yayin_tarihi ? new Date(bolum.yayin_tarihi).toLocaleDateString('tr-TR') : '-'}</span>
                      <button
                        onClick={e => {e.stopPropagation(); handleBolumSil(bolum.no || bolum.bolum_no);}}
                        disabled={deletingBolum===(bolum.no || bolum.bolum_no)}
                        style={{
                          background:'#e63946',
                          color:'#fff',
                          border:'none',
                          borderRadius:6,
                          padding:'6px 16px',
                          fontWeight:600,
                          cursor:deletingBolum===(bolum.no || bolum.bolum_no)?'not-allowed':'pointer',
                          opacity:deletingBolum===(bolum.no || bolum.bolum_no)?0.7:1,
                          transition: 'background 0.18s, color 0.18s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#ff2d55'}
                        onMouseLeave={e => e.currentTarget.style.background = '#e63946'}
                      >
                        {deletingBolum===(bolum.no || bolum.bolum_no) ? 'Siliniyor...' : 'Sil'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{color:'#888',padding:'16px 0'}}>Henüz bölüm eklenmemiş.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Dosya ağacını gezmek için yardımcı fonksiyon (en üste eklenmeli veya import edilmeli)
function traverseFileTree(item: any, fileList: any[], path = "") {
  return new Promise(resolve => {
    if (item.isFile) {
      item.file(file => {
        fileList.push(file);
        resolve();
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      dirReader.readEntries(async entries => {
        for (const entry of entries) {
          await traverseFileTree(entry, fileList, path + item.name + "/");
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
} 