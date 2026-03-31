import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';
import PostsList from '@/components/admin/PostsList';

export const metadata = { title: 'المقالات' };

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <AdminShell>
      <PostsList />
    </AdminShell>
  );
}
