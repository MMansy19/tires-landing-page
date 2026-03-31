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

create index idx_products_slug on public.products(slug);
create index idx_products_category on public.products(category);
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

-- AUTHENTICATED WRITE policies
create policy "Authenticated users can manage brands"
  on public.brands for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage products"
  on public.products for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage product images"
  on public.product_images for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage posts"
  on public.posts for all using (auth.role() = 'authenticated');

create policy "Authenticated users can read all posts"
  on public.posts for select using (auth.role() = 'authenticated');
