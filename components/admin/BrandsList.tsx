'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Pencil, Trash2, Loader2, Tag, X, Check } from 'lucide-react';
import ImageUpload from '@/components/shared/ImageUpload';
import type { Brand } from '@/types/database';

export default function BrandsList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formName, setFormName] = useState('');
  const [formLogo, setFormLogo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.from('brands').select('*').order('name').then(({ data }) => {
      setBrands((data as Brand[]) || []);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه العلامة التجارية؟')) return;
    setDeleting(id);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.from('brands').delete().eq('id', id);
    setBrands(prev => prev.filter((b) => b.id !== id));
    setDeleting(null);
  }

  function openEdit(brand: Brand) {
    setEditingBrand(brand);
    setFormName(brand.name);
    setFormLogo(brand.logo_url || '');
    setShowForm(true);
  }

  function openNew() {
    setEditingBrand(null);
    setFormName('');
    setFormLogo('');
    setShowForm(true);
  }

  async function handleSave() {
    if (!formName.trim()) return;
    setSaving(true);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (editingBrand) {
      const { data } = await supabase
        .from('brands')
        .update({ name: formName, logo_url: formLogo || null })
        .eq('id', editingBrand.id)
        .select()
        .single();
      if (data) setBrands(brands.map((b) => b.id === editingBrand.id ? data as Brand : b));
    } else {
      const { data } = await supabase
        .from('brands')
        .insert({ name: formName, logo_url: formLogo || null })
        .select()
        .single();
      if (data) setBrands([...brands, data as Brand]);
    }

    setSaving(false);
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">العلامات التجارية</h1>
          <p className="text-slate-500 mt-1">إدارة العلامات التجارية</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-xl font-semibold transition-colors"
        >
          <Plus size={20} />
          إضافة علامة
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              {editingBrand ? 'تعديل العلامة التجارية' : 'إضافة علامة تجارية جديدة'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">الاسم *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">الشعار</label>
              <ImageUpload
                value={formLogo}
                onChange={setFormLogo}
                folder="brands"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !formName.trim()}
              className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
              {editingBrand ? 'تحديث' : 'إضافة'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200">
          <Tag size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-xl font-medium">لا توجد علامات تجارية</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center">
              <div className="relative w-24 h-16 mb-3">
                {brand.logo_url ? (
                  <Image src={brand.logo_url} alt={brand.name} fill className="object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Tag size={32} />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-slate-900 mb-3">{brand.name}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(brand)} className="p-2 text-slate-400 hover:text-accent rounded-lg hover:bg-slate-100">
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  disabled={deleting === brand.id}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === brand.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
