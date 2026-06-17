import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

const VISITOR_COOKIE = 'se_vid';
const SESSION_COOKIE = 'se_sid';
const YEAR = 60 * 60 * 24 * 365;
const HALF_HOUR = 60 * 30;

export async function POST(req: NextRequest) {
  const { path } = await req.json().catch(() => ({ path: null }));
  if (!path || typeof path !== 'string') {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const visitorId = req.cookies.get(VISITOR_COOKIE)?.value ?? randomUUID();
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value ?? randomUUID();

  const admin = await createSupabaseAdminClient();
  await admin.from('page_views').insert({ path, visitor_id: visitorId, session_id: sessionId });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(VISITOR_COOKIE, visitorId, { maxAge: YEAR, sameSite: 'lax', path: '/' });
  res.cookies.set(SESSION_COOKIE, sessionId, { maxAge: HALF_HOUR, sameSite: 'lax', path: '/' });
  return res;
}
