import React from 'react';
import Image from 'next/image';

export default function AnnouncementBoard() {
  return (
    <div className="card p-6 mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Duyurular</h2>
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Image
              src="/images/announcement-icon.png"
              alt="Duyuru"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Yeni Özellikler Eklendi!</h3>
            <p className="text-gray-400">Manga okuma deneyiminizi geliştirmek için yeni özellikler ekledik.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Image
              src="/images/announcement-icon.png"
              alt="Duyuru"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Bakım Çalışması</h3>
            <p className="text-gray-400">Sistemlerimizde bakım çalışması yapılacaktır.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 