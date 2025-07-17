"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

type CommentType = {
  name: string;
  text: string;
  emoji?: string;
  date: string;
  avatar?: string;
  role?: string;
  streak?: number;
  likes?: string[];
  dislikes?: string[];
  user?: string;
  replies?: CommentType[];
};

type Chapter = {
  bolum_no: string;
  bolum_adi?: string;
  sayfalar?: string[];
};
type Manga = {
  _id?: string;
  title: string;
  cover: string;
  desc?: string;
  categories?: string[];
  chapters: Chapter[];
};

export default function BolumOkumaPage() {
  const { slug, bolum_no } = useParams();
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [emojiCounts, setEmojiCounts] = useState<{[key:string]:number}>({ '👍': 0, '😂': 0, '😍': 0, '😮': 0, '😢': 0, '👎': 0 });
  const [selectedEmoji, setSelectedEmoji] = useState<string|null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentEmoji, setCommentEmoji] = useState<string>("");
  const [showReplyForm, setShowReplyForm] = useState<number|null>(null);
  const [replyText, setReplyText] = useState<string>("");

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setFullscreen(false);
    }
  }
  useEffect(() => {
    function onFsChange() { setFullscreen(!!document.fullscreenElement); }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

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

  useEffect(() => {
    if (!slug || !bolum_no) return;
    let url = `/api/mangalar/${slug}/yorumlar?bolum_no=${bolum_no}`;
    if (session) {
      const user = encodeURIComponent(session.user?.email || session.user?.name || "user");
      url += `&user=${user}`;
    }
    fetch(url)
      .then(async r => {
        if (!r.ok) { const text = await r.text(); throw new Error(text || `API Hatası: ${r.status}`); }
        return r.json();
      })
      .then(data => {
        if (data.comments) setComments(data.comments);
        if (data.emojiCounts) setEmojiCounts(data.emojiCounts);
        if (data.selectedEmoji !== undefined) setSelectedEmoji(data.selectedEmoji);
        setError("");
      })
      .catch(e => setError("Yorumlar yüklenemedi: " + (e.message || "Bilinmeyen hata")));
  }, [slug, bolum_no, session]);

  async function handleEmojiClick(emoji:string) {
    if (session) {
      if (selectedEmoji === emoji) {
        setSelectedEmoji(null);
        setEmojiCounts(prev => ({ ...prev, [emoji]: Math.max((prev[emoji]||1)-1, 0) }));
        await fetch(`/api/mangalar/${slug}/yorumlar`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bolum_no, emoji: null, user: session.user?.email || session.user?.name || "user" })
        });
        return;
      }
      if (selectedEmoji) {
        if (selectedEmoji === emoji) {
          setEmojiCounts(prev => ({ ...prev, [emoji]: Math.max((prev[emoji]||1)-1, 0) }));
        } else {
          setEmojiCounts(prev => {
            const updated = { ...prev };
            updated[selectedEmoji] = Math.max((prev[selectedEmoji]||1)-1, 0);
            updated[emoji] = (prev[emoji]||0)+1;
            return updated;
          });
        }
      } else {
        setEmojiCounts(prev => ({ ...prev, [emoji]: (prev[emoji]||0)+1 }));
      }
      setSelectedEmoji(emoji);
      const res = await fetch(`/api/mangalar/${slug}/yorumlar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bolum_no, emoji, user: session.user?.email || session.user?.name || "user" })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.emojiCounts) setEmojiCounts(data.emojiCounts);
        if (data.selectedEmoji !== undefined) setSelectedEmoji(data.selectedEmoji);
      }
    } else {
      if (selectedEmoji === emoji) {
        setSelectedEmoji(null);
        setEmojiCounts(prev => ({ ...prev, [emoji]: Math.max((prev[emoji]||1)-1, 0) }));
      } else if (selectedEmoji) {
        setSelectedEmoji(emoji);
        setEmojiCounts(prev => {
          const updated = { ...prev };
          updated[selectedEmoji] = Math.max((prev[selectedEmoji]||1)-1, 0);
          updated[emoji] = (prev[emoji]||0)+1;
          return updated;
        });
      } else {
        setSelectedEmoji(emoji);
        setEmojiCounts(prev => ({ ...prev, [emoji]: (prev[emoji]||0)+1 }));
      }
    }
  }
  async function handleCommentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!commentText.trim() || !session) return;
    const user = session.user?.email || session.user?.name || "user";
    const newComment = {
      name: commentName.trim() || session.user?.name || "Anonim",
      text: commentText.trim(),
      emoji: commentEmoji,
      user,
      bolum_no
    };
    const res = await fetch(`/api/mangalar/${slug}/yorumlar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment)
    });
    if (res.ok) {
      setComments(prev => [
        { ...newComment, date: new Date().toLocaleString('tr-TR') },
        ...prev
      ]);
      setCommentText("");
      setCommentEmoji("");
      setCommentName("");
    }
  }
  function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }
  function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }
  function timeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'şimdi';
    if (diffMin < 60) return `${diffMin} dakika önce`;
    const diffSaat = Math.floor(diffMin / 60);
    if (diffSaat < 24) return `${diffSaat} saat önce`;
    const diffGun = Math.floor(diffSaat / 24);
    return `${diffGun} gün önce`;
  }

  if (loading) return <div style={{color:'#00c3ff',textAlign:'center',margin:'2em 0'}}>Yükleniyor...</div>;
  if (error) return <div style={{color:'#e63946',textAlign:'center',margin:'2em 0'}}>{error}</div>;
  if (!manga) return null;

  const bolum = Array.isArray(manga?.chapters)
    ? manga.chapters.find((b: Chapter) => String(b.bolum_no) === String(bolum_no) || String((b as Partial<Chapter>).no) === String(bolum_no))
    : null;
  const sayfalar: string[] = bolum?.sayfalar || [];

  // Bölüm indexini bul
  const bolumIndex = manga?.chapters ? manga.chapters.findIndex((b: Chapter)=>String(b.bolum_no)===String(bolum_no)||String((b as Partial<Chapter>).no)===String(bolum_no)) : -1;
  const isFirst = bolumIndex === 0;
  const isLast = manga?.chapters && bolumIndex === manga.chapters.length-1;

  // Buton stillerini güncelle
  const buttonStyle = {
    padding: '8px 18px',
    borderRadius: 8,
    border: 'none',
    background: 'rgba(0,195,255,0.08)',
    color: '#00c3ff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.18s',
    minWidth: 0,
    outline: 'none',
    boxShadow: '0 2px 8px #00c3ff11',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };
  const buttonHoverStyle = {
    background: '#00c3ff22',
    color: '#00e6ff',
  };

  // Yorum kartı stilini güncelle
  const commentCardStyle = {
    background: '#18181b',
    borderRadius: 4,
    padding: '10px 24px',
    minHeight: 56,
    boxShadow: '0 1px 4px #00c3ff11',
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    marginBottom: 12,
  };
  const avatarStyle = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    overflow: 'hidden',
    background: '#23232b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 18,
    color: '#00c3ff',
  };

  return (
    <div ref={containerRef} style={{background:'#0a0a0a',minHeight:'100vh',paddingBottom:80}}>
      {/* Modern ve sade bölüm geçiş barı */}
      <div style={{
        width: '100%',
        maxWidth: 1100,
        margin: '32px auto 0 auto',
        padding: '10px 0',
        background: 'rgba(20,24,32,0.92)',
        borderRadius: 14,
        boxShadow: '0 2px 16px #00c3ff22',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        border: '1.5px solid #00c3ff55',
        flexWrap: 'wrap',
        position: 'relative',
      }}>
        {/* Sol: İçeriğe Dön */}
        <div style={{flex:1,display:'flex',justifyContent:'flex-start'}}>
          <button onClick={()=>router.push(`/manga/${slug}`)}
            style={{...buttonStyle, ...(isFirst ? {} : buttonHoverStyle)}}
            onMouseOver={e=>Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseOut={e=>Object.assign(e.currentTarget.style, buttonStyle)}
          >← İçeriğe Dön</button>
        </div>
        {/* Orta: Bölüm seçici */}
        <div style={{flex:1,display:'flex',justifyContent:'center'}}>
          <select
            value={bolum_no || ""}
            onChange={e=>router.push(`/manga/${slug}/bolum/${e.target.value}`)}
            style={{
              padding:'8px 18px',
              borderRadius:8,
              border:'1.5px solid #00c3ff',
              background:'#23232b',
              color:'#00c3ff',
              fontWeight:700,
              fontSize:'1.08rem',
              outline:'none',
              boxShadow:'0 2px 8px #00c3ff11',
              minWidth:120,
              textAlign:'center',
              cursor:'pointer',
              transition:'border 0.18s,color 0.18s,box-shadow 0.18s',
              fontFamily:'Poppins, Orbitron, sans-serif',
              maxWidth:220,
            }}
          >
            {manga?.chapters?.map((b: Chapter,i:number)=>(
              <option key={i} value={b.bolum_no||b.no} style={{color:'#23232b',background:'#fff'}}>{b.bolum_adi||b.name||b.adi||`Bölüm ${b.bolum_no||b.no}`}</option>
            ))}
          </select>
        </div>
        {/* Sağ: Önceki/Sonraki/İçeriğe Git butonları */}
        <div style={{flex:1,display:'flex',justifyContent:'flex-end',gap:8}}>
          {/* Önceki Bölüm butonu: ilk bölümde gösterilmez */}
          {!isFirst && (
            <button onClick={() => {
              if(bolumIndex>0) router.push(`/manga/${slug}/bolum/${manga.chapters[bolumIndex-1].bolum_no||manga.chapters[bolumIndex-1].no}`);
            }}
            style={{...buttonStyle, ...(isFirst ? {} : buttonHoverStyle)}}
            onMouseOver={e=>Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseOut={e=>Object.assign(e.currentTarget.style, buttonStyle)}
            >← Önceki Bölüm</button>
          )}
          {/* Sonraki Bölüm butonu: son bölümde gösterilmez */}
          {!isLast && (
            <button onClick={() => {
              if(bolumIndex<manga.chapters.length-1) router.push(`/manga/${slug}/bolum/${manga.chapters[bolumIndex+1].bolum_no||manga.chapters[bolumIndex+1].no}`);
            }}
            style={{...buttonStyle, ...(isLast ? {} : buttonHoverStyle)}}
            onMouseOver={e=>Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseOut={e=>Object.assign(e.currentTarget.style, buttonStyle)}
            >Sonraki Bölüm →</button>
          )}
          {/* İçeriğe Git butonu: her zaman */}
          <button onClick={()=>router.push(`/manga/${slug}`)}
            style={{...buttonStyle, ...(isLast ? {} : buttonHoverStyle)}}
            onMouseOver={e=>Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseOut={e=>Object.assign(e.currentTarget.style, buttonStyle)}
          >
            <span style={{display:'inline-flex',alignItems:'center',gap:4}}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight:4}}><path d="M3 5.5C3 4.11929 4.11929 3 5.5 3H14.5C15.8807 3 17 4.11929 17 5.5V14.5C17 15.8807 15.8807 17 14.5 17H5.5C4.11929 17 3 15.8807 3 14.5V5.5Z" stroke="#00c3ff" strokeWidth="1.5"/><path d="M7 8H13M7 10.5H13M7 13H10" stroke="#00c3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>
              İçeriğe Git
            </span>
          </button>
        </div>
      </div>
      <h1 style={{color:'#fff',fontWeight:800,fontSize:'2rem',textAlign:'center',margin:'32px 0 0 0',fontFamily:'Orbitron, Poppins, sans-serif'}}>
        {bolum?.bolum_adi ? bolum.bolum_adi : `Bölüm ${bolum_no}`}
      </h1>
      <h2 style={{color:'#b3b3b3',fontWeight:600,fontSize:'1.2rem',textAlign:'center',margin:'0 0 32px 0',fontFamily:'Poppins, Orbitron, sans-serif'}}>
        {bolum?.bolum_no ? ` ${bolum.bolum_no}. Bölüm` : ""}
      </h2>
      {sayfalar.length > 0 ? (
        <div style={{display:'flex',flexDirection:'column',gap:24,alignItems:'center'}}>
          {sayfalar.map((url, i) => (
            <Image key={i} src={'/uploads/' + url.replace(/^\/|\//, '')} alt={`Sayfa ${i+1}`} width={800} height={1200} />
          ))}
        </div>
      ) : (
        <div style={{color:'#888',fontSize:'1.08rem',textAlign:'center',marginTop:32}}>Bu bölümde henüz görsel yok.</div>
      )}
      {/* Tam ekran ve yukarı/aşağı butonları */}
      <div style={{position:'fixed',right:32,bottom:32,zIndex:100,display:'flex',flexDirection:'column',gap:16,alignItems:'flex-end'}}>
        <button onClick={toggleFullscreen} style={{background:'#23232b',color:'#00c3ff',border:'none',borderRadius:'50%',width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,boxShadow:'0 2px 8px #00c3ff33',cursor:'pointer',marginBottom:8}} title="Tam Ekran">
          {fullscreen ? '⤢' : '⤢'}
        </button>
        <div style={{display:'flex',gap:12}}>
          <button onClick={scrollToTop} style={{background:'#e63946',color:'#fff',border:'none',borderRadius:'50%',width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,boxShadow:'0 2px 8px #e6394633',cursor:'pointer'}} title="Yukarı Git">
            <span style={{fontSize:28}}>↑</span>
          </button>
          <button onClick={scrollToBottom} style={{background:'#e63946',color:'#fff',border:'none',borderRadius:'50%',width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,boxShadow:'0 2px 8px #e6394633',cursor:'pointer'}} title="Aşağı Git">
            <span style={{fontSize:28}}>↓</span>
          </button>
        </div>
      </div>
      {/* Modern Yorum ve Emoji Alanı */}
      <div style={{maxWidth:700,margin:'48px auto 0 auto',background:'#18181b',borderRadius:14,boxShadow:'0 2px 16px #00c3ff22',padding:'28px 24px',border:'1.5px solid #00c3ff33'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:18}}>
          <span style={{fontWeight:700,fontSize:'1.18rem',color:'#fff',marginBottom:8}}>Bölüm Nasıldı?</span>
          <div style={{display:'flex',gap:32,justifyContent:'center',marginBottom:8,flexWrap:'wrap'}}>
            {Object.keys(emojiCounts).map(emoji => (
              <div key={emoji} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <button
                  onClick={()=>handleEmojiClick(emoji)}
                  style={{fontSize:32,padding:'8px 16px',borderRadius:12,border:selectedEmoji===emoji?'2.5px solid #00c3ff':'1.5px solid #23232b',background:selectedEmoji===emoji?'#23232b':'#18181b',color:selectedEmoji===emoji?'#00c3ff':'#fff',boxShadow:selectedEmoji===emoji?'0 2px 12px #00c3ff55':'0 1px 6px #00c3ff18',cursor:'pointer',transition:'all 0.18s',fontWeight:700,outline:'none',minWidth:56}}
                  disabled={!!session && !!selectedEmoji && selectedEmoji !== emoji}
                >
                  {emoji}
                </button>
                <span style={{color:'#fff',fontWeight:600,fontSize:18}}>{emojiCounts[emoji]}</span>
              </div>
            ))}
          </div>
          <span style={{color:'#b3b3b3',fontSize:'1rem',marginTop:4}}>{comments.length} yanıt</span>
        </div>
        {/* Yorum formu sadece giriş yapanlara açık */}
        {session ? (
          <form onSubmit={handleCommentSubmit} style={{display:'flex',flexDirection:'column',gap:12,marginTop:8}}>
            <div style={{display:'flex',gap:12}}>
              <input
                type="text"
                placeholder="Adınız (isteğe bağlı)"
                value={session.user?.name ? session.user?.name : commentName}
                onChange={e=>setCommentName(e.target.value)}
                style={{flex:1,padding:'10px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem'}}
                disabled={!!session.user?.name}
              />
            </div>
            <textarea
              placeholder="Yorumunuzu yazın..."
              value={commentText}
              onChange={e=>setCommentText(e.target.value)}
              rows={3}
              style={{padding:'10px 12px',borderRadius:8,border:'1.5px solid #23232b',background:'#23232b',color:'#fff',fontSize:'1rem',resize:'vertical'}}
            />
            <button type="submit" style={{alignSelf:'flex-end',background:'linear-gradient(90deg,#00c3ff 60%,#ff2d55 100%)',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,fontSize:'1.08rem',cursor:'pointer',boxShadow:'0 2px 8px #00c3ff22',marginTop:4,transition:'background 0.18s'}}>
              Gönder
            </button>
          </form>
        ) : (
          <div style={{color:'#e63946',textAlign:'center',marginTop:12,fontWeight:600,fontSize:'1.08rem',background:'#23232b',padding:'12px 0',borderRadius:8}}>
            Yorum yapmak için lütfen <a href="/giris" style={{color:'#00c3ff',textDecoration:'underline'}}>giriş yapın</a>.
          </div>
        )}
        {/* Yorumlar listesi */}
        <div style={{marginTop:28}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <span style={{color:'#fff',fontWeight:700,fontSize:'1.13rem'}}>Yorumlar <span style={{color:'#00c3ff'}}>({comments.length})</span></span>
            <select style={{padding:'6px 12px',borderRadius:6,border:'1.5px solid #23232b',background:'#23232b',color:'#00c3ff',fontWeight:600,fontSize:'0.98rem'}}>
              <option>En Yeni</option>
              <option>En Eski</option>
            </select>
          </div>
          {comments.length === 0 ? (
            <div style={{color:'#888',textAlign:'center'}}>Henüz yorum yok. İlk yorumu sen yaz!</div>
          ) : (
            comments.map((c,i)=>{
              // Demo: Avatar, rol, streak, like/dislike için örnek veriler
              const avatar = (c as {avatar?: string}).avatar || '/default-avatar.png';
              const role = (c as {role?: string, name?: string}).role || (c.name?.toLowerCase().includes('admin') ? 'admin' : 'uye');
              const streak = (c as {streak?: number, name?: string}).streak || (i % 2 === 0 ? 5 : undefined); // demo
              const likes = (c as {likes?: number}).likes ?? 0;
              const dislikes = (c as {dislikes?: number}).dislikes ?? 0;
              // session ve session.user kontrolü
              const isLoggedIn = !!session && !!session.user;
              const handleLike = async () => {
                if (!isLoggedIn) return;
                await fetch(`/api/mangalar/${slug}/yorumlar`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bolum_no,
                    action: 'like',
                    commentIndex: i,
                    user: session!.user!.email
                  })
                });
                reloadComments();
              };
              const handleDislike = async () => {
                if (!isLoggedIn) return;
                await fetch(`/api/mangalar/${slug}/yorumlar`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bolum_no,
                    action: 'dislike',
                    commentIndex: i,
                    user: session!.user!.email
                  })
                });
                reloadComments();
              };
              const handleReply = async (e: React.FormEvent<HTMLFormElement>, commentIndex: number) => {
                e.preventDefault();
                if (!isLoggedIn || !replyText.trim()) return;
                await fetch(`/api/mangalar/${slug}/yorumlar`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bolum_no,
                    action: 'reply',
                    commentIndex,
                    user: session!.user!.email,
                    reply: {
                      name: session!.user!.name || 'Anonim',
                      text: replyText.trim(),
                    }
                  })
                });
                setReplyText("");
                setShowReplyForm(null);
                reloadComments();
              };
              // Yorumları yeniden yükle fonksiyonu
              const reloadComments = () => {
                let url = `/api/mangalar/${slug}/yorumlar?bolum_no=${bolum_no}`;
                if (session) {
                  const userQ = encodeURIComponent(session.user?.email || session.user?.name || "user");
                  url += `&user=${userQ}`;
                }
                fetch(url)
                  .then(async r => {
                    if (!r.ok) {
                      const text = await r.text();
                      throw new Error(text || `API Hatası: ${r.status}`);
                    }
                    return r.json();
                  })
                  .then(data => {
                    if (data.comments) setComments(data.comments);
                    if (data.emojiCounts) setEmojiCounts(data.emojiCounts);
                    if (data.selectedEmoji !== undefined) setSelectedEmoji(data.selectedEmoji);
                    setError("");
                  })
                  .catch(e => setError("Yorumlar yüklenemedi: " + (e.message || "Bilinmeyen hata")));
              };
              return (
                <div key={i} style={commentCardStyle}>
                  {/* Avatar */}
                  <div style={avatarStyle}>
                    {avatar && avatar !== '/default-avatar.png' ? (
                      <img src={avatar} alt={c.name} style={{width:40,height:40,objectFit:'cover'}} />
                    ) : (
                      (c.name?.[0] || '?').toUpperCase()
                    )}
                  </div>
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:2}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontWeight:700,color:'#fff',fontSize:18}}>{c.name||'Anonim'}</span>
                      {/* Rol rozeti */}
                      {role === 'admin' && <span style={{background:'#e63946',color:'#fff',borderRadius:6,padding:'2px 8px',fontSize:12,fontWeight:700}}>Admin</span>}
                      {role === 'uye' && <span style={{background:'#00c3ff',color:'#fff',borderRadius:6,padding:'2px 8px',fontSize:12,fontWeight:700}}>Üye</span>}
                      {/* Günlük giriş rozeti */}
                      {streak && <span style={{background:'#ffb703',color:'#23232b',borderRadius:6,padding:'2px 8px',fontSize:12,fontWeight:700,display:'flex',alignItems:'center',gap:4}}>🔥 {streak} gün</span>}
                      <span style={{color:'#b3b3b3',fontSize:13,marginLeft:8}}>{timeAgo(c.date)}</span>
                    </div>
                    <div style={{color:'#fff',fontSize:'1.08rem',margin:'8px 0'}}>{c.text}</div>
                    <div style={{display:'flex',alignItems:'center',gap:16,marginTop:4}}>
                      <button style={{background:'none',border:'none',color:'#00c3ff',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:4}} onClick={handleLike} title="Beğen"><span>👍</span> <span>{Array.isArray(c.likes) ? c.likes.length : 0}</span></button>
                      <button style={{background:'none',border:'none',color:'#e63946',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:4}} onClick={handleDislike} title="Beğenme"><span>👎</span> <span>{Array.isArray(c.dislikes) ? c.dislikes.length : 0}</span></button>
                      <button style={{background:'none',border:'none',color:'#b3b3b3',fontWeight:700,cursor:'pointer'}} onClick={()=>setShowReplyForm(showReplyForm===i?null:i)} title="Yanıtla">Yanıtla</button>
                      <button style={{background:'none',border:'none',color:'#b3b3b3',fontWeight:700,cursor:'pointer'}} title="Bildir">...</button>
                      {/* Sil butonu: sadece yorumu yazan kullanıcıya */}
                      {isLoggedIn && session!.user!.email === c.user && (
                        <button style={{background:'none',border:'none',color:'#e63946',fontWeight:700,cursor:'pointer'}}
                          onClick={async ()=>{
                            await fetch(`/api/mangalar/${slug}/yorumlar`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                bolum_no,
                                action: 'delete',
                                commentIndex: i,
                                user: session!.user!.email
                              })
                            });
                            // Yorumları yeniden yükle
                            let url = `/api/mangalar/${slug}/yorumlar?bolum_no=${bolum_no}`;
                            if (session) {
                              const userQ = encodeURIComponent(session.user?.email || session.user?.name || "user");
                              url += `&user=${userQ}`;
                            }
                            fetch(url)
                              .then(async r => {
                                if (!r.ok) {
                                  const text = await r.text();
                                  throw new Error(text || `API Hatası: ${r.status}`);
                                }
                                return r.json();
                              })
                              .then(data => {
                                if (data.comments) setComments(data.comments);
                                if (data.emojiCounts) setEmojiCounts(data.emojiCounts);
                                if (data.selectedEmoji !== undefined) setSelectedEmoji(data.selectedEmoji);
                                setError("");
                              })
                              .catch(e => setError("Yorumlar yüklenemedi: " + (e.message || "Bilinmeyen hata")));
                          }}
                          title="Yorumu Sil"
                        >Sil</button>
                      )}
                    </div>
                    {/* Yanıt formu */}
                    {showReplyForm===i && (
                      <form onSubmit={e=>handleReply(e, i)} style={{marginTop:8,display:'flex',gap:8,alignItems:'center'}}>
                        <input type="text" value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Yanıtınızı yazın..." style={{flex:1,padding:'8px',borderRadius:6,border:'1.5px solid #23232b',background:'#18181b',color:'#fff'}} />
                        <button type="submit" style={{background:'#00c3ff',color:'#fff',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:700,cursor:'pointer'}}>Gönder</button>
                        <button type="button" onClick={()=>setShowReplyForm(null)} style={{background:'#e63946',color:'#fff',border:'none',borderRadius:6,padding:'8px 12px',fontWeight:700,cursor:'pointer'}}>İptal</button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 