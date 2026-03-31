'use client';

import { motion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

export default function Testimonials() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const testimonials = [
    {
      name: 'Ahmed Hassan',
      role: 'Business Owner',
      image: 'https://picsum.photos/seed/ahmed/100/100',
      content: 'Gresco Tires provided exceptional service. The team was professional, and the tire fitting was incredibly fast. Highly recommended for anyone in Cairo.',
      rating: 5,
    },
    {
      name: 'Mona El-Sayed',
      role: 'Daily Commuter',
      image: 'https://picsum.photos/seed/mona/100/100',
      content: 'I was unsure which tires to get for my SUV, but their experts guided me perfectly. The prices are competitive, and the quality is unmatched.',
      rating: 5,
    },
    {
      name: 'Karim Youssef',
      role: 'Fleet Manager',
      image: 'https://picsum.photos/seed/karim/100/100',
      content: 'We rely on Gresco for our entire company fleet. Their commercial tires are durable, and their maintenance service keeps our vehicles on the road.',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">Client Stories</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What Our Customers Say
          </h3>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 pl-4 pr-4">
                  <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-slate-100 relative">
                    <Quote className="absolute top-8 right-8 text-slate-100 rotate-180" size={80} />
                    
                    <div className="flex gap-1 mb-6 relative z-10">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="fill-accent text-accent" size={20} />
                      ))}
                    </div>
                    
                    <p className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 relative z-10 italic">
                      &quot;{testimonial.content}&quot;
                    </p>
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                        <span className="text-sm text-slate-500">{testimonial.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
