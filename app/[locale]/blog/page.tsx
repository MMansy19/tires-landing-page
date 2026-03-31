import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import FloatingWhatsApp from '@/components/shared/FloatingWhatsApp';
import Pagination from '@/components/shared/Pagination';
import { Container } from '@/components/ui/container';
import { getPosts } from '@/services/posts';
import { formatDate } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('blogPage');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export const revalidate = 60;

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const t = await getTranslations('blogPage');
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const postsResult = await getPosts(page);

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
        {postsResult.data.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-xl">{t('noPosts')}</p>
            <p className="mt-2 text-sm">{t('checkBack')}</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {postsResult.data.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
                  <div className="relative h-48 sm:h-56 w-full">
                    {post.image_url ? (
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-4xl">
                        📝
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <Calendar size={16} />
                      <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{post.title}</h2>
                    {post.excerpt && (
                      <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">{post.excerpt}</p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-hover transition-colors mt-auto group"
                    >
                      {t('readMore')}
                      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <Pagination
              currentPage={postsResult.page}
              totalPages={postsResult.total_pages}
              basePath="/blog"
            />
          </>
        )}
      </Container>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
