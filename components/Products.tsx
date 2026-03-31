'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Products() {
  const categories = [
    {
      name: 'Passenger Cars',
      image: 'https://picsum.photos/seed/sedan/800/600',
      description: 'Comfort and performance for daily commuting.',
    },
    {
      name: 'SUVs & 4x4',
      image: 'https://picsum.photos/seed/suv/800/600',
      description: 'Durability and traction for off-road adventures.',
    },
    {
      name: 'Commercial Vehicles',
      image: 'https://picsum.photos/seed/truck/800/600',
      description: 'Heavy-duty tires for maximum load capacity.',
    },
  ];

  return (
    <section id="products" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">Premium Selection</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Tires for Every Journey
            </h3>
            <p className="text-lg text-slate-600">
              Explore our extensive catalog of tires designed to meet the specific demands of your vehicle and driving style.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors group">
            View All Products
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h4 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{category.name}</h4>
                <p className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 mb-6">
                  {category.description}
                </p>
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <ArrowRight size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
