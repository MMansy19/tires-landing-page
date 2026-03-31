import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import FloatingWhatsApp from '@/components/shared/FloatingWhatsApp';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { getProductBySlug, getProductImages } from '@/services/products';
import { formatPrice, formatDate } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const t = await getTranslations('productsPage');

  if (!product) return { title: t('notFound') };

  return {
    title: product.name,
    description: product.description || `${product.name} - إطارات عالية الجودة من جريسكو تايرز`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const t = await getTranslations('productsPage');
  const images = await getProductImages(product.id);
  const allImages = product.image_url
    ? [{ id: 'main', image_url: product.image_url, product_id: product.id, sort_order: -1, created_at: '' }, ...images]
    : images;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-primary pb-10">
        <Navbar />
      </div>

      <Container className="flex-grow py-8 md:py-12">
        <Link href="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent transition-colors mb-6 md:mb-8 font-medium">
          <ArrowRight size={20} />
          {t('backToProducts')}
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm">
              {allImages.length > 0 ? (
                <Image
                  src={allImages[0].image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-9xl">
                  🛞
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.slice(1, 5).map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-white border border-slate-100">
                    <Image src={img.image_url} alt={product.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge>{product.category}</Badge>
              {product.brands && <Badge variant="success">{product.brands.name}</Badge>}
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4">{product.name}</h1>

            {product.price && (
              <p className="text-2xl md:text-3xl font-bold text-accent mb-6">{formatPrice(product.price)}</p>
            )}

            {product.description && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-3">{t('descriptionLabel')}</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
              <h3 className="font-bold text-slate-900 mb-4">{t('additionalInfo')}</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t('category')}</dt>
                  <dd className="font-medium text-slate-900">{product.category}</dd>
                </div>
                {product.brands && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">{t('brand')}</dt>
                    <dd className="font-medium text-slate-900">{product.brands.name}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t('dateAdded')}</dt>
                  <dd className="font-medium text-slate-900">{formatDate(product.created_at)}</dd>
                </div>
              </dl>
            </div>

            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              {t('orderNow')}
            </a>
          </div>
        </div>
      </Container>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
