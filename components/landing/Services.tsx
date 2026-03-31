'use client';

import { motion } from 'motion/react';
import { Wrench, Gauge, Disc, Car, Zap, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Services() {
  const t = useTranslations('services');

  const services = [
    {
      icon: <Wrench size={40} />,
      title: t('tireFitting'),
      description: t('tireFittingDesc'),
    },
    {
      icon: <Gauge size={40} />,
      title: t('wheelAlignment'),
      description: t('wheelAlignmentDesc'),
    },
    {
      icon: <Disc size={40} />,
      title: t('brakeServices'),
      description: t('brakeServicesDesc'),
    },
    {
      icon: <Car size={40} />,
      title: t('suspensionCheck'),
      description: t('suspensionCheckDesc'),
    },
    {
      icon: <Zap size={40} />,
      title: t('batteryReplacement'),
      description: t('batteryReplacementDesc'),
    },
    {
      icon: <ShieldCheck size={40} />,
      title: t('nitrogenInflation'),
      description: t('nitrogenInflationDesc'),
    },
  ];

  return (
    <section id="services" className="relative py-12 md:py-24 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/special.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-50/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">{t('subtitle')}</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            {t('title')}
          </h3>
          <p className="text-lg text-slate-600">
            {t('description')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors duration-300 mb-6">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
