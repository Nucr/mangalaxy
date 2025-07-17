"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import React from "react";

export default function Kayit() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!username || !email || !password || !password2) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }
    if (password !== password2) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      setLoading(false);
      if (res.status === 201) {
        setSuccess("Başarıyla kayıt olundu!");
      } else {
        setError(data.error || "Kayıt başarısız");
      }
    } catch (err) {
      setLoading(false);
      setError("Sunucu hatası, lütfen tekrar deneyin.");
    }
  };

  // Kayıt başarılıysa girişe yönlendir
  React.useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.push("/giris");
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [success, router]);

  const handleSocial = (type: string) => {
    setError("");
    setSuccess("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (type === "google") setSuccess("Google ile kayıt başarılı! (Demo)");
      else if (type === "github") setSuccess("GitHub ile kayıt başarılı! (Demo)");
      else if (type === "facebook") setError("Facebook ile kayıt başarısız! (Demo)");
    }, 1000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.authPage}>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.modernIconWrapper}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#23232b"/>
              <circle cx="32" cy="28" r="13" fill="#00c3ff"/>
              <ellipse cx="32" cy="50" rx="16" ry="8" fill="#ff2d55"/>
            </svg>
          </div>
          <h2 className={styles.title} style={{marginBottom:18}}>Kayıt Ol</h2>
          <div className={styles.socialBtns}>
            <button type="button" className={`${styles.socialBtn} ${styles.google}`} onClick={() => handleSocial("google")} disabled={loading}>
              <span>🔴</span> Google ile Kayıt Ol
            </button>
            <button type="button" className={`${styles.socialBtn} ${styles.github}`} onClick={() => handleSocial("github")} disabled={loading}>
              <span>🐙</span> GitHub ile Kayıt Ol
            </button>
            <button type="button" className={`${styles.socialBtn} ${styles.facebook}`} onClick={() => handleSocial("facebook")} disabled={loading}>
              <span>📘</span> Facebook ile Kayıt Ol
            </button>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles.input}
              autoComplete="username"
              placeholder="Kullanıcı adı"
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              autoComplete="email"
              placeholder="E-posta adresi"
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Şifre</label>
            <div className={styles.inputWithIcon}>
              <span className={styles.inputIcon} aria-hidden="true">🔒</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={styles.input}
                autoComplete="new-password"
                placeholder="Şifreniz"
                disabled={loading}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password2">Şifre Tekrar</label>
            <div className={styles.inputWithIcon}>
              <span className={styles.inputIcon} aria-hidden="true">🔑</span>
              <input
                id="password2"
                type="password"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
                className={styles.input}
                autoComplete="new-password"
                placeholder="Şifrenizi tekrar girin"
                disabled={loading}
              />
            </div>
          </div>
          {error && <div className={styles.errorMsg}>{error}</div>}
          {success && <div className={styles.successMsg}>{success}</div>}
          <button type="submit" className={styles.registerBtn} disabled={loading}>{loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}</button>
          <div style={{marginTop:18, textAlign:'center', fontSize:'1rem'}}>
            Zaten hesabın var mı?
            <Link href="/giris" className={styles.loginBtn} style={{marginTop:8, display:'block', width:'100%'}}>Giriş Yap</Link>
          </div>
        </form>
      </div>
    </div>
  );
} 