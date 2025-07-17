"use client";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import AdminSidebar from "../AdminSidebar";

type User = {
  _id: string;
  name?: string;
  email: string;
  createdAt?: string;
  level?: number;
  xp?: number;
  favorites?: string[];
  role?: string;
};

export default function AdminKullanicilar() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [thActive, setThActive] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  // const totalPages = Math.ceil(users.length / usersPerPage); // Bu kısım artık sortedUsers üzerinden hesaplanacak
  // const paginatedUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage); // Bu kısım artık sortedUsers üzerinden hesaplanacak

  const roleLabels: Record<string, string> = {
    admin: "Yönetici",
    editor: "Editör",
    translator: "Çevirmen",
    user: "Kullanıcı"
  };
  const roleOptions = [
    { value: "admin", label: "Yönetici" },
    { value: "editor", label: "Editör" },
    { value: "translator", label: "Çevirmen" }
  ];
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{top:number,left:number,width:number}|null>(null);
  // Her kullanıcı için buton ref'i tutmak için
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  // Her kullanıcı için kapsayıcı ref'i tutmak için
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
          setError(null);
        } else {
          setUsers([]);
          setError(data.error || "Bilinmeyen hata");
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (resultMsg) {
      setShowNotif(true);
      const timeout = setTimeout(() => setShowNotif(false), 2200);
      return () => clearTimeout(timeout);
    }
  }, [resultMsg]);

  // Dropdown pozisyonunu hesapla
  const handleDropdownOpen = (userId: string) => {
    setOpenDropdown(userId);
    const containerRef = containerRefs.current[userId];
    if (containerRef) {
      const rect = containerRef.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Dropdown dışına tıklanınca kapat
  useEffect(() => {
    if (!openDropdown) return;
    // Sadece rol değişirse kapat
    const currentUser = users.find(u => u._id === openDropdown);
    if (currentUser && currentUser.roleChanged) {
      setOpenDropdown(null);
      return;
    }
    function handleClick(e: MouseEvent) {
      const dropdown = document.getElementById('role-dropdown-portal');
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdown, users]);

  // Filtrelenmiş kullanıcılar
  const filteredUsers = users.filter(user => {
    const query = search.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.role && roleLabels[user.role]?.toLowerCase().includes(query))
    );
  });

  // Sıralama fonksiyonu
  function sortUsers(users: User[]) {
    if (!sortField) return users;
    return [...users].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      // Favori sayısı özel
      if (sortField === 'favorites') {
        aValue = a.favorites ? a.favorites.length : 0;
        bValue = b.favorites ? b.favorites.length : 0;
      }
      // Kayıt tarihi özel
      if (sortField === 'createdAt') {
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      }
      // Yetki (role) özel sıralama
      if (sortField === 'role') {
        const roleOrder = { admin: 1, editor: 2, translator: 3, user: 4 };
        const aRole = a.role && roleOrder[a.role as keyof typeof roleOrder] ? a.role : 'user';
        const bRole = b.role && roleOrder[b.role as keyof typeof roleOrder] ? b.role : 'user';
        const aRank = roleOrder[aRole as keyof typeof roleOrder] ?? 99;
        const bRank = roleOrder[bRole as keyof typeof roleOrder] ?? 99;
        return sortOrder === 'asc' ? aRank - bRank : bRank - aRank;
      }
      // Ad (name) alfabetik
      if (sortField === 'name') {
        aValue = a.name || '';
        bValue = b.name || '';
        return sortOrder === 'asc'
          ? String(aValue).localeCompare(String(bValue), 'tr')
          : String(bValue).localeCompare(String(aValue), 'tr');
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }

  const sortedUsers = sortUsers(filteredUsers);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

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
        {/* Animasyonlu Yetki Bildirimi */}
        <div
          style={{
            position: 'fixed',
            top: showNotif ? 32 : -80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            minWidth: 260,
            maxWidth: 400,
            padding: '16px 32px',
            borderRadius: 12,
            background: resultMsg && resultMsg.startsWith('Hata') ? "#e63946" : "#00c3ff",
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.08rem',
            boxShadow: '0 4px 24px #0007',
            textAlign: 'center',
            letterSpacing: '.5px',
            opacity: showNotif ? 1 : 0,
            transition: 'top 0.6s cubic-bezier(.4,0,.2,1), opacity 0.4s',
            pointerEvents: 'none',
          }}
        >
          {resultMsg}
        </div>
        <div style={{marginBottom:20, display:'flex', justifyContent:'flex-end'}}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="İsim, e-posta veya rol ara..."
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
        </div>
        {resultMsg && (
          <div style={{marginBottom:16, color: resultMsg.startsWith('Hata') ? '#ff2d55' : '#00c3ff', fontWeight:600}}>{resultMsg}</div>
        )}
        {loading ? (
          <div>Yükleniyor...</div>
        ) : error ? (
          <div style={{color:'#ff2d55',fontWeight:600,fontSize:'1.1rem',margin:'24px 0'}}>{error}</div>
        ) : (
          <table style={{width:'100%',borderCollapse:'collapse',background:'#18181b',borderRadius:12,overflow:'hidden',boxShadow:'0 2px 12px #0005'}}>
            <thead>
              <tr style={{background:'#23232b',color:'#00c3ff'}}>
                <th style={{
                  padding:'12px',
                  cursor:'pointer',
                  transition:'background 0.25s',
                  background: thActive === 'name' ? '#003366' : 'transparent',
                }}
                  onClick={() => {
                    if (sortField === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setSortField('name');
                    setThActive('name');
                    setTimeout(() => setThActive(null), 220);
                  }}
                >Ad</th>
                <th style={{
                  padding:'12px',
                  cursor:'pointer',
                  transition:'background 0.25s',
                  background: thActive === 'email' ? '#003366' : 'transparent',
                }}
                  onClick={() => {
                    if (sortField === 'email') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setSortField('email');
                    setThActive('email');
                    setTimeout(() => setThActive(null), 220);
                  }}
                >E-posta</th>
                <th style={{
                  padding:'12px',
                  cursor:'pointer',
                  transition:'background 0.25s',
                  background: thActive === 'createdAt' ? '#003366' : 'transparent',
                }}
                  onClick={() => {
                    if (sortField === 'createdAt') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setSortField('createdAt');
                    setThActive('createdAt');
                    setTimeout(() => setThActive(null), 220);
                  }}
                >Kayıt Tarihi</th>
                <th style={{
                  padding:'12px',
                  cursor:'pointer',
                  transition:'background 0.25s',
                  background: thActive === 'level' ? '#003366' : 'transparent',
                }}
                  onClick={() => {
                    if (sortField === 'level') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setSortField('level');
                    setThActive('level');
                    setTimeout(() => setThActive(null), 220);
                  }}
                >Seviye</th>
                <th style={{
                  padding:'12px',
                  cursor:'pointer',
                  transition:'background 0.25s',
                  background: thActive === 'xp' ? '#003366' : 'transparent',
                }}
                  onClick={() => {
                    if (sortField === 'xp') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setSortField('xp');
                    setThActive('xp');
                    setTimeout(() => setThActive(null), 220);
                  }}
                >XP</th>
                <th style={{
                  padding:'12px',
                  cursor:'pointer',
                  transition:'background 0.25s',
                  background: thActive === 'favorites' ? '#003366' : 'transparent',
                }}
                  onClick={() => {
                    if (sortField === 'favorites') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setSortField('favorites');
                    setThActive('favorites');
                    setTimeout(() => setThActive(null), 220);
                  }}
                >Favori Sayısı</th>
                <th style={{
                  padding:'12px',
                  cursor:'pointer',
                  transition:'background 0.25s',
                  background: thActive === 'role' ? '#003366' : 'transparent',
                }}
                  onClick={() => {
                    if (sortField === 'role') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setSortField('role');
                    setThActive('role');
                    setTimeout(() => setThActive(null), 220);
                  }}
                >Yetki</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user._id} style={{borderBottom:'1px solid #23232b',color:'#fff'}}>
                  <td style={{padding:'10px 8px'}}>{user.name || "-"}</td>
                  <td style={{padding:'10px 8px'}}>{user.email}</td>
                  <td style={{padding:'10px 8px'}}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                  <td style={{padding:'10px 8px',textAlign:'center'}}>{user.level ?? 1}</td>
                  <td style={{padding:'10px 8px',textAlign:'center'}}>{user.xp ?? 0}</td>
                  <td style={{padding:'10px 8px',textAlign:'center'}}>{user.favorites ? user.favorites.length : 0}</td>
                  <td style={{padding:'10px 8px',textAlign:'center',verticalAlign:'middle',minWidth:140}}>
                    {user.role && user.role !== 'user' ? (
                      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%'}} ref={el => { containerRefs.current[user._id] = el; }}>
                        <span style={{
                          color: roleLabels[user.role] === 'Yönetici' ? '#00c3ff' : roleLabels[user.role] === 'Editör' ? '#ffb300' : roleLabels[user.role] === 'Çevirmen' ? '#8e44ad' : '#888',
                          fontWeight:700,
                          background: '#18181b',
                          borderRadius: 8,
                          padding: '4px 14px',
                          border: '2px solid #fff2',
                          boxShadow: '0 2px 8px #0004',
                          textShadow: '0 1px 4px #0007',
                          minWidth: 80,
                          display: 'inline-block',
                          textAlign: 'center',
                        }}>{roleLabels[user.role] || user.role}</span>
                        <button
                          onClick={e => { e.stopPropagation(); handleDropdownOpen(user._id); }}
                          ref={el => { buttonRefs.current[user._id] = el; }}
                          style={{
                            background:'none',
                            border:'none',
                            padding:0,
                            margin:0,
                            marginLeft:2,
                            cursor:'pointer',
                            display:'flex',
                            alignItems:'center',
                            transition:'color 0.18s',
                            color:'#b3b3b3',
                          }}
                          title="Yetkiyi Düzenle"
                          onMouseEnter={e => (e.currentTarget.style.color = '#00c3ff')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#b3b3b3')}
                        >
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.7 3.29a1 1 0 0 1 1.41 0l.6.6a1 1 0 0 1 0 1.41l-8.48 8.48-2.12.71.71-2.12 8.48-8.48z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div style={{position:'relative',display:'inline-block'}}>
                        <button
                          ref={el => { buttonRefs.current[user._id] = el; }}
                          style={{background:'#00c3ff',color:'#fff',border:'none',borderRadius:8,padding:'6px 14px',fontWeight:600,cursor:'pointer',boxShadow:'0 2px 8px #00c3ff44',transition:'background 0.22s, color 0.22s, box-shadow 0.22s'}}
                          onClick={e => { e.stopPropagation(); handleDropdownOpen(user._id); }}
                        >Yetki Ver</button>
                      </div>
                    )}
                    {/* Portal dropdown gerçek pozisyon ve tasarım */}
                    {openDropdown && user._id === openDropdown && dropdownPos && typeof window !== 'undefined' && createPortal(
                      <div
                        style={{
                          position:'absolute',
                          top: dropdownPos.top + 6,
                          left: dropdownPos.left,
                          width: dropdownPos.width,
                          background:'#23232b',
                          border:'1px solid #222',
                          borderRadius:10,
                          boxShadow:'0 2px 12px #0006',
                          zIndex: 99999,
                          minWidth:120,
                          overflow:'visible',
                          paddingTop:6,
                          paddingBottom:6,
                          transition:'box-shadow 0.18s',
                        }}
                        id={'role-dropdown-portal'}
                      >
                        {/* Caret (ok) */}
                        <div style={{position:'absolute',top:-7,left:28,width:0,height:0,borderLeft:'7px solid transparent',borderRight:'7px solid transparent',borderBottom:'7px solid #23232b',zIndex:1}} />
                        {/* Seçenekler */}
                        {roleOptions.map(opt => (
                          <div
                            key={opt.value}
                            style={{
                              padding:'8px 14px',
                              cursor:'pointer',
                              color:user.role===opt.value?'#00c3ff':'#ededed',
                              fontWeight:600,
                              background:user.role===opt.value?'#181a22':'transparent',
                              borderRadius:6,
                              margin:'1px 6px',
                              display:'flex',
                              alignItems:'center',
                              gap:7,
                              fontSize:'1rem',
                              border:'none',
                              boxShadow:'none',
                              transition:'background 0.14s, color 0.14s',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLDivElement).style.background = '#23232b';
                              (e.currentTarget as HTMLDivElement).style.color = '#00c3ff';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLDivElement).style.background = user.role===opt.value?'#181a22':'transparent';
                              (e.currentTarget as HTMLDivElement).style.color = user.role===opt.value?'#00c3ff':'#ededed';
                            }}
                            onClick={async () => {
                              setResultMsg(null);
                              setOpenDropdown(null);
                              try {
                                const res = await fetch(`/api/admin/users?makeAdmin=${encodeURIComponent(user.email)}&role=${opt.value}`);
                                const data = await res.json();
                                if (res.ok) {
                                  setResultMsg(data.message || 'Başarılı!');
                                  setUsers(users => users.map(u => u._id === user._id ? { ...u, role: opt.value } : u));
                                } else {
                                  setResultMsg('Hata: ' + (data.error || 'Bilinmeyen hata'));
                                }
                              } catch (err) {
                                setResultMsg('Hata: Sunucuya ulaşılamadı');
                              }
                            }}
                          >
                            {user.role===opt.value && (
                              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{marginRight:2}} xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#00c3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                            {opt.label}
                          </div>
                        ))}
                        {/* Yetkiyi Sıfırla */}
                        <div
                          style={{
                            padding:'7px 14px',
                            cursor:'pointer',
                            color:'#ff2d55',
                            fontWeight:600,
                            borderRadius:6,
                            margin:'4px 6px 1px 6px',
                            background:'none',
                            border:'none',
                            fontSize:'0.98rem',
                            textAlign:'left',
                            transition:'color 0.14s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLDivElement).style.color = '#fff';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLDivElement).style.color = '#ff2d55';
                          }}
                          onClick={async () => {
                            setResultMsg(null);
                            setOpenDropdown(null);
                            try {
                              const res = await fetch(`/api/admin/users?makeAdmin=${encodeURIComponent(user.email)}&role=user`);
                              const data = await res.json();
                              if (res.ok) {
                                setResultMsg('Yetki sıfırlandı, kullanıcı artık üye!');
                                setUsers(users => users.map(u => u._id === user._id ? { ...u, role: 'user' } : u));
                              } else {
                                setResultMsg('Hata: ' + (data.error || 'Bilinmeyen hata'));
                              }
                            } catch (err) {
                              setResultMsg('Hata: Sunucuya ulaşılamadı');
                            }
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{marginRight:2}} xmlns="http://www.w3.org/2000/svg"><path d="M5 5L15 15M15 5L5 15" stroke="#ff2d55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Yetkiyi Sıfırla
                        </div>
                      </div>,
                      document.body
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
} 