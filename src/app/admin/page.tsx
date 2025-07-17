"use client";
import React from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
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
        <h1 style={{
          color: "#00c3ff",
          fontWeight: 800,
          fontSize: "2.2rem",
          marginBottom: 32,
          fontFamily: "Orbitron, Poppins, sans-serif"
        }}>
          Admin Paneli
        </h1>
        <div>
          {/* Buraya özet kutuları, modüller gelecek */}
          <p>Hoş geldin, admin! Buradan kullanıcıları, mangaları ve siteyi yönetebilirsin.</p>
        </div>
      </main>
    </div>
  );
} 