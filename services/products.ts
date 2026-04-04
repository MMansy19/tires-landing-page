import { createClient } from '@/lib/supabase/server';
import type { Product, ProductWithBrand, ProductImage, ProductFilters, PaginatedResponse } from '@/types/database';

const DEFAULT_PER_PAGE = 12;

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<ProductWithBrand>> {
  const supabase = await createClient();
  const page = filters.page || 1;
  const per_page = filters.per_page || DEFAULT_PER_PAGE;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  let query = supabase
    .from('products')
    .select('*, brands(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.brand_id) {
    query = query.eq('brand_id', filters.brand_id);
  }
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: (data as ProductWithBrand[]) || [],
    count: count || 0,
    page,
    per_page,
    total_pages: Math.ceil((count || 0) / per_page),
  };
}

export async function getProductBySlug(slug: string): Promise<ProductWithBrand | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, brands(*)')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as ProductWithBrand;
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error) return [];
  return data as ProductImage[];
}

export async function getFeaturedProducts(): Promise<ProductWithBrand[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, brands(*)')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) return [];
  return data as ProductWithBrand[];
}

export async function getCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .order('category');

  if (error) return [];
  const unique = [...new Set(data.map((d) => d.category))];
  return unique;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function addProductImage(productId: string, imageUrl: string, sortOrder: number = 0): Promise<ProductImage> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('product_images')
    .insert({ product_id: productId, image_url: imageUrl, sort_order: sortOrder })
    .select()
    .single();

  if (error) throw error;
  return data as ProductImage;
}

export async function deleteProductImage(imageId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('product_images').delete().eq('id', imageId);
  if (error) throw error;
}
