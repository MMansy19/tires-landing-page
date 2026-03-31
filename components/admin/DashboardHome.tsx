'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Package, FileText, Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  products: number;
  posts: number;
  brands: number;
}

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats>({ products: 0, posts: 0, brands: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const [products, posts, brands] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('brands').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        products: products.count || 0,
        posts: posts.count || 0,
        brands: brands.count || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'المنتجات', count: stats.products, icon: Package, href: '/admin/products', color: 'bg-blue-500' },
    { label: 'المقالات', count: stats.posts, icon: FileText, href: '/admin/posts', color: 'bg-green-500' },
    { label: 'العلامات التجارية', count: stats.brands, icon: Tag, href: '/admin/brands', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">مرحبًا بك في لوحة التحكم</h1>
        <p className="text-slate-500 mt-1">إدارة المحتوى والمنتجات</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white`}>
                <card.icon size={24} />
              </div>
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">
              {loading ? '...' : card.count}
            </div>
            <div className="text-sm text-slate-500 font-medium">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
