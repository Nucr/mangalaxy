import Link from 'next/link';
import React from 'react';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1019] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-[#1a1b2e] rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white gradient-text">
            Yeni Hesap Oluşturun
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Veya 
            <Link href="/login" className="font-medium text-[#6c5ce7] hover:text-[#a29bfe] ml-1">
              mevcut bir hesapla giriş yapın
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Kullanıcı Adı</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="input-primary relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-[#6c5ce7] focus:border-[#6c5ce7] focus:z-10 sm:text-sm"
                placeholder="Kullanıcı Adı"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">E-posta adresi</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-primary relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white focus:outline-none focus:ring-[#6c5ce7] focus:border-[#6c5ce7] focus:z-10 sm:text-sm"
                placeholder="E-posta adresiniz"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input-primary relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-[#6c5ce7] focus:border-[#6c5ce7] focus:z-10 sm:text-sm"
                placeholder="Şifreniz"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#6c5ce7] hover:bg-[#a29bfe] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6c5ce7] transition-colors duration-200"
            >
              Kayıt Ol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 