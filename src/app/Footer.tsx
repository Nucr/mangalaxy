import Link from "next/link";
import styles from "./page.module.css";

export default function Footer() {
  return (
    <footer className={styles.fullFooter}>
      <div className={styles.footerContent}>
        <div style={{ textAlign: 'center', marginBottom: '2.5em' }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: '2.2rem', color: 'var(--primary)', margin: 0 }}>Mangalaxy</h2>
          <p style={{ color: 'var(--secondary)', fontSize: '1.1rem', marginTop: '0.7em', marginBottom: 0 }}>
            Mangalaxy, en iyi manga, webtoon, novel ve anime içeriklerini sunan bir okuma platformudur. İstediğiniz zaman, istediğiniz yerden favori serilerinizi okuyun.
          </p>
        </div>
        <div className={styles.footerColumns}>
          <div>
            <div className={styles.footerColTitle}>İçerikler</div>
            <Link href="/seriler" className={styles.footerLink}>Manga</Link>
            <a href="#" className={styles.footerLink}>Webtoon</a>
            <a href="#" className={styles.footerLink}>Novel</a>
            <a href="/populer" className={styles.footerLink}>Popüler İçerikler</a>
            <a href="/son-eklenenler" className={styles.footerLink}>Son Eklenenler</a>
          </div>
          <div>
            <div className={styles.footerColTitle}>Kategoriler</div>
            <a href="/kategori/aksiyon" className={styles.footerLink}>Aksiyon</a>
            <a href="/kategori/bilim-kurgu" className={styles.footerLink}>Bilim Kurgu</a>
            <a href="/kategori/canavar" className={styles.footerLink}>Canavar</a>
            <a href="/kategori/dahi-mc" className={styles.footerLink}>Dahi Mc</a>
            <a href="/kategori/dogaustu" className={styles.footerLink}>Doğaüstü</a>
            <a href="/kategori/dovus-sanatlari" className={styles.footerLink}>Dövüş Sanatları</a>
            <a href="/kategoriler" className={styles.footerLink}>Tüm Kategoriler</a>
          </div>
          <div>
            <div className={styles.footerColTitle}>Hızlı Bağlantılar</div>
            <a href="/hakkimizda" className={styles.footerLink}>Hakkımızda</a>
            <a href="/iletisim" className={styles.footerLink}>İletişim</a>
            <a href="/sss" className={styles.footerLink}>Sık Sorulan Sorular</a>
            <a href="/gizlilik" className={styles.footerLink}>Gizlilik Politikası</a>
            <a href="/kullanim-sartlari" className={styles.footerLink}>Kullanım Şartları</a>
            <a href="/dmca" className={styles.footerLink}>DMCA</a>
          </div>
          <div>
            <div className={styles.footerColTitle}>Hesap</div>
            <Link href="/giris" className={styles.footerLink}>Giriş Yap</Link>
            <Link href="/kayit" className={styles.footerLink}>Kayıt Ol</Link>
            <a href="/sifremi-unuttum" className={styles.footerLink}>Şifremi Unuttum</a>
          </div>
        </div>
        <div style={{ width: '100%', borderTop: '1px solid #23304a', color: '#7a8599', fontSize: '0.95rem', textAlign: 'center', padding: '8px 0 4px 0', marginTop: '2.5em', letterSpacing: '0.01em', background: 'transparent', opacity: 0.85 }}>
          © {new Date().getFullYear()} Mangalaxy. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
} 