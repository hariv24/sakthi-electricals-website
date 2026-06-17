import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

const VISITOR_COOKIE = 'se_vid';
const SESSION_COOKIE = 'se_sid';
const YEAR = 60 * 60 * 24 * 365;
const HALF_HOUR = 60 * 30;

function deviceFromUA(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|android|iphone/i.test(ua)) return 'mobile';
  return 'desktop';
}

export async function POST(req: NextRequest) {
  const { path, referrer } = await req.json().catch(() => ({ path: null, referrer: null }));
  if (!path || typeof path !== 'string') {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const visitorId = req.cookies.get(VISITOR_COOKIE)?.value ?? randomUUID();
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value ?? randomUUID();
  const ua = req.headers.get('user-agent') ?? '';
  const device = deviceFromUA(ua);
  const country = req.headers.get('x-vercel-ip-country') ?? null;

  let referrerHost: string | null = null;
  if (referrer && typeof referrer === 'string') {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, '');
      if (!host.includes('sakthielectricals.com') && !host.includes('thinkgalactic.in')) referrerHost = host;
    } catch { /* not a valid URL — ignore */ }
  }

  const admin = await createSupabaseAdminClient();
  await admin.from('page_views').insert({
    path, visitor_id: visitorId, session_id: sessionId,
    device, country, referrer: referrerHost,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(VISITOR_COOKIE, visitorId, { maxAge: YEAR, sameSite: 'lax', path: '/' });
  res.cookies.set(SESSION_COOKIE, sessionId, { maxAge: HALF_HOUR, sameSite: 'lax', path: '/' });
  return res;
}
