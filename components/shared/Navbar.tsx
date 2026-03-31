'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextLink from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, '') || '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/#about' },
    { name: t('services'), href: '/#services' },
    { name: t('products'), href: `/${locale}/products` },
    { name: t('blog'), href: `/${locale}/blog` },
    { name: t('contact'), href: '/#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className={`font-black text-2xl tracking-tighter ${isScrolled ? 'text-primary' : 'text-white'}`}>
              جريسكو<span className="text-accent">تايرز</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isScrolled ? 'text-slate-700' : 'text-slate-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <NextLink
              href={`/${otherLocale}${pathWithoutLocale}`}
              className={`px-3 py-2 rounded-full text-sm font-semibold transition-all backdrop-blur-sm border ${
                isScrolled
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              {t('language')}
            </NextLink>
            <a
              href="tel:+201000000000"
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-full font-medium transition-colors"
            >
              <Phone size={18} />
              <span>{t('callUs')}</span>
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={isScrolled ? 'text-slate-900' : 'text-white'}
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-4 text-base font-medium text-slate-800 hover:bg-slate-50 hover:text-accent border-b border-slate-100"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex gap-3">
              <NextLink
                href={`/${otherLocale}${pathWithoutLocale}`}
                className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-5 py-3 rounded-lg font-semibold text-sm"
              >
                {t('language')}
              </NextLink>
              <a
                href="tel:+201000000000"
                className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-5 py-3 rounded-lg font-medium"
              >
                <Phone size={18} />
                <span>{t('callUs')}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
