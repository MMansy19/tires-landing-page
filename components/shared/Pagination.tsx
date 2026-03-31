'use client';

import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  const t = useTranslations('common');

  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${basePath}?${params.toString()}`;
  };

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="التنقل بين الصفحات">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label={t('previous')}
        >
          <ChevronRight size={20} />
        </Link>
      )}

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-3 py-2 text-slate-400">...</span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              currentPage === page
                ? 'bg-accent text-white'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label={t('next')}
        >
          <ChevronLeft size={20} />
        </Link>
      )}
    </nav>
  );
}
