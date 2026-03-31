import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';
import PostForm from '@/components/admin/PostForm';

export const metadata = { title: 'تعديل المقال' };

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { id } = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) redirect('/admin/posts');

  return (
    <AdminShell>
      <PostForm initialData={post} />
    </AdminShell>
  );
}
