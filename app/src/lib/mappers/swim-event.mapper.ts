import { SwimEventRow } from '@app/src/types/swim-event-db';

import { SwimEvent } from '@utils/types';

export function dbRowToSwimEvent(row: SwimEventRow): SwimEvent {
  return {
    id: row.id,
    name: row.name,
    start_at: row.start_at,
    end_at: row.end_at,
    price: row.price ?? 0,
    distances: row.distances ?? [],
    registration_url: row.registration_url,
    company: row.company_name ? { name: row.company_name, url: row.company_url ?? null } : null,
    location: {
      city: row.city,
      map_url: row.map_url ?? '',
      reservoir: row.reservoir,
      is_abroad: row.is_abroad ?? false,
    },
  };
}
