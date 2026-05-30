export type EventLocation = {
  city: string;
  map_url: string | null;
  reservoir: string | null;
  is_abroad: boolean;
};

export type Company = {
  name: string;
  url: string | null;
};

export type SwimEvent = {
  id: string;
  name: string;
  start_at: string;
  end_at: string;
  price: number;
  distances: string[];
  registration_url: string | null;
  company: Company | null;
  location: EventLocation;
};

export type CalendarMonth = {
  year: number;
  month: number; // 1-12
  events: SwimEvent[];
};

export type User = {
  _id: string; // FROM DATABASE
  id: string; // FROM TG
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  last_viewed_post_id?: string;
  updatedAt?: string;
};

export type SwimEventRow = {
  id: string;
  name: string;
  start_at: string;
  end_at: string;
  price: number | null;
  distances: string[] | null;
  registration_url: string | null;
  company_name: string | null;
  company_url: string | null;
  city: string;
  map_url: string | null;
  reservoir: string | null;
  is_abroad: boolean | null;
  source_provider: string | null;
  source_url: string | null;
  source_event_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};
