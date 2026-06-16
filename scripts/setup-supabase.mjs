/**
 * Run once after the schema.sql has been applied:
 *   node scripts/setup-supabase.mjs
 * Creates the storage bucket and admin user.
 */

import { createClient } from '@supabase/supabase-js';

const URL_  = 'https://lkrorieuntbtfxfspogs.supabase.co';
const KEY   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrcm9yaWV1bnRidGZ4ZnNwb2dzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTUzOTYzMiwiZXhwIjoyMDk3MTE1NjMyfQ.f2GeRve_xqC1Ko8Op3Mmk7dyKSzWtetWRHJtk6SHxgE';

const sb = createClient(URL_, KEY, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  console.log('Setting up Supabase bucket + admin user...\n');

  // Storage bucket
  const { error: bErr } = await sb.storage.createBucket('product-images', {
    public: true,
    allowedMimeTypes: ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'],
    fileSizeLimit: 10485760,
  });
  if (bErr && !bErr.message.includes('already exists')) {
    console.log('Bucket error:', bErr.message);
  } else {
    console.log('✓ Storage bucket: product-images');
  }

  // Admin user
  const { error: uErr } = await sb.auth.admin.createUser({
    email: 'admin@sakthielectricals.com',
    password: 'sakthielectricals@741',
    email_confirm: true,
    user_metadata: { role: 'admin', name: 'Manikandan' },
  });
  if (uErr && !uErr.message.includes('already registered')) {
    console.log('User error:', uErr.message);
  } else {
    console.log('✓ Admin user created');
    console.log('  Email:    admin@sakthielectricals.com');
    console.log('  Password: sakthielectricals@741');
  }

  console.log('\nDone.');
}

main().catch(console.error);
