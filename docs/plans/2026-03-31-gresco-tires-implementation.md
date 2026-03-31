# Gresco Tires Fullstack Rebuild - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Gresco Tires landing page into a production-ready fullstack Arabic RTL web application with admin dashboard, product/blog CMS, and ImageKit media management.

**Architecture:** Next.js App Router with server components for public pages, client components for admin forms. Supabase for database + auth (no local install — SQL provided for manual setup). Clean separation: `/components`, `/features`, `/lib`, `/services`, `/types`.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Supabase (remote), ImageKit, TipTap WYSIWYG, React Hook Form + Zod, pnpm

---

## Phase 1: Project Foundation

### Task 1: Clean up and switch to pnpm

**Files:**
- Delete: `package-lock.json`, `metadata.json`, `.eslintrc.json`
- Modify: `package.json`

**Step 1:** Delete Google Studio artifacts and npm lockfile

```bash
rm package-lock.json metadata.json .eslintrc.json
```

**Step 2:** Update `package.json` — remove Google Studio deps, update project name

Remove from dependencies: `@google/genai`
Remove from devDependencies: `firebase-tools`
Change name to `gresco-tires`

**Step 3:** Install with pnpm

```bash
pnpm install
```

**Step 4:** Verify build works

```bash
pnpm build
```

Expected: Build succeeds (may have warnings, no errors)

**Step 5:** Commit

```bash
git add -A
git commit -m "chore: switch to pnpm, remove Google Studio artifacts"
```

---

### Task 2: Create project folder structure

**Files:**
- Create directories: `components/ui/`, `components/landing/`, `components/shared/`, `components/admin/`, `features/`, `services/`, `types/`, `lib/supabase/`

**Step 1:** Create all directories

```bash
mkdir -p components/ui components/landing components/shared components/admin features services types lib/supabase
```

**Step 2:** Commit

```bash
git add -A
git commit -m "chore: create clean project folder structure"
```

---

### Task 3: Database SQL schema

**Files:**
- Create: `docs/database/schema.sql`
- Create: `docs/database/seed.sql`

**Step 1:** Create `docs/database/schema.sql`

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- BRANDS TABLE
-- ============================================
create table public.brands (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  logo_url text,
  created_at timestamptz default now() not null
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2),
  category text not null,
  brand_id uuid references public.brands(id) on delete set null,
  image_url text,
  is_featured boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Index for slug lookups
create index idx_products_slug on public.products(slug);
-- Index for category filtering
create index idx_products_category on public.products(category);
-- Index for brand filtering
create index idx_products_brand_id on public.products(brand_id);

-- ============================================
-- PRODUCT IMAGES TABLE (Gallery)
-- ============================================
create table public.product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamptz default now() not null
);

create index idx_product_images_product_id on public.product_images(product_id);

-- ============================================
-- POSTS TABLE (Blog)
-- ============================================
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  content jsonb default '{}'::jsonb,
  excerpt text,
  image_url text,
  published boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_posts_slug on public.posts(slug);
create index idx_posts_published on public.posts(published);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

create trigger set_posts_updated_at
  before update on public.posts
  for each row execute function public.handle_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.posts enable row level security;

-- PUBLIC READ policies
create policy "Brands are viewable by everyone"
  on public.brands for select using (true);

create policy "Products are viewable by everyone"
  on public.products for select using (true);

create policy "Product images are viewable by everyone"
  on public.product_images for select using (true);

create policy "Published posts are viewable by everyone"
  on public.posts for select using (published = true);

-- AUTHENTICATED WRITE policies (for admin)
create policy "Authenticated users can manage brands"
  on public.brands for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage products"
  on public.products for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage product images"
  on public.product_images for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage posts"
  on public.posts for all using (auth.role() = 'authenticated');

-- Allow authenticated users to read all posts (including drafts) in admin
create policy "Authenticated users can read all posts"
  on public.posts for select using (auth.role() = 'authenticated');
```

**Step 2:** Create `docs/database/seed.sql` with sample Arabic data

```sql
-- Sample brands
insert into public.brands (name, logo_url) values
  ('ميشلان', 'https://ik.imagekit.io/placeholder/michelin.png'),
  ('بريدجستون', 'https://ik.imagekit.io/placeholder/bridgestone.png'),
  ('كونتيننتال', 'https://ik.imagekit.io/placeholder/continental.png'),
  ('بيريللي', 'https://ik.imagekit.io/placeholder/pirelli.png'),
  ('جوديير', 'https://ik.imagekit.io/placeholder/goodyear.png'),
  ('هانكوك', 'https://ik.imagekit.io/placeholder/hankook.png');

-- Sample products (use brand IDs from above - these are placeholders)
-- Run after brands are inserted, replace UUIDs with actual brand IDs
insert into public.products (name, slug, description, price, category, image_url, is_featured) values
  ('إطار ميشلان بايلوت سبورت 5', 'michelin-pilot-sport-5', 'إطار رياضي عالي الأداء مصمم للقيادة الديناميكية مع ثبات استثنائي', 4500.00, 'سيارات ركاب', 'https://ik.imagekit.io/placeholder/tire1.png', true),
  ('إطار بريدجستون تورانزا', 'bridgestone-turanza', 'إطار فاخر يوفر راحة القيادة وهدوء استثنائي على الطرق المعبدة', 3800.00, 'سيارات ركاب', 'https://ik.imagekit.io/placeholder/tire2.png', true),
  ('إطار كونتيننتال كروس كونتاكت', 'continental-crosscontact', 'إطار متعدد الاستخدامات مصمم لسيارات الدفع الرباعي والأراضي الوعرة', 5200.00, 'دفع رباعي', 'https://ik.imagekit.io/placeholder/tire3.png', true),
  ('إطار بيريللي سكوربيون', 'pirelli-scorpion', 'إطار SUV متطور يجمع بين الأداء على الطرق والقدرة على الطرق الوعرة', 4800.00, 'دفع رباعي', 'https://ik.imagekit.io/placeholder/tire4.png', false),
  ('إطار جوديير كارجو', 'goodyear-cargo', 'إطار تجاري شديد التحمل مصمم للشاحنات وسيارات النقل', 3200.00, 'مركبات تجارية', 'https://ik.imagekit.io/placeholder/tire5.png', false);

-- Sample blog post
insert into public.posts (title, slug, content, excerpt, published) values
  ('كيف تختار الإطار المناسب لسيارتك', 'how-to-choose-right-tire', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"اختيار الإطار المناسب هو أحد أهم القرارات التي يمكنك اتخاذها لسلامتك على الطريق."}]}]}', 'دليل شامل لاختيار الإطارات المناسبة لنوع سيارتك وأسلوب قيادتك', true);
```

**Step 3:** Commit

```bash
git add docs/
git commit -m "docs: add database schema and seed SQL"
```

---

### Task 4: TypeScript types

**Files:**
- Create: `types/database.ts`

**Step 1:** Create `types/database.ts`

```typescript
export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  category: string;
  brand_id: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithBrand extends Product {
  brands: Brand | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: Record<string, unknown>;
  excerpt: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  brand_id?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}
```

**Step 2:** Commit

```bash
git add types/
git commit -m "feat: add TypeScript database types"
```

---

### Task 5: Supabase clients (server + browser)

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Delete: `lib/supabase.ts` (old single client)

**Step 1:** Create `lib/supabase/client.ts` (browser client)

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Step 2:** Create `lib/supabase/server.ts` (server client using cookies)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
```

**Step 3:** Create `lib/supabase/middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/admin/login' && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

**Step 4:** Delete old `lib/supabase.ts`

**Step 5:** Commit

```bash
git add lib/supabase/ && git rm lib/supabase.ts
git commit -m "feat: add Supabase SSR clients (server, browser, middleware)"
```

---

### Task 6: Next.js middleware + updated config

**Files:**
- Create: `middleware.ts` (root)
- Modify: `next.config.ts`
- Modify: `.env.example`

**Step 1:** Create root `middleware.ts`

```typescript
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

**Step 2:** Update `next.config.ts` — add ImageKit domain to remotePatterns, remove Google Studio webpack hack

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
};

export default nextConfig;
```

**Step 3:** Update `.env.example`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="YOUR_IMAGEKIT_URL_ENDPOINT"
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="YOUR_IMAGEKIT_PUBLIC_KEY"
IMAGEKIT_PRIVATE_KEY="YOUR_IMAGEKIT_PRIVATE_KEY"
```

**Step 4:** Commit

```bash
git add middleware.ts next.config.ts .env.example
git commit -m "feat: add auth middleware, update Next.js config"
```

---

### Task 7: Install new dependencies

**Files:**
- Modify: `package.json`

**Step 1:** Install production dependencies

```bash
pnpm add @supabase/ssr @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-underline react-hook-form zod @hookform/resolvers
```

**Step 2:** Verify build

```bash
pnpm build
```

**Step 3:** Commit

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add production dependencies"
```

---

### Task 8: Utility functions

**Files:**
- Modify: `lib/utils.ts`
- Create: `lib/imagekit.ts`

**Step 1:** Update `lib/utils.ts` — keep cn, add slug generator

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\u0600-\u06FF]+/g, '-') // Replace Arabic chars and spaces with dashes
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}
```

**Step 2:** Create `lib/imagekit.ts`

```typescript
import ImageKit from 'imagekit';

let imagekit: ImageKit | null = null;

export function getImageKit() {
  if (!imagekit) {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      throw new Error('ImageKit environment variables are missing');
    }

    imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });
  }
  return imagekit;
}
```

**Step 3:** Commit

```bash
git add lib/
git commit -m "feat: add utility functions and ImageKit config"
```

---

## Phase 2: Service Layer

### Task 9: Products service

**Files:**
- Create: `services/products.ts`

**Step 1:** Create `services/products.ts`

```typescript
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
```

**Step 2:** Commit

```bash
git add services/
git commit -m "feat: add products service layer"
```

---

### Task 10: Posts service

**Files:**
- Create: `services/posts.ts`

**Step 1:** Create `services/posts.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import type { Post, PaginatedResponse } from '@/types/database';

const DEFAULT_PER_PAGE = 9;

export async function getPosts(page: number = 1, per_page: number = DEFAULT_PER_PAGE): Promise<PaginatedResponse<Post>> {
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
}

export async function getAllPosts(page: number = 1, per_page: number = DEFAULT_PER_PAGE): Promise<PaginatedResponse<Post>> {
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
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Post;
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
```

**Step 2:** Commit

```bash
git add services/posts.ts
git commit -m "feat: add posts service layer"
```

---

### Task 11: Brands service

**Files:**
- Create: `services/brands.ts`

**Step 1:** Create `services/brands.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import type { Brand } from '@/types/database';

export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');

  if (error) return [];
  return data as Brand[];
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Brand;
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
```

**Step 2:** Commit

```bash
git add services/brands.ts
git commit -m "feat: add brands service layer"
```

---

## Phase 3: UI Component System

### Task 12: Zod validation schemas

**Files:**
- Create: `lib/validations.ts`

**Step 1:** Create `lib/validations.ts`

```typescript
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'اسم المنتج مطلوب'),
  slug: z.string().min(2, 'الرابط المختصر مطلوب'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'السعر يجب أن يكون رقم موجب').optional(),
  category: z.string().min(1, 'الفئة مطلوبة'),
  brand_id: z.string().uuid().optional().nullable(),
  image_url: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
});

export const postSchema = z.object({
  title: z.string().min(2, 'عنوان المقال مطلوب'),
  slug: z.string().min(2, 'الرابط المختصر مطلوب'),
  content: z.any(),
  excerpt: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  published: z.boolean().default(false),
});

export const brandSchema = z.object({
  name: z.string().min(1, 'اسم العلامة التجارية مطلوب'),
  logo_url: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type PostFormData = z.infer<typeof postSchema>;
export type BrandFormData = z.infer<typeof brandSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
```

**Step 2:** Commit

```bash
git add lib/validations.ts
git commit -m "feat: add Zod validation schemas"
```

---

### Task 13: Base UI components

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/container.tsx`
- Create: `components/ui/section.tsx`
- Create: `components/ui/modal.tsx`
- Create: `components/ui/skeleton.tsx`
- Create: `components/ui/badge.tsx`

**Step 1:** Create all UI components. These are reusable, unstyled primitives using Tailwind + `cn()`.

`components/ui/button.tsx`:
```tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-accent hover:bg-accent-hover text-white shadow-sm',
      secondary: 'bg-primary hover:bg-primary-light text-white',
      outline: 'border-2 border-slate-200 hover:border-accent text-slate-700 hover:text-accent bg-white',
      ghost: 'text-slate-600 hover:text-accent hover:bg-slate-100',
      danger: 'bg-red-500 hover:bg-red-600 text-white',
    };
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        {...props}
        disabled={disabled || isLoading}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
export { Button };
```

`components/ui/input.tsx`:
```tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900',
            'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
            'transition-colors placeholder:text-slate-400',
            error && 'border-red-400 focus:ring-red-400/50 focus:border-red-400',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
export { Input };
```

`components/ui/card.tsx`:
```tsx
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-white rounded-2xl border border-slate-100 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}
```

`components/ui/container.tsx`:
```tsx
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  );
}
```

`components/ui/section.tsx`:
```tsx
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn('py-24', className)} {...props}>
      {children}
    </section>
  );
}
```

`components/ui/modal.tsx`:
```tsx
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto', className)}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          {title && <h2 className="text-xl font-bold text-slate-900">{title}</h2>}
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
```

`components/ui/skeleton.tsx`:
```tsx
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-xl bg-slate-200', className)} {...props} />
  );
}
```

`components/ui/badge.tsx`:
```tsx
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium', variants[variant], className)}
      {...props}
    />
  );
}
```

**Step 2:** Commit

```bash
git add components/ui/
git commit -m "feat: add base UI component system"
```

---

## Phase 4: Global Layout + RTL Arabic

### Task 14: Root layout with Arabic RTL + Cairo font

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Step 1:** Rewrite `app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'جريسكو تايرز | إطارات عالية الجودة في مصر',
    template: '%s | جريسكو تايرز',
  },
  description: 'جريسكو تايرز - الوكيل الرسمي لأفضل ماركات الإطارات العالمية في مصر. إطارات سيارات ركاب، دفع رباعي، ومركبات تجارية مع خدمة تركيب احترافية.',
  keywords: ['إطارات', 'تايرز', 'سيارات', 'مصر', 'جريسكو', 'ميشلان', 'بريدجستون', 'كونتيننتال'],
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: 'جريسكو تايرز',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
```

**Step 2:** Update `app/globals.css`

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-cairo), ui-sans-serif, system-ui, sans-serif;
  --color-primary: #0A2540;
  --color-primary-light: #1A3A5A;
  --color-accent: #FF6B00;
  --color-accent-hover: #E65A00;
}

@layer base {
  body {
    @apply bg-slate-50 text-slate-900;
  }
}

/* Marquee animation for brands carousel */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

/* RTL marquee direction */
[dir="rtl"] .animate-marquee {
  animation-direction: reverse;
}

/* TipTap editor styles */
.tiptap {
  @apply min-h-[200px] outline-none;
}
.tiptap p {
  @apply mb-4;
}
.tiptap h1, .tiptap h2, .tiptap h3 {
  @apply font-bold mb-4;
}
.tiptap h1 { @apply text-3xl; }
.tiptap h2 { @apply text-2xl; }
.tiptap h3 { @apply text-xl; }
.tiptap ul, .tiptap ol {
  @apply pr-6 mb-4;
}
.tiptap ul { @apply list-disc; }
.tiptap ol { @apply list-decimal; }
.tiptap img {
  @apply rounded-xl max-w-full my-4;
}
```

**Step 3:** Commit

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: Arabic RTL root layout with Cairo font"
```

---

## Phase 5: Shared Components

### Task 15: Shared Navbar (Arabic RTL)

**Files:**
- Create: `components/shared/Navbar.tsx`
- Delete: `components/Navbar.tsx` (old)

**Step 1:** Create `components/shared/Navbar.tsx` — Arabic version with RTL support

Full rewrite with Arabic labels, RTL-aware positioning, link to /products and /blog pages.

### Task 16: Shared Footer (Arabic RTL)

**Files:**
- Create: `components/shared/Footer.tsx`
- Delete: `components/Footer.tsx` (old)

### Task 17: FloatingWhatsApp (Arabic RTL)

**Files:**
- Create: `components/shared/FloatingWhatsApp.tsx`
- Delete: `components/FloatingWhatsApp.tsx` (old)

### Task 18: ImageUpload component

**Files:**
- Create: `components/shared/ImageUpload.tsx`

Standalone image upload component using ImageKit IKContext + IKUpload with preview, loading state, and remove functionality. Reusable across admin forms.

---

## Phase 6: Landing Page Components (Arabic)

### Task 19-25: Rebuild all landing page sections

For each component (Hero, Brands, About, Services, Products, Testimonials, Contact):

**Files:**
- Create: `components/landing/Hero.tsx` (and each respective component)
- Delete: `components/Hero.tsx` (old versions)

Each component will be rebuilt with:
- Arabic content
- RTL-aware layout (me-/ms- instead of mr-/ml-)
- Server component where possible (no `'use client'` unless animation needed)
- Dynamic data from Supabase where applicable (Brands, Products sections)

---

## Phase 7: Public Pages

### Task 26: Landing page

**Files:**
- Modify: `app/page.tsx`

Compose all landing components. Server component fetching featured products and brands from Supabase.

### Task 27: Products listing page

**Files:**
- Create: `app/products/page.tsx`
- Create: `components/shared/Pagination.tsx`
- Create: `components/shared/ProductFilters.tsx`

Server component with filters (category, brand, search) passed as URL search params. Paginated product grid.

### Task 28: Product detail page

**Files:**
- Create: `app/products/[slug]/page.tsx`

Server component with dynamic metadata, product gallery, related products.

### Task 29: Blog listing page

**Files:**
- Modify: `app/blog/page.tsx` (rewrite with slug-based links)

### Task 30: Blog post page

**Files:**
- Create: `app/blog/[slug]/page.tsx`
- Delete: `app/blog/[id]/page.tsx`

TipTap JSON content rendered as HTML. Dynamic SEO meta.

---

## Phase 8: Admin Dashboard

### Task 31: Admin login page

**Files:**
- Create: `app/admin/login/page.tsx`

Client component with React Hook Form + Zod. Supabase signInWithPassword.

### Task 32: Admin layout with sidebar

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `components/admin/Sidebar.tsx`

Layout with sidebar navigation (Dashboard, Products, Posts, Brands), user info, logout button.

### Task 33: Admin dashboard home

**Files:**
- Create: `app/admin/page.tsx`

Overview with counts (products, posts, brands) and recent items.

### Task 34: Admin products CRUD

**Files:**
- Create: `app/admin/products/page.tsx`
- Create: `app/admin/products/new/page.tsx`
- Create: `app/admin/products/[id]/edit/page.tsx`
- Create: `app/admin/products/actions.ts` (server actions)

Data table with search, create/edit forms with React Hook Form + Zod, image gallery upload, delete confirmation.

### Task 35: Admin posts CRUD

**Files:**
- Create: `app/admin/posts/page.tsx`
- Create: `app/admin/posts/new/page.tsx`
- Create: `app/admin/posts/[id]/edit/page.tsx`
- Create: `app/admin/posts/actions.ts`
- Create: `components/admin/TipTapEditor.tsx`

TipTap WYSIWYG editor with toolbar (bold, italic, underline, headings, lists, images, text-align).

### Task 36: Admin brands CRUD

**Files:**
- Create: `app/admin/brands/page.tsx`
- Create: `app/admin/brands/actions.ts`

Simple CRUD with logo upload via modal.

---

## Phase 9: ImageKit API + Upload System

### Task 37: Update ImageKit auth route

**Files:**
- Modify: `app/api/imagekit/auth/route.ts`

Use the `lib/imagekit.ts` helper. Keep the existing pattern, just refactor to use shared config.

---

## Phase 10: Cleanup + Final Polish

### Task 38: Remove old components

**Files:**
- Delete all files in `components/` root (Navbar.tsx, Hero.tsx, About.tsx, etc.)
- Delete `components/AdminPanel.tsx`
- Delete `hooks/use-mobile.ts` if unused

### Task 39: Final build verification

**Step 1:** Run build

```bash
pnpm build
```

Expected: No TypeScript errors, successful build.

**Step 2:** Commit

```bash
git add -A
git commit -m "chore: cleanup old components, final build verification"
```

---

## Execution Order Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-8 | Foundation: pnpm, structure, DB schema, types, Supabase clients, middleware, deps, utils |
| 2 | 9-11 | Service layer: products, posts, brands |
| 3 | 12-13 | UI system: validations, base components |
| 4 | 14 | Global layout: Arabic RTL, Cairo font, globals.css |
| 5 | 15-18 | Shared components: Navbar, Footer, WhatsApp, ImageUpload |
| 6 | 19-25 | Landing page sections: all 7 components rebuilt in Arabic |
| 7 | 26-30 | Public pages: landing, products, blog |
| 8 | 31-36 | Admin dashboard: login, layout, CRUD pages, TipTap |
| 9 | 37 | ImageKit API route |
| 10 | 38-39 | Cleanup + final build |
