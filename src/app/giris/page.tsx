"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Giris() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.ok && !res.error) {
      setSuccess("Başarıyla giriş yapıldı!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      setError("E-posta veya şifre hatalı.");
    }
  };

  const handleSocial = (type: string) => {
    setError("");
    setSuccess("");
    setLoading(true);
    signIn(type);
    setLoading(false);
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
          <h2 className={styles.title} style={{marginBottom:18}}>Giriş Yap</h2>
          <div className={styles.socialBtns}>
            <button type="button" className={`${styles.socialBtn} ${styles.google}`} onClick={() => handleSocial("google")} disabled={loading}>
              <span>🔴</span> Google ile Giriş
            </button>
            <button type="button" className={`${styles.socialBtn} ${styles.github}`} onClick={() => handleSocial("github")} disabled={loading}>
              <span>🐙</span> GitHub ile Giriş
            </button>
            <button type="button" className={`${styles.socialBtn} ${styles.facebook}`} onClick={() => handleSocial("facebook")} disabled={loading}>
              <span>📘</span> Facebook ile Giriş
            </button>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">E-posta veya Kullanıcı Adı</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              autoComplete="username"
              placeholder="E-posta veya kullanıcı adı"
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
                autoComplete="current-password"
                placeholder="Şifreniz"
                disabled={loading}
              />
            </div>
          </div>
          {error && <div className={styles.errorMsg}>{error}</div>}
          {success && <div className={styles.successMsg}>{success}</div>}
          <button type="submit" className={styles.loginBtn} disabled={loading}>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</button>
          <div style={{marginTop:18, textAlign:'center', fontSize:'1rem'}}>
            Hesabın yok mu? <Link href="/kayit" className={styles.registerBtn}>Kayıt Ol</Link>
          </div>
        </form>
      </div>
    </div>
  );
} 