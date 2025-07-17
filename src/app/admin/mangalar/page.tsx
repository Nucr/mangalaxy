"use client";
import { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function AdminMangalar() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const mangasPerPage = 10;
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [mangalar, setMangalar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editManga, setEditManga] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/mangalar")
      .then(res => {
        if (!res.ok) throw new Error("Veri alınamadı");
        return res.json();
      })
      .then(data => {
        setMangalar(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Manga verileri alınamadı.");
        setLoading(false);
      });
  }, []);

  function sortMangas(mangas: any[]) {
    if (!sortField) return mangas;
    return [...mangas].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === 'chapters') {
        return sortOrder === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue, 'tr')
          : bValue.localeCompare(aValue, 'tr');
      }
      return 0;
    });
  }

  const filtered = mangalar.filter(manga =>
    (manga.title || manga.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (manga.author || "").toLowerCase().includes(search.toLowerCase())
  );
  const sorted = sortMangas(filtered);
  const totalPages = Math.ceil(sorted.length / mangasPerPage);
  const paginated = sorted.slice((currentPage - 1) * mangasPerPage, currentPage * mangasPerPage);

  async function handleDelete(id: string) {
    if (!window.confirm("Bu mangayı silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    setDeleteError("");
    try {
      const res = await axios.delete(`/api/mangalar?id=${id}`);
      if (!res.data.success) throw new Error(res.data.error || "Silinemedi");
      setMangalar(prev => prev.filter(m => m._id !== id));
    } catch (err: any) {
      setDeleteError("Silme hatası: " + (err.response?.data?.error || err.message));
    }
    setDeletingId(null);
  }

  function openEditModal(manga: any) {
    setEditManga({ ...manga });
    setEditModalOpen(true);
    setEditError("");
    setEditSuccess("");
  }
  function closeEditModal() {
    setEditModalOpen(false);
    setEditManga(null);
    setEditError("");
    setEditSuccess("");
  }
  async function handleEditSave() {
    if (!editManga) return;
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    try {
      const res = await axios.patch(`/api/mangalar?id=${editManga._id}`, {
        title: editManga.title,
        author: editManga.author,
        categories: editManga.categories,
        chapters: editManga.chapters,
        status: editManga.status,
        desc: editManga.desc,
        cover: editManga.cover,
      });
      if (!res.data.success) throw new Error(res.data.error || "Güncellenemedi");
      setMangalar(prev => prev.map(m => m._id === editManga._id ? { ...m, ...editManga } : m));
      setEditSuccess("Başarıyla güncellendi!");
      setTimeout(() => { closeEditModal(); }, 1200);
    } catch (err: any) {
      setEditError("Güncelleme hatası: " + (err.response?.data?.error || err.message));
    }
    setEditLoading(false);
  }

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
          <h1 style={{color:'#00c3ff',fontWeight:800,fontSize:'2rem',fontFamily:'Orbitron, Poppins, sans-serif',margin:0}}>Mangalar</h1>
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
          }}>Yönetim Paneli</span>
        </div>
        <div style={{marginBottom:20, display:'flex', justifyContent:'flex-end', gap:12}}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Manga adı veya yazar ara..."
            style={{
              padding:'8px 14px',
              borderRadius:8,
              border:'1px solid #222',
              background:'#18181b',
              color:'#00c3ff',
              fontSize:'1rem',
              outline:'none',
              minWidth:220,
              boxShadow:'0 2px 8px #0002',
              transition:'border 0.18s',
            }}
          />
          <button
            onClick={() => router.push('/admin/mangalar/yeni')}
            style={{
              background:'#00c3ff',
              color:'#fff',
              border:'none',
              borderRadius:'50%',
              width:40,
              height:40,
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontSize:'1.7rem',
              fontWeight:700,
              cursor:'pointer',
              boxShadow:'0 2px 8px #00c3ff44',
              transition:'background 0.18s',
            }}
            title="Yeni Manga Ekle"
          >+</button>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#18181b',borderRadius:12,overflow:'hidden',boxShadow:'0 2px 12px #0005'}}>
          <thead>
            <tr style={{background:'#23232b',color:'#00c3ff'}}>
              <th style={{padding:'12px',cursor:'pointer',transition:'background 0.22s',background:sortField==='name'?'#003366':'transparent'}} onClick={() => {setSortField('name');setSortOrder(sortField==='name'&&sortOrder==='asc'?'desc':'asc');}}>Adı</th>
              <th style={{padding:'12px',cursor:'pointer',transition:'background 0.22s',background:sortField==='author'?'#003366':'transparent'}} onClick={() => {setSortField('author');setSortOrder(sortField==='author'&&sortOrder==='asc'?'desc':'asc');}}>Yazar</th>
              <th style={{padding:'12px',cursor:'pointer',transition:'background 0.22s',background:sortField==='category'?'#003366':'transparent'}} onClick={() => {setSortField('category');setSortOrder(sortField==='category'&&sortOrder==='asc'?'desc':'asc');}}>Kategori</th>
              <th style={{padding:'12px',cursor:'pointer',transition:'background 0.22s',background:sortField==='chapters'?'#003366':'transparent'}} onClick={() => {setSortField('chapters');setSortOrder(sortField==='chapters'&&sortOrder==='asc'?'desc':'asc');}}>Bölüm</th>
              <th style={{padding:'12px',cursor:'pointer',transition:'background 0.22s',background:sortField==='status'?'#003366':'transparent'}} onClick={() => {setSortField('status');setSortOrder(sortField==='status'&&sortOrder==='asc'?'desc':'asc');}}>Durum</th>
              <th style={{padding:'12px'}}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{textAlign:'center',color:'#00c3ff',padding:32}}>Yükleniyor...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} style={{textAlign:'center',color:'#e63946',padding:32}}>{error}</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign:'center',color:'#888',padding:32}}>Manga bulunamadı.</td></tr>
            ) : paginated.map(manga => (
              <tr key={manga._id} style={{borderBottom:'1px solid #23232b',color:'#fff'}}>
                <td style={{padding:'10px 8px'}}>{manga.title || manga.name}</td>
                <td style={{padding:'10px 8px'}}>{manga.author}</td>
                <td style={{padding:'10px 8px',maxWidth:220,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{Array.isArray(manga.categories) ? manga.categories.join(', ') : manga.category || ''}</td>
                <td style={{padding:'10px 8px',textAlign:'center'}}>{Array.isArray(manga.chapters) ? manga.chapters.length : manga.chapters || ''}</td>
                <td style={{padding:'10px 8px',textAlign:'center'}}>{manga.status}</td>
                <td style={{padding:'10px 8px',textAlign:'center',minWidth:120,display:'flex',gap:8,justifyContent:'flex-end',alignItems:'center',flexWrap:'wrap'}}>
                  <button
                    style={{background:'#00c3ff',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:600,cursor:'pointer',marginRight:8}}
                    onClick={()=>router.push(`/admin/mangalar/duzenle?id=${manga._id}`)}
                  >Düzenle</button>
                  <button
                    style={{background:'#e63946',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:600,cursor:deletingId===manga._id?'not-allowed':'pointer',opacity:deletingId===manga._id?0.6:1}}
                    disabled={deletingId===manga._id}
                    onClick={()=>handleDelete(manga._id)}
                  >{deletingId===manga._id ? 'Siliniyor...' : 'Sil'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {deleteError && (
          <div style={{color:'#e63946',textAlign:'center',marginTop:18,fontWeight:600}}>{deleteError}</div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8,marginTop:32}}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{padding:'6px 14px',borderRadius:6,border:'none',background:'#23232b',color:'#00c3ff',fontWeight:600,cursor:currentPage===1?'not-allowed':'pointer',opacity:currentPage===1?0.5:1}}>Geri</button>
            {Array.from({length: totalPages}, (_, i) => i + 1).map(num => (
              <button key={num} onClick={() => setCurrentPage(num)} style={{padding:'6px 12px',borderRadius:6,border:'none',background:num===currentPage?'#00c3ff':'#23232b',color:num===currentPage?'#fff':'#00c3ff',fontWeight:700,cursor:'pointer',transition:'background 0.18s, color 0.18s'}}>{num}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{padding:'6px 14px',borderRadius:6,border:'none',background:'#23232b',color:'#00c3ff',fontWeight:600,cursor:currentPage===totalPages?'not-allowed':'pointer',opacity:currentPage===totalPages?0.5:1}}>İleri</button>
          </div>
        )}
      </main>
      {/* Düzenle Modalı */}
      {/* The edit modal is no longer used, so this section is removed. */}
    </div>
  );
} 