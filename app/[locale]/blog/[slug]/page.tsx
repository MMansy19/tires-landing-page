import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import FloatingWhatsApp from '@/components/shared/FloatingWhatsApp';
import { Container } from '@/components/ui/container';
import { getPostBySlug } from '@/services/posts';
import { formatDate } from '@/lib/utils';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const t = await getTranslations('blogPage');

  if (!post) return { title: t('notFound') };

  return {
    title: post.title,
    description: post.excerpt || `${post.title} - مدونة جريسكو تايرز`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.image_url ? [post.image_url] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const t = await getTranslations('blogPage');

  let htmlContent = '';
  try {
    if (post.content && typeof post.content === 'object' && 'type' in post.content) {
      htmlContent = generateHTML(post.content as Parameters<typeof generateHTML>[0], [
        StarterKit,
        TiptapImage,
        Underline,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ]);
    } else if (typeof post.content === 'string') {
      htmlContent = post.content;
    }
  } catch {
    htmlContent = `<p>${t('contentError')}</p>`;
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-primary pb-10">
        <Navbar />
      </div>

      <article className="flex-grow">
        <Container className="max-w-4xl py-8 md:py-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent transition-colors mb-6 md:mb-8 font-medium">
            <ArrowRight size={20} />
            {t('backToBlog')}
          </Link>

          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 md:mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-accent" />
                <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              </div>
              <div className="flex items-center gap-2">
                <User size={20} className="text-accent" />
                <span>{t('author')}</span>
              </div>
            </div>
          </header>

          {post.image_url && (
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl mb-8 md:mb-16">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-accent hover:prose-a:text-accent-hover prose-img:rounded-2xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </Container>
      </article>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
