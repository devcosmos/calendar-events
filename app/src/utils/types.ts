export type EventLocation = {
  city: string;
  map_url: string;
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
