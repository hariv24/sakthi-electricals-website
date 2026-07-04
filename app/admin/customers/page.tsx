import { createSupabaseAdminClient } from '@/lib/supabase/server';
import CustomersClient from './CustomersClient';

export default async function CustomersPage() {
  const sb = await createSupabaseAdminClient();
  const { data } = await sb.from('customers').select('*').order('order_index', { ascending: true });
  return <CustomersClient initialCustomers={data ?? []} />;
}
