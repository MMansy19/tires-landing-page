'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  const features = [
    'Over 20 years of industry experience',
    'Authorized dealer for premium global brands',
    'State-of-the-art installation equipment',
    'Dedicated customer support team',
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="https://picsum.photos/seed/mechanic/600/800" alt="Mechanic" fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="https://picsum.photos/seed/tireshop/600/600" alt="Tire Shop" fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="https://picsum.photos/seed/driving/600/600" alt="Driving" fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="https://picsum.photos/seed/wheel/600/800" alt="Wheel" fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
            
            {/* Experience Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white p-6 rounded-full shadow-2xl border-4 border-white flex flex-col items-center justify-center w-40 h-40 z-10">
              <span className="text-4xl font-black text-accent">20+</span>
              <span className="text-sm font-medium text-center leading-tight mt-1">Years of<br/>Excellence</span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">About Gresco Tires</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Setting the Standard for Tire Excellence in Egypt
            </h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              At Gresco Tires, we believe that safety and performance start where the rubber meets the road. Since our inception, we have been committed to providing Egyptian drivers with the highest quality tires and unparalleled automotive services.
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
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden relative">
                    <Image src={`https://picsum.photos/seed/user${i}/100/100`} alt="Customer" fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div>
                <div className="font-bold text-xl text-slate-900">10k+</div>
                <div className="text-sm text-slate-500 font-medium">Happy Customers</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
