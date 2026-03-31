'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Pencil, Trash2, Loader2, FileText } from 'lucide-react';
import type { Post } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts((data as Post[]) || []);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    setDeleting(id);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.from('posts').delete().eq('id', id);
    setPosts(prev => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">المقالات</h1>
          <p className="text-slate-500 mt-1">إدارة مقالات المدونة</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-xl font-semibold transition-colors"
        >
          <Plus size={20} />
          إضافة مقال
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200">
          <FileText size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-xl font-medium">لا توجد مقالات</p>
          <p className="mt-1">ابدأ بكتابة مقال جديد</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-slate-600">المقال</th>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-slate-600">الحالة</th>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-slate-600">التاريخ</th>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-slate-600">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {post.image_url ? (
                            <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">📝</div>
                          )}
                        </div>
                        <span className="font-medium text-slate-900 line-clamp-1">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {post.published ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{formatDate(post.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-2 text-slate-400 hover:text-accent transition-colors rounded-lg hover:bg-slate-100"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
                        >
                          {deleting === post.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
