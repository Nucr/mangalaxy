"use client";
import AdminSidebar from "../AdminSidebar";
export default function AdminAyarlar() {
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
        <p>Bu sayfa yakında! Buradan site ayarlarını yönetebileceksin.</p>
      </main>
    </div>
  );
} 