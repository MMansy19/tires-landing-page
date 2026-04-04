import { createClient } from '@/lib/supabase/server';
import type { Post, PaginatedResponse } from '@/types/database';

const DEFAULT_PER_PAGE = 9;

export async function getPosts(page: number = 1, per_page: number = DEFAULT_PER_PAGE): Promise<PaginatedResponse<Post>> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;

    const { data, count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: (data as Post[]) || [],
      count: count || 0,
      page,
      per_page,
      total_pages: Math.ceil((count || 0) / per_page),
    };
  } catch {
    return { data: [], count: 0, page, per_page, total_pages: 0 };
  }
}

export async function getAllPosts(page: number = 1, per_page: number = DEFAULT_PER_PAGE): Promise<PaginatedResponse<Post>> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;

    const { data, count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: (data as Post[]) || [],
      count: count || 0,
      page,
      per_page,
      total_pages: Math.ceil((count || 0) / per_page),
    };
  } catch {
    return { data: [], count: 0, page, per_page, total_pages: 0 };
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return data as Post;
  } catch {
    return null;
  }
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

export async function updatePost(id: string, post: Partial<Post>): Promise<Post> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}
