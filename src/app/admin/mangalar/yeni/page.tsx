"use client";
import React, { useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import AdminSidebar from "../../AdminSidebar";
import Papa from "papaparse";
import axios from 'axios';
import MangaForm from "../MangaForm";
import { FaFolderOpen, FaCloudUploadAlt } from 'react-icons/fa';

const categories = [
  "Aksiyon", "Macera", "Fantastik", "Komedi", "Romantik", "Dram", "Doğaüstü", "Okul", "Tarihi", "Bilim Kurgu", "Korku", "Gerilim", "Seinen", "Shounen", "Shoujo", "Josei", "Isekai", "Reenkarnasyon", "Manhwa", "Manhua", "Webtoon", "Slice of Life", "Spor", "Yaoi", "Yuri", "Harem", "Ecchi", "Polisiye", "Psikolojik", "Askeri", "Vampir", "Müzik", "Mecha", "One Shot", "Superpower", "Gizem", "Martial Arts", "Shoujo Ai", "Shounen Ai"
];
const statuses = ["Devam Ediyor", "Tamamlandı"];

function SurukleBirakYukleme() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string|null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    setUploading(true);
    setUploadMsg(null);
    const items = e.dataTransfer.items;
    if (!items) return;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item: any = items[i].webkitGetAsEntry?.() || items[i].getAsFile();
      if (item && item.isDirectory) {
        await traverseFileTree(item, files);
      } else if (items[i].getAsFile()) {
        files.push(items[i].getAsFile()!);
      }
    }
    setSelectedFiles(files);
    if (files.length === 0) {
      setUploadMsg('Dosya bulunamadı.');
      setUploading(false);
      return;
    }
    const form = new FormData();
    files.forEach(file => {
      form.append('sayfalar', file, (file as any).webkitRelativePath || file.name);
    });
    form.append('bolum_no', '1');
    form.append('bolum_adi', 'Bölüm 1');
    form.append('yayın_tarihi', new Date().toISOString().slice(0,10));
    try {
      const res = await axios.post('/api/admin/mangalar/bolumler', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      setUploadMsg('✔️ Yükleme başarılı: ' + (res.data?.dosyalar?.length || 0) + ' dosya');
    } catch (err: any) {
      setUploadMsg('❌ Yükleme hatası: ' + (err.response?.data?.error || err.message));
    }
    setUploading(false);
  };

  function traverseFileTree(item: any, fileList: File[], path = ""): Promise<void> {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file: File) => {
          fileList.push(new File([file], file.name, { type: file.type }));
          resolve();
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries: any[]) => {
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    // Yükleme işlemi burada da tetiklenebilir (isteğe bağlı)
  };

  return (
    <div style={{margin:'48px auto',maxWidth:600,padding:48,background:'#18181b',borderRadius:20,boxShadow:'0 2px 16px #0005',textAlign:'center'}}>
      <h2 style={{color:'#00c3ff',fontWeight:800,fontSize:'1.35rem',marginBottom:18}}>Bölüm ve Sayfa Yükle (Sürükle-Bırak)</h2>
      <div
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2.5px solid #00c3ff' : '2.5px dashed #333',
          background: dragActive ? '#23232b' : '#18181b',
          borderRadius: 16,
          padding: '48px 0',
          color: '#b3b3b3',
          fontSize: '1.13rem',
          fontWeight: 600,
          marginBottom: 24,
          transition: 'background 0.18s, border 0.18s',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <FaCloudUploadAlt size={48} color={dragActive ? '#00c3ff' : '#444'} style={{marginBottom:12,transition:'color 0.18s'}} />
        <div style={{fontSize:'1.1rem',fontWeight:700,marginBottom:8}}>
          {uploading ? 'Yükleniyor...' : 'Klasör veya dosyaları buraya sürükleyip bırakın'}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            background:'#00c3ff',color:'#fff',border:'none',borderRadius:8,padding:'10px 22px',fontWeight:700,fontSize:'1.08rem',boxShadow:'0 2px 8px #00c3ff33',cursor:'pointer',transition:'background 0.18s',marginTop:8,marginBottom:8
          }}
          disabled={uploading}
        >
          <FaFolderOpen style={{marginRight:8,marginBottom:-2}} /> Dosya veya Klasör Seç
        </button>
        <input
          type="file"
          ref={inputRef}
          style={{display:'none'}}
          multiple
          // @ts-ignore
          webkitdirectory="true"
          // @ts-ignore
          directory="true"
          onChange={handleFileSelect}
        />
        {selectedFiles.length > 0 && (
          <div style={{marginTop:12, color:'#00c3ff', fontWeight:600, fontSize:'0.98rem', maxHeight:120, overflowY:'auto', borderRadius:8, background:'#23232b', padding:'8px 12px'}}>
            {selectedFiles.slice(0,8).map((f,i) => <div key={i}>{f.name}</div>)}
            {selectedFiles.length > 8 && <div>+{selectedFiles.length-8} dosya daha...</div>}
          </div>
        )}
      </div>
      {uploadMsg && <div style={{marginTop:18,color:uploadMsg.startsWith('✔️')?'#00c3ff':'#e63946',fontWeight:700,fontSize:'1.08rem'}}>{uploadMsg}</div>}
      <div style={{marginTop:24,color:'#b3b3b3',fontSize:'0.98rem'}}>
        <b>İpucu:</b> Klasör veya çoklu dosya sürükleyip bırakabilirsiniz. Her bölüm için ayrı yükleme önerilir.<br/>
        <b>Not:</b> Klasör adını bölüm adı/numarası olarak kullanmak için script veya ek geliştirme yapılabilir.
      </div>
    </div>
  );
}

type MangaForm = {
  title: string;
  author: string;
  categories: string[];
  chapters: any[];
  status: string;
  desc: string;
  cover?: string;
};

export default function YeniMangaEkle() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string|null>(null);
  const [errorMsg, setErrorMsg] = useState<string|null>(null);
  const router = useRouter();

  async function handleSubmit(form: MangaForm) {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await axios.post('/api/mangalar', {
        title: form.title,
        author: form.author,
        categories: form.categories,
        chapters: form.chapters,
        status: form.status,
        desc: form.desc,
        coverUrl: form.cover
      });
      if (!res.data.success) throw new Error(res.data.error || 'Kayıt başarısız');
      setSuccessMsg('Manga başarıyla kaydedildi!');
      setTimeout(()=>setSuccessMsg(null), 2500);
      // Formu sıfırla
      // router.push('/admin/mangalar'); // İstersen yönlendirme ekleyebilirsin
    } catch (err: any) {
      setErrorMsg('Bir hata oluştu: ' + (err.response?.data?.error || err.message || 'Bilinmeyen hata'));
      setTimeout(()=>setErrorMsg(null), 3500);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "80vh", padding: "48px 0", maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "row" }}>
      <AdminSidebar />
      <main style={{ flex: 1 }}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
          <h1 style={{color:'#00c3ff',fontWeight:800,fontSize:'2rem',fontFamily:'Orbitron, Poppins, sans-serif',margin:0}}>Yeni Manga Ekle</h1>
          <span style={{background:'#23232b',color:'#b3b3b3',fontWeight:600,fontSize:'1rem',borderRadius:8,padding:'4px 14px',letterSpacing:'.5px',border:'1.5px solid #222',boxShadow:'0 2px 8px #0002',userSelect:'none'}}>Formu doldur ve kaydet</span>
        </div>
        <div style={{maxWidth:950,minWidth:400,margin:'0 auto',background:'#18181b',padding:32,borderRadius:20,boxShadow:'0 2px 16px #0005'}}>
          <MangaForm
            initial={{ title: "", author: "", categories: ["Aksiyon"], chapters: [], status: "Devam Ediyor", desc: "", cover: "" }}
            onSubmit={handleSubmit}
            loading={loading}
            errorMsg={errorMsg||undefined}
            successMsg={successMsg||undefined}
            submitText="Ekle"
          />
        </div>
      </main>
    </div>
  );
} 