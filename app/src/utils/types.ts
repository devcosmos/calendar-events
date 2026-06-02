export type EventLocation = {
  city: string;
  region: string | null;
  address: string;
  map_url: string;
  type: 'ow' | 'pool' | 'ice' | 'aquathlon';
  is_abroad: boolean;
};

export type Company = {
  name: string;
  url: string | null;
};

export type SwimEvent = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
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
  start_date: string;
  end_date: string;
  registration_url: string | null;
  company_name: string | null;
  company_url: string | null;
  city: string;
  region: string | null;
  address: string;
  map_url: string;
  type: 'ow' | 'pool' | 'ice' | 'aquathlon';
  is_abroad: boolean;
};
