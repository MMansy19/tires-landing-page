import { createClient } from '@/lib/supabase/server';
import type { Brand } from '@/types/database';

export async function getBrands(): Promise<Brand[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');

    if (error) return [];
    return data as Brand[];
  } catch {
    return [];
  }
}

export async function getBrandById(id: string): Promise<Brand | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as Brand;
  } catch {
    return null;
  }
}

export async function createBrand(brand: Omit<Brand, 'id' | 'created_at'>): Promise<Brand> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .insert(brand)
    .select()
    .single();

  if (error) throw error;
  return data as Brand;
}

export async function updateBrand(id: string, brand: Partial<Brand>): Promise<Brand> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .update(brand)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Brand;
}

export async function deleteBrand(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw error;
}
