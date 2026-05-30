import { NextRequest, NextResponse } from 'next/server';

import { dbRowToSwimEvent } from '@app/src/lib/mappers/swim-event.mapper';
import { createServerClient } from '@app/src/lib/supabase/server';
import { SwimEventRow } from '@app/src/types/swim-event-db';

export const revalidate = 3600;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing event id' }, { status: 400 });
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('swim_events').select<'*', SwimEventRow>('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      console.error(`[GET /api/events/${id}] Supabase error:`, error.message);
      return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }

    return NextResponse.json(dbRowToSwimEvent(data), {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error(`[GET /api/events/${id}] Unexpected error:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
