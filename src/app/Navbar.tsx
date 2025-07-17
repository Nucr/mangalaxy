"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

// User tipi tanımı
type User = {
  name?: string;
  email?: string;
  about?: string;
  image?: string;
  banner?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  role?: string;
};

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const [userExtra, setUserExtra] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ekstra kullanıcı bilgisi gerekiyorsa (ör: profil resmi, seviye vs)
  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/profile/me")
        .then(res => res.json())
        .then(data => setUserExtra(data));
    } else {
      setUserExtra(null);
    }
  }, [session]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/arama?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftNav}>
        <div className={styles.logoText}>Mangalaxy</div>
        <ul className={styles.navLinks}>
          <li><Link href="/" className={styles.navLink}>Ana Sayfa</Link></li>
          <li><Link href="/seriler" className={styles.navLink}>Seriler</Link></li>
          <li><span className={styles.navLink} style={{opacity:0.5, pointerEvents:'none', cursor:'default'}}>Topluluk</span></li>
          <li><span className={styles.navLink} style={{opacity:0.5, pointerEvents:'none', cursor:'default'}}>Galaxy Plus</span></li>
          <li><span className={styles.navLink} style={{opacity:0.5, pointerEvents:'none', cursor:'default'}}>Başarımlar</span></li>
        </ul>
      </div>
      <div className={styles.centerNav}>
        <form className={styles.searchForm} role="search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Manga, webtoon veya yazar ara..."
            aria-label="Arama"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton} aria-label="Ara">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="7" stroke="#00c3ff" strokeWidth="2" />
              <line x1="14.2" y1="14.2" x2="18" y2="18" stroke="#00c3ff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      </div>
      <div className={styles.rightNav}>
        {status === "authenticated" && session?.user ? (
          <div style={{position:'relative'}} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              style={{
                background:'#23232b',
                border:'none',
                padding:'4px 16px 4px 8px',
                margin:0,
                cursor:'pointer',
                display:'flex',
                alignItems:'center',
                borderRadius: '12px',
                boxShadow: dropdownOpen ? '0 0 0 2px #00c3ff' : '0 1px 6px #00c3ff18',
                gap: '10px',
                minWidth: '120px',
                transition: 'box-shadow 0.18s',
              }}
              aria-label="Profil Menüsü"
            >
              {userExtra?.image ? (
                <Image src={userExtra.image ? userExtra.image : '/default-avatar.png'} alt="Profil" width={32} height={32} style={{borderRadius:'50%',objectFit:'cover',background:'#fff',border:'2px solid #00c3ff'}} />
              ) : (
                <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,borderRadius:'50%',background:'#fff',border:'2px solid #00c3ff'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" fill="#bbb" />
                    <ellipse cx="12" cy="17" rx="7" ry="5" fill="#bbb" />
                  </svg>
                </span>
              )}
              <span style={{color:'#fff',fontWeight:600,letterSpacing:'.5px',fontSize:'1rem'}}>{userExtra?.name || session.user.name || 'Kullanıcı'}</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{marginLeft:4}} xmlns="http://www.w3.org/2000/svg">
                <path d="M5 8L10 13L15 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {dropdownOpen && (
              <div style={{
                position:'absolute',
                right:0,
                top:48,
                minWidth:280,
                background:'#18181b',
                borderRadius:16,
                boxShadow:'0 8px 32px #000a',
                padding:'0',
                zIndex:200,
                display:'flex',
                flexDirection:'column',
                border:'1.5px solid #23232b',
                overflow:'hidden',
              }}>
                {/* Üst profil özeti */}
                <div style={{padding:'28px 0 16px 0',display:'flex',flexDirection:'column',alignItems:'center',borderBottom:'1px solid #23232b',background:'#20212b',position:'relative'}}>
                  {userExtra?.image ? (
                    <Image src={userExtra.image ? userExtra.image : '/default-avatar.png'} alt="Profil" width={64} height={64} style={{borderRadius:'50%',objectFit:'cover',background:'#fff',border:'3px solid #00c3ff',marginBottom:8}} />
                  ) : (
                    <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:64,height:64,borderRadius:'50%',background:'#fff',border:'3px solid #00c3ff',marginBottom:8}}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill="#bbb" />
                        <ellipse cx="12" cy="17" rx="7" ry="5" fill="#bbb" />
                      </svg>
                    </span>
                  )}
                  <span style={{color:'#fff',fontWeight:700,fontSize:'1.18rem',letterSpacing:'.5px'}}>{userExtra?.name || session.user.name || 'Kullanıcı'}</span>
                  <span style={{color: userExtra?.role === 'admin' ? '#ff2d55' : userExtra?.role === 'moderator' ? '#00c3ff' : '#00c3ff', fontWeight:600, fontSize:'0.98rem', marginTop:2, letterSpacing:'.2px'}}>
                    {userExtra?.role === 'admin' ? 'ADMİN' : userExtra?.role === 'moderator' ? 'MODERATOR' : 'ÜYE'}
                  </span>
                  <button onClick={()=>setDropdownOpen(false)} style={{position:'absolute',top:10,right:14,background:'none',border:'none',color:'#fff',fontSize:22,cursor:'pointer',opacity:0.7}} aria-label="Kapat">×</button>
                </div>
                {/* Menü seçenekleri */}
                <div style={{display:'flex',flexDirection:'column',padding:'8px 0',gap:'2px',background:'#18181b'}}>
                  {/* Admin Paneli butonu sadece admin/moderator için */}
                  {['admin','moderator'].includes(userExtra?.role) && (
                    <Link href="/admin" className={styles.profileDropdownItem} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 22px',color:'#ff2d55',textDecoration:'none',fontWeight:700,fontSize:'1.05rem',borderRadius:8,transition:'background 0.18s'}} onClick={()=>setDropdownOpen(false)}>
                      <svg width="20" height="20" fill="none" stroke="#ff2d55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                      Admin Paneli
                    </Link>
                  )}
                  <Link href="/profil" className={styles.profileDropdownItem} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 22px',color:'#fff',textDecoration:'none',fontWeight:500,fontSize:'1.05rem',borderRadius:8,transition:'background 0.18s'}} onClick={()=>setDropdownOpen(false)}>
                    <svg width="20" height="20" fill="none" stroke="#00c3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
                    Profilim
                  </Link>
                  <Link href="#" className={styles.profileDropdownItem} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 22px',color:'#fff',textDecoration:'none',fontWeight:500,fontSize:'1.05rem',borderRadius:8,transition:'background 0.18s',opacity:0.95}}>
                    <svg width="20" height="20" fill="none" stroke="#00c3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    Favorilerim
                  </Link>
                  <Link href="#" className={styles.profileDropdownItem} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 22px',color:'#fff',textDecoration:'none',fontWeight:500,fontSize:'1.05rem',borderRadius:8,transition:'background 0.18s',opacity:0.95}}>
                    <svg width="20" height="20" fill="none" stroke="#00c3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M8 17l4-4-4-4"/></svg>
                    Okuma Geçmişim
                  </Link>
                  <Link href="#" className={styles.profileDropdownItem} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 22px',color:'#fff',textDecoration:'none',fontWeight:500,fontSize:'1.05rem',borderRadius:8,transition:'background 0.18s',opacity:0.95}}>
                    <svg width="20" height="20" fill="none" stroke="#00c3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Yorumlarım
                  </Link>
                  <Link href="#" className={styles.profileDropdownItem} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 22px',color:'#fff',textDecoration:'none',fontWeight:500,fontSize:'1.05rem',borderRadius:8,transition:'background 0.18s',opacity:0.95}}>
                    <svg width="20" height="20" fill="none" stroke="#00c3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    Ayarlar
                  </Link>
                </div>
                {/* Çıkış */}
                <div style={{borderTop:'1px solid #23232b',padding:'10px 0',background:'#18181b'}}>
                  <button
                    onClick={async () => {
                      setDropdownOpen(false);
                      await signOut({ callbackUrl: "/" });
                      setUserExtra(null);
                    }}
                    className={styles.profileDropdownItem}
                    style={{display:'flex',alignItems:'center',gap:10,padding:'10px 22px',color:'#ff2d55',background:'none',border:'none',fontWeight:600,fontSize:'1.05rem',borderRadius:8,textAlign:'left',cursor:'pointer',width:'100%'}}
                  >
                    <svg width="20" height="20" fill="none" stroke="#ff2d55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 16l4-4-4-4"/><path d="M7 12h14"/><path d="M3 12h4"/></svg>
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/giris" className={`${styles.loginBtn} ${styles.navbarBtn}`}>Giriş Yap</Link>
            <Link href="/kayit" className={`${styles.registerBtn} ${styles.navbarBtn}`}>Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
} 