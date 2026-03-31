# Gresco Tires - Fullstack Rebuild Design

## Overview
Convert the existing Google Studio-generated landing page into a production-ready fullstack Arabic RTL web application with admin dashboard, product/blog CMS, and media management.

## Decisions
- **Language:** Full Arabic, RTL only
- **Blog editor:** TipTap WYSIWYG
- **Product images:** Multiple images per product (gallery)
- **Pagination:** Traditional page-based pagination
- **Architecture:** Clean rebuild (Approach A)

## Project Structure
```
/app
  layout.tsx              (RTL Arabic root, Cairo font)
  page.tsx                (Landing page)
  /products/page.tsx      (Product listing + filters + pagination)
  /products/[slug]/page.tsx
  /blog/page.tsx
  /blog/[slug]/page.tsx
  /admin/layout.tsx       (Sidebar admin layout, auth-protected)
  /admin/page.tsx         (Dashboard)
  /admin/products/page.tsx
  /admin/posts/page.tsx
  /admin/brands/page.tsx
  /admin/login/page.tsx
  /api/imagekit/auth/route.ts
/components
  /ui/        (Button, Input, Modal, Card, Container, Section, Skeleton)
  /landing/   (Hero, About, Services, Products, Brands, Testimonials, Contact)
  /shared/    (Navbar, Footer, FloatingWhatsApp, ImageUpload)
  /admin/     (Sidebar, AdminForm, DataTable, TipTapEditor)
/lib
  /supabase/server.ts, client.ts, middleware.ts
  /imagekit.ts
  /utils.ts
/services
  /products.ts, /posts.ts, /brands.ts
/types
  /database.ts
/middleware.ts
```

## Database
- products (id, name, slug, description, price, category, brand_id FK, image_url, created_at, updated_at)
- product_images (id, product_id FK, image_url, sort_order, created_at)
- posts (id, title, slug, content JSON, image_url, published, created_at, updated_at)
- brands (id, name, logo_url)
- RLS: public read, authenticated write

## Auth
- Supabase Auth email/password
- Next.js middleware protects /admin/*
- @supabase/ssr for server-side sessions

## Data Flow
- Public: Server components fetch Supabase directly
- Admin: Server actions for mutations, client components for forms
- Images: ImageKit signed upload → URL saved in Supabase

## RTL
- dir="rtl" on <html>
- Cairo Google font
- All Arabic content
- Tailwind logical properties (ms-/me-/ps-/pe-)

## Dependencies
Add: @supabase/ssr, @tiptap/react, @tiptap/starter-kit, @tiptap/extension-image, react-hook-form, zod, @hookform/resolvers, @tanstack/react-query
Remove: @google/genai, firebase-tools, package-lock.json
Switch: npm → pnpm
