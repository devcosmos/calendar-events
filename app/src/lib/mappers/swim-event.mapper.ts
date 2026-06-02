import { SwimEvent, SwimEventRow } from '@utils/types';

export function dbRowToSwimEvent(row: SwimEventRow): SwimEvent {
  return {
    id: row.id,
    name: row.name,
    start_date: row.start_date,
    end_date: row.end_date,
    registration_url: row.registration_url,
    company: row.company_name ? { name: row.company_name, url: row.company_url ?? null } : null,
    location: {
      city: row.city,
      region: row.region,
      address: row.address,
      map_url: row.map_url,
      type: row.type,
      is_abroad: row.is_abroad,
    },
  };
}
