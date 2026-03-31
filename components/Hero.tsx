'use client';

import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Timer, Wrench } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/tires/1920/1080"
          alt="Premium Tires Background"
          fill
          className="object-cover opacity-30"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
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
              Egypt&apos;s Leading Tire Distributor
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              Drive with <br/>
              <span className="text-accent">Confidence</span> & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Safety</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
              Premium tires from world-renowned brands, expert installation, and unparalleled service for all vehicle types.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#products" className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-accent/30">
                Explore Products
                <ArrowRight size={20} />
              </a>
              <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-lg transition-all backdrop-blur-sm">
                Get a Quote
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div className="flex flex-col gap-2">
                <ShieldCheck className="text-accent" size={28} />
                <span className="text-white font-medium">100% Genuine</span>
                <span className="text-slate-400 text-sm">Official Dealer</span>
              </div>
              <div className="flex flex-col gap-2">
                <Wrench className="text-accent" size={28} />
                <span className="text-white font-medium">Expert Fitting</span>
                <span className="text-slate-400 text-sm">Pro Technicians</span>
              </div>
              <div className="flex flex-col gap-2">
                <Timer className="text-accent" size={28} />
                <span className="text-white font-medium">Fast Service</span>
                <span className="text-slate-400 text-sm">Quick Turnaround</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side Visual (Optional, can be a floating tire image) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative h-[600px]"
          >
            <Image
              src="https://picsum.photos/seed/tire-product/800/800"
              alt="Premium Tire"
              fill
              className="object-contain drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
