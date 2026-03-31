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
