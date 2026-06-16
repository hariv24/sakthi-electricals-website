'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function uploadNewsImage(imageFile: File): Promise<string | null> {
  if (!imageFile || imageFile.size === 0) return null;
  const admin = await createSupabaseAdminClient();
  const ext = imageFile.name.split('.').pop();
  const path = `news/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const { error } = await admin.storage.from('product-images').upload(path, buffer, {
    contentType: imageFile.type,
    upsert: true,
  });
  if (error) return null;
  const { data: { publicUrl } } = admin.storage.from('product-images').getPublicUrl(path);
  return publicUrl;
}

export async function createNewsItem(formData: FormData) {
  const imageFile = formData.get('image') as File | null;
  const image_url = imageFile ? await uploadNewsImage(imageFile) : null;
  const sb = await createSupabaseServerClient();
  const { error } = await sb.from('news_items').insert({
    title:          formData.get('title') as string,
    published_date: formData.get('published_date') as string,
    content:        formData.get('content') as string,
    image_url,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/news');
  revalidatePath('/');
  redirect('/admin/news');
}

export async function updateNewsItem(id: string, formData: FormData) {
  const imageFile = formData.get('image') as File | null;
  const image_url = imageFile ? await uploadNewsImage(imageFile) : undefined;
  const sb = await createSupabaseServerClient();
  const updateData: Record<string, unknown> = {
    title:          formData.get('title') as string,
    published_date: formData.get('published_date') as string,
    content:        formData.get('content') as string,
  };
  if (image_url !== undefined) updateData.image_url = image_url;
  const { error } = await sb.from('news_items').update(updateData).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/news');
  revalidatePath('/');
  redirect('/admin/news');
}

export async function deleteNewsItem(id: string) {
  const sb = await createSupabaseServerClient();
  await sb.from('news_items').delete().eq('id', id);
  revalidatePath('/admin/news');
  revalidatePath('/');
}
