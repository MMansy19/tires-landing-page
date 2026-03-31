import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/landing/Hero';
import Brands from '@/components/landing/Brands';
import About from '@/components/landing/About';
import Services from '@/components/landing/Services';
import Products from '@/components/landing/Products';
import Testimonials from '@/components/landing/Testimonials';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/shared/Footer';
import FloatingWhatsApp from '@/components/shared/FloatingWhatsApp';
import { getBrands } from '@/services/brands';

export default async function Home() {
  const brands = await getBrands();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Brands brands={brands} />
      <About />
      <Services />
      <Products />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
