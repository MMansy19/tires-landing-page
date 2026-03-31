'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import ImageUpload from '@/components/shared/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { Post } from '@/types/database';
import { generateSlug } from '@/lib/utils';

interface PostFormProps {
  initialData?: Post;
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    image_url: initialData?.image_url || '',
    published: initialData?.published ?? false,
    content: initialData?.content || {},
  });

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      image_url: form.image_url || null,
      published: form.published,
      content: form.content,
    };

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      if (isEditing) {
        const { error } = await supabase
          .from('posts')
          .update(payload)
          .eq('id', initialData.id);
        if (error) throw error;
        setSuccess('تم تحديث المقال بنجاح');
      } else {
        const { error } = await supabase
          .from('posts')
          .insert(payload);
        if (error) throw error;
        setSuccess('تم إضافة المقال بنجاح');
        setTimeout(() => router.push('/admin/posts'), 1000);
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6 md:mb-8">
        {isEditing ? 'تعديل المقال' : 'إضافة مقال جديد'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">عنوان المقال *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">الرابط (Slug)</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">المقتطف</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
            placeholder="وصف مختصر للمقال..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">المحتوى</label>
          <RichTextEditor
            content={form.content}
            onChange={(content) => setForm(prev => ({ ...prev, content }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">صورة المقال</label>
          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm(prev => ({ ...prev, image_url: url }))}
            folder="posts"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm(prev => ({ ...prev, published: e.target.checked }))}
            className="w-5 h-5 rounded border-slate-300 text-accent focus:ring-accent"
          />
          <label htmlFor="published" className="text-sm font-medium text-slate-700">نشر المقال</label>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {isEditing ? 'تحديث المقال' : 'إضافة المقال'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            className="text-slate-600 hover:text-slate-900 px-6 py-3 rounded-xl font-medium transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
