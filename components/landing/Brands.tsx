'use client';

import Image from 'next/image';
import type { Brand } from '@/types/database';
import { useTranslations } from 'next-intl';

interface BrandsProps {
  brands: Brand[];
}

export default function Brands({ brands }: BrandsProps) {
  const t = useTranslations('brands');

  const displayBrands = brands.length > 0 ? brands : [
    { id: '1', name: 'ميشلان', logo_url: 'https://picsum.photos/seed/michelin/200/100', created_at: '' },
    { id: '2', name: 'بريدجستون', logo_url: 'https://picsum.photos/seed/bridgestone/200/100', created_at: '' },
    { id: '3', name: 'كونتيننتال', logo_url: 'https://picsum.photos/seed/continental/200/100', created_at: '' },
    { id: '4', name: 'بيريللي', logo_url: 'https://picsum.photos/seed/pirelli/200/100', created_at: '' },
    { id: '5', name: 'جوديير', logo_url: 'https://picsum.photos/seed/goodyear/200/100', created_at: '' },
    { id: '6', name: 'هانكوك', logo_url: 'https://picsum.photos/seed/hankook/200/100', created_at: '' },
  ];

  return (
    <section className="py-10 md:py-20 bg-slate-900 border-y border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-10 text-center">
        <h3 className="text-slate-400 font-medium tracking-widest uppercase text-sm">{t('title')}</h3>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 md:gap-16 px-4 md:px-8">
          {displayBrands.map((brand) => (
            <div key={brand.id} className="relative w-28 h-12 md:w-40 md:h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shrink-0">
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">{brand.name}</div>
              )}
            </div>
          ))}
          {displayBrands.map((brand) => (
            <div key={`dup-${brand.id}`} className="relative w-28 h-12 md:w-40 md:h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shrink-0">
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">{brand.name}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
