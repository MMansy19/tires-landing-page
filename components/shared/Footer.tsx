'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 md:pt-20 pb-8 md:pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="font-black text-2xl tracking-tighter text-white">
                {t('brandName')}
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed">
              {t('brandDescription')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-accent hover:text-white transition-colors" aria-label="فيسبوك">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-accent hover:text-white transition-colors" aria-label="إنستغرام">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-accent hover:text-white transition-colors" aria-label="تويتر">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-4">
              <li><Link href={`/${locale}`} className="hover:text-accent transition-colors">{tNav('home')}</Link></li>
              <li><Link href="/#about" className="hover:text-accent transition-colors">{tNav('about')}</Link></li>
              <li><Link href="/#services" className="hover:text-accent transition-colors">{tNav('services')}</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-accent transition-colors">{tNav('products')}</Link></li>
              <li><Link href={`/${locale}/blog`} className="hover:text-accent transition-colors">{tNav('blog')}</Link></li>
              <li><Link href="/#contact" className="hover:text-accent transition-colors">{tNav('contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('ourServices')}</h4>
            <ul className="space-y-4">
              <li><span className="hover:text-accent transition-colors cursor-default">{t('tireFitting')}</span></li>
              <li><span className="hover:text-accent transition-colors cursor-default">{t('wheelAlignment')}</span></li>
              <li><span className="hover:text-accent transition-colors cursor-default">{t('brakeService')}</span></li>
              <li><span className="hover:text-accent transition-colors cursor-default">{t('batteries')}</span></li>
              <li><span className="hover:text-accent transition-colors cursor-default">{t('nitrogen')}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('contactUs')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-accent shrink-0 mt-1" size={20} />
                <span>{t('address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-accent shrink-0" size={20} />
                <span dir="ltr">+20 10 0000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-accent shrink-0" size={20} />
                <span>info@grescotires.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} {t('rights')}
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
