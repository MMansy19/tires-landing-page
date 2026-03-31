'use client';

import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Timer, Wrench } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 md:pt-20 md:pb-0 overflow-hidden bg-primary">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/special.jpg"
          alt="إطارات عالية الجودة"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Gradient overlay - darker on text side, slightly lighter on right */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/40 to-black/70" />
        {/* Subtle accent color tint at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {t('badge')}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              {t('titleLine1')} <br/>
              <span className="text-accent">{t('titleLine2')}</span> {t('titleAnd')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{t('titleLine3')}</span>
            </h1>

            <div className="w-20 h-1 bg-accent mb-6" />

            <p className="text-base md:text-xl text-slate-200 mb-8 max-w-lg leading-relaxed">
              {t('description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#products" className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg shadow-accent/30">
                {t('exploreProducts')}
                <ArrowLeft size={20} />
              </a>
              <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all backdrop-blur-sm">
                {t('getQuote')}
              </a>
            </div>

            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:pt-8">
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <ShieldCheck className="text-accent shrink-0" size={28} />
                <div>
                  <span className="text-white font-medium">{t('genuine')}</span>
                  <span className="text-slate-400 text-sm block">{t('genuineDesc')}</span>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <Wrench className="text-accent shrink-0" size={28} />
                <div>
                  <span className="text-white font-medium">{t('expertFitting')}</span>
                  <span className="text-slate-400 text-sm block">{t('expertFittingDesc')}</span>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <Timer className="text-accent shrink-0" size={28} />
                <div>
                  <span className="text-white font-medium">{t('fastService')}</span>
                  <span className="text-slate-400 text-sm block">{t('fastServiceDesc')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src="/job-confident-corporate-wheels-new.jpg"
                alt="إطارات تريد"
                fill
                className="object-contain drop-shadow-[0_0_40px_rgba(255,107,0,0.15)]"
                sizes="(min-width: 1024px) 450px, 0px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
