'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function Brands() {
  const brands = [
    { name: 'Michelin', logo: 'https://picsum.photos/seed/michelin/200/100' },
    { name: 'Bridgestone', logo: 'https://picsum.photos/seed/bridgestone/200/100' },
    { name: 'Continental', logo: 'https://picsum.photos/seed/continental/200/100' },
    { name: 'Pirelli', logo: 'https://picsum.photos/seed/pirelli/200/100' },
    { name: 'Goodyear', logo: 'https://picsum.photos/seed/goodyear/200/100' },
    { name: 'Hankook', logo: 'https://picsum.photos/seed/hankook/200/100' },
  ];

  return (
    <section className="py-20 bg-slate-900 border-y border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h3 className="text-slate-400 font-medium tracking-widest uppercase text-sm">Trusted Partners & Official Distributor</h3>
      </div>
      
      {/* Marquee Animation */}
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-8">
          {brands.map((brand, index) => (
            <div key={index} className="relative w-40 h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {brands.map((brand, index) => (
            <div key={`dup-${index}`} className="relative w-40 h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
