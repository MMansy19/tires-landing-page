'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('about');

  const features = [
    t('feature1'),
    t('feature2'),
    t('feature3'),
    t('feature4'),
  ];

  return (
    <section id="about" className="py-12 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <div className="relative h-40 sm:h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="/dirt-w-tires.jpg" alt="ميكانيكي" fill className="object-cover" sizes="(min-width: 1024px) 300px, 50vw" />
                </div>
                <div className="relative h-32 sm:h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="/200706_trucktires-__-720x516-s.jpg" alt="إطارات شاحنات" fill className="object-cover" sizes="(min-width: 1024px) 300px, 50vw" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-32 sm:h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="/wepik-2021617-105742.jpg" alt="خدمة الإطارات" fill className="object-cover" sizes="(min-width: 1024px) 300px, 50vw" />
                </div>
                <div className="relative h-40 sm:h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="/special.jpg" alt="الموانئ والنقل" fill className="object-cover" sizes="(min-width: 1024px) 300px, 50vw" />
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white p-4 sm:p-6 rounded-full shadow-2xl border-4 border-white flex flex-col items-center justify-center w-28 h-28 sm:w-40 sm:h-40 z-10">
              <span className="text-2xl sm:text-4xl font-black text-accent">{t('yearsCount')}</span>
              <span className="text-sm font-medium text-center leading-tight mt-1">{t('yearsLabel').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br/>}</span>
              ))}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">{t('subtitle')}</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t('title')}
            </h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {t('description')}
            </p>

            <ul className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="text-accent shrink-0 mt-1" size={24} />
                  <span className="text-slate-700 font-medium text-lg">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-4 -space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden relative">
                    <Image src={`https://picsum.photos/seed/user${i}/100/100`} alt="عميل" fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div>
                <div className="font-bold text-xl text-slate-900">{t('customersCount')}</div>
                <div className="text-sm text-slate-500 font-medium">{t('customersLabel')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
