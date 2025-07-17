import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside style={{
      minWidth: 200,
      background: "rgba(20,20,30,0.92)",
      borderRadius: 16,
      boxShadow: "0 2px 12px #0005",
      padding: "32px 0 32px 0",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      height: "100%",
      marginRight: 32
    }}>
      <Link href="/admin" style={{
        color: pathname === "/admin" ? "#fff" : "#00c3ff",
        fontWeight: 700,
        fontSize: "1.1rem",
        padding: "12px 32px",
        textDecoration: "none",
        background: pathname === "/admin" ? "#00c3ff" : "transparent",
        borderRadius: 10,
        transition: 'background 0.18s, color 0.18s',
      }}>Dashboard</Link>
      <Link href="/admin/kullanicilar" style={{
        color: pathname.startsWith("/admin/kullanicilar") ? "#fff" : "#fff",
        fontWeight: 600,
        fontSize: "1.05rem",
        padding: "12px 32px",
        textDecoration: "none",
        background: pathname.startsWith("/admin/kullanicilar") ? "#00c3ff" : "transparent",
        borderRadius: 10,
        transition: 'background 0.18s, color 0.18s',
      }}>Kullanıcılar</Link>
      <Link href="/admin/mangalar" style={{
        color: pathname.startsWith("/admin/mangalar") ? "#fff" : "#fff",
        fontWeight: 600,
        fontSize: "1.05rem",
        padding: "12px 32px",
        textDecoration: "none",
        background: pathname.startsWith("/admin/mangalar") ? "#00c3ff" : "transparent",
        borderRadius: 10,
        transition: 'background 0.18s, color 0.18s',
      }}>Mangalar</Link>
      <Link href="/admin/istatistikler" style={{
        color: pathname.startsWith("/admin/istatistikler") ? "#fff" : "#fff",
        fontWeight: 600,
        fontSize: "1.05rem",
        padding: "12px 32px",
        textDecoration: "none",
        background: pathname.startsWith("/admin/istatistikler") ? "#00c3ff" : "transparent",
        borderRadius: 10,
        transition: 'background 0.18s, color 0.18s',
      }}>İstatistikler</Link>
      <Link href="/admin/ayarlar" style={{
        color: pathname.startsWith("/admin/ayarlar") ? "#fff" : "#fff",
        fontWeight: 600,
        fontSize: "1.05rem",
        padding: "12px 32px",
        textDecoration: "none",
        background: pathname.startsWith("/admin/ayarlar") ? "#00c3ff" : "transparent",
        borderRadius: 10,
        transition: 'background 0.18s, color 0.18s',
      }}>Ayarlar</Link>
    </aside>
  );
} 