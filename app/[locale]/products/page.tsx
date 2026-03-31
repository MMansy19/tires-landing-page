import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import FloatingWhatsApp from '@/components/shared/FloatingWhatsApp';
import Pagination from '@/components/shared/Pagination';
import { Container } from '@/components/ui/container';
import { getProducts, getCategories } from '@/services/products';
import { getBrands } from '@/services/brands';
import { formatPrice } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('productsPage');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    category?: string;
    brand_id?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const t = await getTranslations('productsPage');
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category || '';
  const brand_id = params.brand_id || '';
  const search = params.search || '';

  const [productsResult, categories, brands] = await Promise.all([
    getProducts({ page, category, brand_id, search }),
    getCategories(),
    getBrands(),
  ]);

  const currentParams: Record<string, string> = {};
  if (category) currentParams.category = category;
  if (brand_id) currentParams.brand_id = brand_id;
  if (search) currentParams.search = search;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-primary pb-10">
        <Navbar />
        <div className="pt-24 sm:pt-32 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">{t('title')}</h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>
      </div>

      <Container className="flex-grow py-8 md:py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 mb-8">
          <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" size={20} />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder={t('searchPlaceholder')}
                className="w-full ps-10 pe-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-white"
              />
            </div>

            <select
              name="category"
              defaultValue={category}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-white"
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              name="brand_id"
              defaultValue={brand_id}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-white"
            >
              <option value="">{t('allBrands')}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              {t('search')}
            </button>
          </form>
        </div>

        {/* Results */}
        {productsResult.data.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-xl">{t('noProducts')}</p>
            <p className="mt-2 text-sm">{t('changeFilters')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsResult.data.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-48 sm:h-56 bg-slate-100">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-6xl font-bold">
                        🛞
                      </div>
                    )}
                    {product.brands && (
                      <span className="absolute top-3 start-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full text-slate-700">
                        {product.brands.name}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-accent">{product.category}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2 line-clamp-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{product.description}</p>
                    )}
                    {product.price && (
                      <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={productsResult.page}
              totalPages={productsResult.total_pages}
              basePath="/products"
              searchParams={currentParams}
            />
          </>
        )}
      </Container>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
