'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

export default function FloatingWhatsApp() {
  const t = useTranslations('whatsapp');

  return (
    <motion.a
      href="https://wa.me/201000000000"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 start-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      aria-label="تواصل معنا عبر واتساب"
    >
      <MessageCircle size={32} className="fill-current" />
      <span className="absolute start-full ms-4 bg-white text-slate-800 text-sm font-medium px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        {t('tooltip')}
      </span>
    </motion.a>
  );
}
