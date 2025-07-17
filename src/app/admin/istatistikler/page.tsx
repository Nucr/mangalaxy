"use client";
import AdminSidebar from "../AdminSidebar";
import { useEffect, useState } from 'react';

type Stats = { users: number; mangas: number; chapters: number };

const statCards = [
  { key: 'users', label: 'Kullanıcı', color: '#00c3ff', icon: (
    <svg width="36" height="36" fill="#00c3ff" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
  )},
  { key: 'mangas', label: 'Manga', color: '#ffb300', icon: (
    <svg width="36" height="36" fill="#ffb300" viewBox="0 0 24 24"><path d="M3 6v15h18V6H3zm16 13H5V8h14v11zm-7-9h2v2h-2zm0 4h2v2h-2z"/></svg>
  )},
  { key: 'chapters', label: 'Bölüm', color: '#00e676', icon: (
    <svg width="36" height="36" fill="#00e676" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2z"/></svg>
  )}
];

export default function AdminIstatistikler() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/istatistikler')
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setStats(data);
        setError(null);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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
        <h1 style={{color:'#00c3ff',fontWeight:800,fontSize:'2rem',fontFamily:'Orbitron, Poppins, sans-serif',marginBottom:32}}>İstatistikler</h1>
        {loading ? (
          <div style={{color:'#00c3ff',fontWeight:700,fontSize:'1.2rem'}}>Yükleniyor...</div>
        ) : error ? (
          <div style={{color:'#e63946',fontWeight:700,fontSize:'1.1rem'}}>Hata: {error}</div>
        ) : stats ? (
          <div style={{display:'flex',gap:32,flexWrap:'wrap',marginBottom:32}}>
            {statCards.map(card => (
              <div key={card.key} style={{
                background:'#18181b',
                borderRadius:18,
                boxShadow:'0 2px 16px #0005',
                padding:'32px 36px',
                minWidth:220,
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                border:`2.5px solid ${card.color}33`,
                transition:'box-shadow 0.18s',
                position:'relative',
              }}>
                <div style={{marginBottom:16}}>{card.icon}</div>
                <div style={{fontSize:'2.3rem',fontWeight:800,color:card.color,letterSpacing:1}}>{stats[card.key]}</div>
                <div style={{fontSize:'1.1rem',fontWeight:700,color:'#fff',marginTop:6}}>{card.label}</div>
              </div>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
} 