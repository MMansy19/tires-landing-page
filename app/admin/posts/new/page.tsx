import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';
import PostForm from '@/components/admin/PostForm';

export const metadata = { title: 'إضافة مقال' };

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <AdminShell>
      <PostForm />
    </AdminShell>
  );
}
