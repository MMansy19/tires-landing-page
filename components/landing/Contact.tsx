'use client';

import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Contact() {
  const t = useTranslations('contact');

  return (
    <section id="contact" className="relative py-12 md:py-24 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/dirt-w-tires.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">{t('subtitle')}</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              {t('title')}
            </h3>
            <p className="text-lg text-slate-600 mb-10">
              {t('description')}
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-accent shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t('locationTitle')}</h4>
                  <p className="text-slate-600">{t('locationValue').split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                  ))}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-accent shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t('phoneTitle')}</h4>
                  <p className="text-slate-600" dir="ltr">{t('phoneValue').split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                  ))}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-accent shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t('emailTitle')}</h4>
                  <p className="text-slate-600" dir="ltr">{t('emailValue').split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                  ))}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-accent shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t('hoursTitle')}</h4>
                  <p className="text-slate-600">{t('hoursValue').split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                  ))}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-slate-50 p-6 md:p-10 rounded-3xl border border-slate-100"
          >
            <h4 className="text-2xl font-bold text-slate-900 mb-6">{t('formTitle')}</h4>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('firstName')}</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-white" placeholder={t('firstNamePlaceholder')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('lastName')}</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-white" placeholder={t('lastNamePlaceholder')} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('email')}</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-white" placeholder={t('emailPlaceholder')} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('phone')}</label>
                <input type="tel" dir="ltr" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-white text-left" placeholder={t('phonePlaceholder')} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('message')}</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-white resize-none" placeholder={t('messagePlaceholder')}></textarea>
              </div>

              <button type="submit" className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl transition-colors">
                {t('send')}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
