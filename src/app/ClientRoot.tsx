"use client";
import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      {children}
      <Footer />
    </SessionProvider>
  );
} 