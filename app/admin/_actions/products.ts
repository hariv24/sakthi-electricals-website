'use server';
import { revalidatePath, updateTag } from 'next/cache';
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

function toSlug(name: string) {
  return name.trim().toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function createNode(parentId: string | null, isLeaf: boolean) {
  const sb = await createSupabaseServerClient();
  const { data: siblings } = await sb.from('catalog_nodes').select('order_index').eq('parent_id', parentId ?? null as unknown as string).order('order_index', { ascending: false }).limit(1);
  const nextOrder = (siblings?.[0]?.order_index ?? -1) + 1;
  const name = isLeaf ? 'New product' : 'New category';
  const { data, error } = await sb.from('catalog_nodes').insert({
    parent_id: parentId,
    name,
    slug: toSlug(name) + '-' + Date.now(),
    order_index: nextOrder,
    is_leaf: isLeaf,
  }).select('id').single();
  if (error) throw new Error(error.message);
  revalidatePath('/admin/products');
  revalidatePath('/', 'layout');
  updateTag('catalog');
  redirect(`/admin/products/${data.id}`);
}

export async function updateNode(id: string, formData: FormData) {
  const sb = await createSupabaseServerClient();
  const name = formData.get('name') as string;
  await sb.from('catalog_nodes').update({ name, slug: toSlug(name) }).eq('id', id);
  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/', 'layout');
  updateTag('catalog');
}

export async function deleteNode(id: string) {
  const sb = await createSupabaseServerClient();
  await sb.from('catalog_nodes').delete().eq('id', id);
  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/', 'layout');
  updateTag('catalog');
  redirect('/admin/products');
}

export async function saveSpecs(nodeId: string, rows: { label: string; value: string }[]) {
  const sb = await createSupabaseServerClient();
  await sb.from('product_specs').delete().eq('node_id', nodeId);
  if (rows.length) {
    await sb.from('product_specs').insert(rows.map((r, i) => ({ node_id: nodeId, label: r.label, value: r.value, order_index: i })));
  }
  revalidatePath('/admin/products');
  revalidatePath('/products');
}

export async function saveOverview(nodeId: string, data: { heading: string; paragraph_1: string; paragraph_2: string }) {
  const sb = await createSupabaseServerClient();
  await sb.from('product_overview').upsert({ node_id: nodeId, ...data }, { onConflict: 'node_id' });
  revalidatePath('/products');
}

export async function reorderNodes(orderedIds: string[]) {
  const sb = await createSupabaseServerClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      sb.from('catalog_nodes').update({ order_index: index }).eq('id', id)
    )
  );
  revalidatePath('/admin/products');
  revalidatePath('/', 'layout');
  updateTag('catalog');
}

export async function saveApplications(nodeId: string, apps: { title: string; body: string; icon_name?: string }[]) {
  const sb = await createSupabaseServerClient();
  await sb.from('product_applications').delete().eq('node_id', nodeId);
  if (apps.length) {
    await sb.from('product_applications').insert(apps.map((a, i) => ({ node_id: nodeId, title: a.title, body: a.body, icon_name: a.icon_name ?? 'Zap', order_index: i })));
  }
  revalidatePath('/products');
}

export async function setHeroImage(nodeId: string, imageUrl: string) {
  const sb = await createSupabaseServerClient();
  await sb.from('catalog_nodes').update({ cover_image_url: imageUrl }).eq('id', nodeId);

  // Move this image to order_index 0 so it appears first on the public product page
  const { data: allImgs } = await sb.from('product_images').select('id, url').eq('node_id', nodeId).order('order_index');
  if (allImgs && allImgs.length > 0) {
    const reordered = [
      ...allImgs.filter(i => i.url === imageUrl),
      ...allImgs.filter(i => i.url !== imageUrl),
    ];
    await Promise.all(reordered.map((img, idx) =>
      sb.from('product_images').update({ order_index: idx }).eq('id', img.id)
    ));
  }

  revalidatePath(`/admin/products/${nodeId}`);
  revalidatePath('/admin/products');
  revalidatePath('/products', 'layout');
}

export async function reorderImages(orders: { id: string; order_index: number }[]) {
  const sb = await createSupabaseServerClient();
  await Promise.all(orders.map(o =>
    sb.from('product_images').update({ order_index: o.order_index }).eq('id', o.id)
  ));
  revalidatePath('/products', 'layout');
}

export async function uploadProductImage(formData: FormData): Promise<{ id: string; url: string; order_index: number } | null> {
  const file = formData.get('file') as File;
  const nodeId = formData.get('nodeId') as string;
  const orderIndex = parseInt(formData.get('orderIndex') as string, 10);
  if (!file || file.size === 0 || !nodeId) return null;
  const admin = await createSupabaseAdminClient();
  const ext = file.name.split('.').pop();
  const path = `${nodeId}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from('product-images').upload(path, buffer, { contentType: file.type, upsert: true });
  if (error) { console.error('Upload error:', error.message); return null; }
  const { data: { publicUrl } } = admin.storage.from('product-images').getPublicUrl(path);
  const { data: row } = await admin.from('product_images').insert({ node_id: nodeId, url: publicUrl, order_index: orderIndex }).select('id,url,order_index').single();
  // Auto-set as cover image if the product has none yet
  const { data: node } = await admin.from('catalog_nodes').select('cover_image_url').eq('id', nodeId).single();
  if (!node?.cover_image_url) {
    await admin.from('catalog_nodes').update({ cover_image_url: publicUrl }).eq('id', nodeId);
    revalidatePath('/admin/products');
  }
  return row as { id: string; url: string; order_index: number } | null;
}

export async function saveVideo(nodeId: string, youtubeUrl: string) {
  const sb = await createSupabaseServerClient();
  await sb.from('product_videos').delete().eq('node_id', nodeId);
  if (youtubeUrl.trim()) {
    await sb.from('product_videos').insert({ node_id: nodeId, youtube_url: youtubeUrl.trim(), order_index: 0 });
  }
  revalidatePath('/products');
}

export async function deleteImage(imageId: string, nodeId: string) {
  const sb = await createSupabaseServerClient();
  await sb.from('product_images').delete().eq('id', imageId);
  revalidatePath(`/admin/products/${nodeId}`);
  revalidatePath('/products');
}
