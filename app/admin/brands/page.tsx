import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';
import BrandsList from '@/components/admin/BrandsList';

export const metadata = { title: 'العلامات التجارية' };

export default async function AdminBrandsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <AdminShell>
      <BrandsList />
    </AdminShell>
  );
}
