"use client";
import styles from "../page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react"; // ARTIK KULLANILMIYOR

export default function ProfilePage() {
  // const { data: session } = useSession(); // ARTIK KULLANILMIYOR
  const [user, setUser] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    about: "Kullanıcı henüz kendisi hakkında bilgi eklememiş.",
    image: "",
    banner: "",
    twitter: "",
    instagram: "",
    facebook: "",
    website: "",
    password: "",
    newPassword: "",
  });
  const [preview, setPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const roleLabels: Record<string, string> = {
    admin: "Yönetici",
    editor: "Editör",
    translator: "Çevirmen",
    user: "Kullanıcı"
  };
  const roleColors: Record<string, string> = {
    admin: '#00c3ff',
    editor: '#ffb300',
    translator: '#8e44ad',
    user: '#888'
  };

  // Kullanıcıyı API'den çek
  useEffect(() => {
    fetch("/api/profile/me")
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setForm(f => ({
          ...f,
          name: data.name ?? "",
          email: data.email ?? "",
          about: data.about ?? "Kullanıcı henüz kendisi hakkında bilgi eklememiş.",
          image: data.image ?? "",
          banner: data.banner ?? "",
          twitter: data.twitter ?? "",
          instagram: data.instagram ?? "",
          facebook: data.facebook ?? "",
          website: data.website ?? "",
        }));
        setPreview(data.image ?? "");
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  // Cloudinary'ye upload fonksiyonu
  async function uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mangalaxy_profile'); // Cloudinary panelinde oluşturduğun preset adı
    const res = await fetch('https://api.cloudinary.com/v1_1/dfn2gamuh/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  }

  // Profil fotoğrafı seçildiğinde önce Cloudinary'ye yükle
  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Cloudinary'ye upload et
      const url = await uploadImageToCloudinary(file);
      setPreview(url);
      setForm(f => ({ ...f, image: url }));
    }
  }
  // Banner görseli seçildiğinde Cloudinary'ye yükle
  async function handleBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Cloudinary'ye upload et
      const url = await uploadImageToCloudinary(file);
      setBannerPreview(url);
      setForm(f => ({ ...f, banner: url }));
    }
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name || !form.email) {
      setNotification({type: 'error', message: 'Kullanıcı adı ve e-posta zorunludur!'});
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          image: form.image,
          about: form.about,
          twitter: form.twitter,
          instagram: form.instagram,
          facebook: form.facebook,
          website: form.website,
          banner: form.banner, // Banner alanı eklendi
        })
      });
      if (res.ok) {
        setEditOpen(false);
        setNotification({type: 'success', message: 'Profil başarıyla güncellendi!'});
        setTimeout(() => setNotification(null), 3000);
        // PROFİLİ TEKRAR ÇEK
        fetch("/api/profile/me")
          .then(res => res.json())
          .then(data => {
            setUser(data);
            setForm(f => ({
              ...f,
              name: data.name ?? "",
              email: data.email ?? "",
              about: data.about ?? "Kullanıcı henüz kendisi hakkında bilgi eklememiş.",
              image: data.image ?? "",
              banner: data.banner ?? "",
              twitter: data.twitter ?? "",
              instagram: data.instagram ?? "",
              facebook: data.facebook ?? "",
              website: data.website ?? "",
            }));
            setPreview(data.image ?? "");
          });
      } else {
        setNotification({type: 'error', message: 'Bir hata oluştu!'});
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      setNotification({type: 'error', message: 'Bir hata oluştu!'});
      setTimeout(() => setNotification(null), 3000);
    }
  }
  function handleCancel() {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      about: user?.about ?? "Kullanıcı henüz kendisi hakkında bilgi eklememiş.",
      image: user?.image ?? "",
      banner: form.banner ?? "",
      twitter: form.twitter ?? "",
      instagram: form.instagram ?? "",
      facebook: form.facebook ?? "",
      website: form.website ?? "",
      password: "",
      newPassword: ""
    });
    setPreview(user?.image ?? "");
    setBannerPreview("");
    setEditOpen(false);
  }

  // Giriş yapılmamışsa veya user yoksa
  if (!user) {
    return <div style={{color:'#fff',textAlign:'center',marginTop:64,fontSize:'1.2rem'}}>Lütfen giriş yapın.</div>;
  }

  return (
    <>
      {/* Bildirim */}
      {notification && (
        <div
          className={styles.notificationBox}
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            zIndex: 2000,
            minWidth: 280,
            maxWidth: 400,
            padding: '16px 32px',
            borderRadius: 12,
            background: notification.type === 'success' ? "#00c3ff" : "#e63946",
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.08rem',
            boxShadow: '0 4px 24px #0007',
            textAlign: 'center',
            letterSpacing: '.5px',
          }}
        >
          {notification.message}
        </div>
      )}
      <div style={{width:'100%', minHeight:'100vh', background:'none', display:'flex', flexDirection:'column', alignItems:'center', marginTop:24, position:'relative'}}>
        {/* Banner Alanı */}
        <div style={{width:'100%', maxWidth:900, height:200, background:'#181a22', borderRadius:24, marginBottom:0, position:'relative', boxShadow:'0 4px 32px #0008', overflow:'hidden', zIndex:1}}>
          {(bannerPreview || form.banner || user?.banner) ? (
            <img src={bannerPreview || form.banner || user?.banner} alt="Banner" style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',left:0,top:0,zIndex:1}} />
          ) : (
            <div style={{position:'absolute', inset:0, zIndex:1, pointerEvents:'none'}}>
              <svg width="100%" height="100%" style={{position:'absolute',top:0,left:0}}>
                <circle cx="60" cy="40" r="1.5" fill="#fff" opacity="0.7" />
                <circle cx="200" cy="80" r="1.2" fill="#fff" opacity="0.5" />
                <circle cx="400" cy="60" r="1.8" fill="#fff" opacity="0.8" />
                <circle cx="700" cy="120" r="1.1" fill="#fff" opacity="0.6" />
                <circle cx="850" cy="30" r="1.4" fill="#fff" opacity="0.7" />
              </svg>
            </div>
          )}
        </div>
        {/* Profil Fotoğrafı ve Adı */}
        <div style={{display:'flex',alignItems:'center',gap:24,marginTop:-64,marginBottom:24, position:'relative', zIndex:2}}>
          <div style={{width:128,height:128,borderRadius:'50%',overflow:'hidden',boxShadow:'0 2px 16px #00c3ff55', background:'#18181b'}}>
            <img src={preview || user.image || '/default-avatar.png'} alt="Profil" style={{width:'100%',height:'100%',objectFit:'cover'}} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:'2rem',fontWeight:800,color:'#fff',fontFamily:'Orbitron, Poppins, sans-serif'}}>{user.name || 'Kullanıcı'}</span>
              {user.role && (
                <span style={{
                  background: roleColors[user.role] || '#888',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 8,
                  padding: '4px 14px',
                  marginLeft: 4,
                  letterSpacing: '.5px',
                  boxShadow: '0 2px 8px #0004',
                  textShadow: '0 1px 4px #0007',
                  border: '2px solid #fff2',
                  display: 'inline-block',
                  minWidth: 80,
                  textAlign: 'center',
                }}>
                  {roleLabels[user.role] || user.role}
                </span>
              )}
            </div>
            {/* Diğer bilgiler */}
            {/* Seviye Rozeti ve Seri Rozeti */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginTop:6,marginBottom:4}}>
              <div style={{display:'inline-block',padding:'4px 16px',borderRadius:16,background:'linear-gradient(90deg,#00c3ff 60%,#00fff0 100%)',color:'#fff',fontWeight:700,fontSize:'1.05rem',letterSpacing:'.5px',boxShadow:'0 2px 8px #00c3ff33'}}>
                Seviye {user?.level}
              </div>
              {/* Seri Rozeti */}
              {user?.streak && (
                (() => {
                  let streakClass = styles.streakBadge + ' ';
                  let streakIcon = '🌙';
                  if (user.streak >= 7) {
                    streakClass += styles.streakBadge + ' ' + styles['streakBadge--red'];
                    streakIcon = '🔥';
                  } else if (user.streak >= 5) {
                    streakClass += styles.streakBadge + ' ' + styles['streakBadge--orange'];
                    streakIcon = '🔥';
                  } else if (user.streak >= 3) {
                    streakClass += styles.streakBadge + ' ' + styles['streakBadge--yellow'];
                    streakIcon = '☀️';
                  } else {
                    streakClass += styles.streakBadge + ' ' + styles['streakBadge--white'];
                    streakIcon = '🌙';
                  }
                  return (
                    <span className={streakClass.trim()} title={`Günlük Seri: ${user.streak}`}>{streakIcon} {user.streak} Gün</span>
                  );
                })()
              )}
            </div>
            {/* Seviye İlerleme Barı */}
            {user?.level && (
              (() => {
                const xp = user?.xp ?? 0;
                const level = user?.level ?? 1;
                const xpForLevel = 100 * Math.pow(2, level - 1);
                const progressPercent = Math.min(100, Math.round((xp / xpForLevel) * 100));
                return (
                  <div style={{marginTop: 8, marginBottom: 12}}>
                    <div style={{
                      width: 220,
                      height: 14,
                      background: '#23232b',
                      borderRadius: 8,
                      overflow: 'hidden',
                      boxShadow: '0 1px 6px #00c3ff22',
                      margin: '0 auto'
                    }}>
                      <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg,#00c3ff 60%,#00fff0 100%)',
                        transition: 'width 0.4s cubic-bezier(.4,0,.2,1)'
                      }} />
                    </div>
                    <div style={{textAlign:'center',color:'#00c3ff',fontWeight:600,fontSize:'0.98rem',marginTop:2,letterSpacing:'.2px'}}>
                      {xp} / {xpForLevel} XP
                    </div>
                  </div>
                );
              })()
            )}
            {/* Sosyal Medya İkonları sadece burada gösterilecek */}
            {(form.twitter || form.instagram || form.facebook || form.website) && (
              <div style={{display:'flex',justifyContent:'center',gap:18,marginTop:8,marginBottom:8}}>
                {form.twitter && (
                  <a href={form.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} style={{color:'#1da1f2',fontSize:28}} title="Twitter">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 5.924c-.793.352-1.646.59-2.542.697a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.082 4.48 4.48 0 0 0-7.64 4.085A12.72 12.72 0 0 1 3.112 4.89a4.48 4.48 0 0 0 1.387 5.976 4.47 4.47 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.594 4.393 4.5 4.5 0 0 1-2.025.077 4.48 4.48 0 0 0 4.184 3.112A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.77 0-.195-.004-.39-.013-.583A9.22 9.22 0 0 0 24 4.59a8.93 8.93 0 0 1-2.54.697z"/></svg>
                  </a>
                )}
                {form.instagram && (
                  <a href={form.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} style={{color:'#e1306c',fontSize:28}} title="Instagram">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.77.131 4.672.425 3.678 1.42c-.994.994-1.288 2.092-1.347 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.282.353 2.38 1.347 3.374.994.994 2.092 1.288 3.374 1.347C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.059 2.38-.353 3.374-1.347.994-.994 1.288-2.092 1.347-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.282-.353-2.38-1.347-3.374-.994-.994-2.092-1.288-3.374-1.347C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
                  </a>
                )}
                {form.facebook && (
                  <a href={form.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} style={{color:'#1877f3',fontSize:28}} title="Facebook">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                  </a>
                )}
                {form.website && (
                  <a href={form.website} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} style={{color:'#00c3ff',fontSize:28}} title="Web Sitesi">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8 0-1.306.418-2.515 1.126-3.5h2.021A6.978 6.978 0 0 0 5 12c0 3.866 3.134 7 7 7s7-3.134 7-7c0-.708-.092-1.391-.252-2.043l1.126-1.126A7.963 7.963 0 0 1 20 12c0 4.411-3.589 8-8 8z"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Profili Düzenle Butonu */}
        <div style={{marginTop:8, marginBottom:8, textAlign:'center'}}>
          <button onClick={()=>setEditOpen(true)} style={{background:'linear-gradient(90deg, #00c3ff 60%, #00fff0 100%)', color:'#fff', fontWeight:700, fontSize:'1.08rem', borderRadius:12, padding:'12px 32px', textDecoration:'none', boxShadow:'0 2px 8px #00c3ff33', transition:'background 0.18s', border:'none', cursor:'pointer'}}>Profili Düzenle</button>
        </div>
      {/* Modal */}
      {editOpen && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.55)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#18181b',borderRadius:18,padding:'36px 36px 28px 36px',minWidth:420,maxWidth:540,width:'100%',boxShadow:'0 8px 32px #000a',position:'relative',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <button onClick={handleCancel} style={{position:'absolute',top:12,right:16,background:'none',border:'none',color:'#fff',fontSize:26,cursor:'pointer',opacity:0.7}} aria-label="Kapat">×</button>
            <div style={{fontWeight:800,fontSize:'1.3rem',color:'#00c3ff',marginBottom:18}}>Profili Düzenle</div>
            <form onSubmit={handleSubmit} style={{width:'100%',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px 24px',alignItems:'start'}}>
              {/* Banner Fotoğrafı (tam satır) */}
              <div style={{gridColumn:'1/3',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                <label htmlFor="bannerImage" style={{cursor:'pointer'}}>
                  {bannerPreview || form.banner ? (
                    <img src={bannerPreview || form.banner} alt="Banner" style={{width:220,height:56,borderRadius:8,objectFit:'cover',background:'#23232b',marginBottom:4}} />
                  ) : (
                    <div style={{width:220,height:56,borderRadius:8,background:'#23232b',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:4}}>
                      <span style={{color:'#b3b3b3',fontSize:'0.98rem'}}>Banner Fotoğrafı</span>
                    </div>
                  )}
                  <input id="bannerImage" type="file" accept="image/*" onChange={handleBanner} style={{display:'none'}} />
                </label>
                <span style={{fontSize:'0.98rem',color:'#b3b3b3'}}>Banner Fotoğrafı</span>
              </div>
              {/* Profil Fotoğrafı (tam satır) */}
              <div style={{gridColumn:'1/3',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                <label htmlFor="profileImage" style={{cursor:'pointer'}}>
                  {preview ? (
                    <img src={preview} alt="Profil" style={{width:72,height:72,borderRadius:'50%',border:'3px solid #00c3ff',objectFit:'cover',background:'#fff'}} />
                  ) : (
                    <div style={{width:72,height:72,borderRadius:'50%',border:'3px solid #00c3ff',background:'#23232b',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" fill="#bbb" /><ellipse cx="12" cy="18" rx="8" ry="5" fill="#bbb" /></svg>
                    </div>
                  )}
                  <input id="profileImage" type="file" accept="image/*" onChange={handleImage} style={{display:'none'}} />
                </label>
                <span style={{fontSize:'0.98rem',color:'#b3b3b3'}}>Profil Fotoğrafı</span>
              </div>
              {/* Sol sütun */}
              <label style={{color:'#fff',fontWeight:600,fontSize:'1.05rem'}}>Mail
                <input type="email" name="email" value={form.email} onChange={handleChange} style={{width:'100%',marginTop:4,padding:'8px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem',marginBottom:0}} required />
              </label>
              <label style={{color:'#fff',fontWeight:600,fontSize:'1.05rem'}}>Kullanıcı Adı
                <input type="text" name="name" value={form.name} onChange={handleChange} style={{width:'100%',marginTop:4,padding:'8px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem',marginBottom:0}} required />
              </label>
              <label style={{gridColumn:'1/3',color:'#fff',fontWeight:600,fontSize:'1.05rem'}}>Hakkında
                <textarea name="about" value={form.about} onChange={handleChange} rows={2} style={{width:'100%',marginTop:4,padding:'8px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem',resize:'vertical',marginBottom:0}} />
              </label>
              <label style={{color:'#fff',fontWeight:600,fontSize:'1.05rem'}}>Mevcut Şifre
                <input type="password" name="password" value={form.password} onChange={handleChange} style={{width:'100%',marginTop:4,padding:'8px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem',marginBottom:0}} autoComplete="current-password" />
              </label>
              <label style={{color:'#fff',fontWeight:600,fontSize:'1.05rem'}}>Yeni Şifre
                <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} style={{width:'100%',marginTop:4,padding:'8px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem',marginBottom:0}} autoComplete="new-password" />
              </label>
              {/* Sosyal Medya alanları iki sütun */}
              <label style={{color:'#fff',fontWeight:600,fontSize:'1.05rem'}}>Twitter
                <input type="url" name="twitter" value={form.twitter} onChange={handleChange} placeholder="https://twitter.com/kullanici" style={{width:'100%',marginTop:4,padding:'8px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem',marginBottom:0}} />
              </label>
              <label style={{color:'#fff',fontWeight:600,fontSize:'1.05rem'}}>Instagram
                <input type="url" name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/kullanici" style={{width:'100%',marginTop:4,padding:'8px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem',marginBottom:0}} />
              </label>
              <label style={{color:'#fff',fontWeight:600,fontSize:'1.05rem'}}>Facebook
                <input type="url" name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/kullanici" style={{width:'100%',marginTop:4,padding:'8px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem',marginBottom:0}} />
              </label>
              <label style={{color:'#fff',fontWeight:600,fontSize:'1.05rem'}}>Web Sitesi
                <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://site.com" style={{width:'100%',marginTop:4,padding:'8px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem',marginBottom:0}} />
              </label>
              {/* Butonlar tam satır */}
              <div style={{gridColumn:'1/3',display:'flex',gap:12,marginTop:8}}>
                <button type="button" onClick={handleCancel} style={{flex:1,background:'#23232b',color:'#fff',fontWeight:700,padding:'10px 0',borderRadius:8,border:'none',fontSize:'1.05rem',cursor:'pointer'}}>İptal</button>
                <button type="submit" style={{flex:1,background:'linear-gradient(90deg, #00c3ff 60%, #00fff0 100%)',color:'#fff',fontWeight:700,padding:'10px 0',borderRadius:8,border:'none',fontSize:'1.05rem',cursor:'pointer'}}>Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Kartlar Grid */}
      <div style={{width:'100%', maxWidth:900, display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, marginTop:32}}>
        {/* Hakkında */}
        <div style={{background:'#18181b', borderRadius:16, boxShadow:'0 2px 12px #0005', padding:'24px 20px', minHeight:120, display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <div style={{fontWeight:700, color:'#fff', fontSize:'1.15rem', marginBottom:8}}>Hakkında</div>
          <div style={{color:'#b3b3b3', fontSize:'1.05rem'}}>{form.about}</div>
        </div>
        {/* Favoriler */}
        <div style={{background:'#18181b', borderRadius:16, boxShadow:'0 2px 12px #0005', padding:'24px 20px', minHeight:120, display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <div style={{fontWeight:700, color:'#fff', fontSize:'1.15rem', marginBottom:8}}>Favoriler</div>
          <div style={{color:'#b3b3b3', fontSize:'1.05rem'}}>Henüz favori içerik eklenmemiş.</div>
        </div>
        {/* İstatistikler */}
        <div style={{background:'#18181b', borderRadius:16, boxShadow:'0 2px 12px #0005', padding:'24px 20px', minHeight:120, display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <div style={{fontWeight:700, color:'#fff', fontSize:'1.15rem', marginBottom:8}}>İstatistikler</div>
          <div style={{color:'#b3b3b3', fontSize:'1.05rem', marginBottom:4}}>Favoriler: 0</div>
          <div style={{color:'#b3b3b3', fontSize:'1.05rem', marginBottom:4}}>Okunan Bölümler: 1</div>
          <div style={{color:'#b3b3b3', fontSize:'1.05rem'}}>Yorumlar: 0</div>
        </div>
        {/* Okuma Geçmişi */}
        <div style={{background:'#18181b', borderRadius:16, boxShadow:'0 2px 12px #0005', padding:'24px 20px', minHeight:120, display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <div style={{fontWeight:700, color:'#fff', fontSize:'1.15rem', marginBottom:8}}>Okuma Geçmişi</div>
          <ul style={{margin:0, padding:0, listStyle:'none'}}>
            <li style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
              <Image src={'/soylu-ailenin-oglu.png'} alt={'Akademinin Dehası'} width={40} height={56} style={{borderRadius:6, boxShadow:'0 1px 4px #0002'}} />
              <div>
                <div style={{color:'#fff', fontWeight:600, fontSize:'1.05rem'}}>Akademinin Dehası</div>
                <div style={{color:'#b3b3b3', fontSize:'0.98rem'}}>Bölüm 106.00 - Bölüm 106</div>
                <div style={{color:'#00c3ff', fontSize:'0.95rem'}}>3 gün önce</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
} 