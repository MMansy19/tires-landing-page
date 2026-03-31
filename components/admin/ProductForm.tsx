'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import ImageUpload from '@/components/shared/ImageUpload';
import type { Product, Brand } from '@/types/database';
import { generateSlug } from '@/lib/utils';

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    category: initialData?.category || '',
    brand_id: initialData?.brand_id || '',
    image_url: initialData?.image_url || '',
    is_featured: initialData?.is_featured || false,
  });

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.from('brands').select('*').order('name').then(({ data }) => {
      if (data) setBrands(data);
    });
  }, []);

  const handleNameChange = (name: string) => {
    setForm(prev => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: form.price ? parseFloat(form.price) : null,
      category: form.category,
      brand_id: form.brand_id || null,
      image_url: form.image_url || null,
      is_featured: form.is_featured,
    };

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', initialData.id);
        if (error) throw error;
        setSuccess('تم تحديث المنتج بنجاح');
      } else {
        const { error } = await supabase
          .from('products')
          .insert(payload);
        if (error) throw error;
        setSuccess('تم إضافة المنتج بنجاح');
        setTimeout(() => router.push('/admin/products'), 1000);
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
        {isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">اسم المنتج *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
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
          <label className="block text-sm font-medium text-slate-700 mb-2">الوصف</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">السعر (ج.م)</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">الفئة *</label>
            <select
              value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-white"
              required
            >
              <option value="">اختر الفئة</option>
              <option value="سيارات ركاب">سيارات ركاب</option>
              <option value="دفع رباعي">دفع رباعي</option>
              <option value="مركبات تجارية">مركبات تجارية</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">العلامة التجارية</label>
            <select
              value={form.brand_id}
              onChange={(e) => setForm(prev => ({ ...prev, brand_id: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-white"
            >
              <option value="">بدون علامة</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_featured"
            checked={form.is_featured}
            onChange={(e) => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
            className="w-5 h-5 rounded border-slate-300 text-accent focus:ring-accent"
          />
          <label htmlFor="is_featured" className="text-sm font-medium text-slate-700">منتج مميز</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">صورة المنتج</label>
          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm(prev => ({ ...prev, image_url: url }))}
            folder="products"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {isEditing ? 'تحديث المنتج' : 'إضافة المنتج'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="text-slate-600 hover:text-slate-900 px-6 py-3 rounded-xl font-medium transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
