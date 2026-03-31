import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';
import ProductsList from '@/components/admin/ProductsList';

export const metadata = { title: 'المنتجات' };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <AdminShell>
      <ProductsList />
    </AdminShell>
  );
}
