'use client';

import { motion } from 'motion/react';
import { Wrench, Gauge, Disc, Car, Zap, ShieldCheck } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Wrench size={40} />,
      title: 'Tire Fitting & Balancing',
      description: 'Precision fitting and dynamic balancing for a smooth, vibration-free ride.',
    },
    {
      icon: <Gauge size={40} />,
      title: 'Wheel Alignment',
      description: 'Advanced 3D alignment to ensure even tire wear and optimal handling.',
    },
    {
      icon: <Disc size={40} />,
      title: 'Brake Services',
      description: 'Comprehensive brake inspections and pad replacements for your safety.',
    },
    {
      icon: <Car size={40} />,
      title: 'Suspension Check',
      description: 'Thorough inspection of shocks and struts to maintain vehicle stability.',
    },
    {
      icon: <Zap size={40} />,
      title: 'Battery Replacement',
      description: 'Quick diagnostics and replacement with premium battery brands.',
    },
    {
      icon: <ShieldCheck size={40} />,
      title: 'Nitrogen Inflation',
      description: 'Maintain tire pressure longer and improve fuel efficiency with nitrogen.',
    },
  ];

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">Our Expertise</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Comprehensive Auto Services
          </h3>
          <p className="text-lg text-slate-600">
            Beyond premium tires, we offer a full suite of automotive services to keep your vehicle running safely and efficiently on Egyptian roads.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors duration-300 mb-6">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
