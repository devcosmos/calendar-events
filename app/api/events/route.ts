import { NextRequest, NextResponse } from 'next/server';

import { dbRowToSwimEvent } from '@app/src/lib/mappers/swim-event.mapper';
import { createServerClient } from '@app/src/lib/supabase/server';
import { SwimEventRow } from '@app/src/types/swim-event-db';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

export const revalidate = 3600;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const city = searchParams.get('city') ?? undefined;
  const from = searchParams.get('from') ?? undefined;
  const to = searchParams.get('to') ?? undefined;
  const rawLimit = searchParams.get('limit');

  if (from !== undefined && Number.isNaN(Date.parse(from))) {
    return NextResponse.json({ error: 'Invalid query param: from must be an ISO date string' }, { status: 400 });
  }
  if (to !== undefined && Number.isNaN(Date.parse(to))) {
    return NextResponse.json({ error: 'Invalid query param: to must be an ISO date string' }, { status: 400 });
  }

  let limit = DEFAULT_LIMIT;
  if (rawLimit !== null) {
    const parsed = Number(rawLimit);
    if (!Number.isInteger(parsed) || parsed < 1) {
      return NextResponse.json({ error: 'Invalid query param: limit must be a positive integer' }, { status: 400 });
    }
    limit = Math.min(parsed, MAX_LIMIT);
  }

  try {
    const supabase = createServerClient();
    let query = supabase
      .from('swim_events')
      .select<'*', SwimEventRow>('*')
      .order('start_at', { ascending: true })
      .limit(limit);

    if (city !== undefined) {
      query = query.eq('city', city);
    }
    if (from !== undefined) {
      query = query.gte('start_at', from);
    }
    if (to !== undefined) {
      query = query.lte('start_at', to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET /api/events] Supabase error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    const events = (data ?? []).map(dbRowToSwimEvent);

    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[GET /api/events] Unexpected error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
