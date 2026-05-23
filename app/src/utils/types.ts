export type EventLocation = {
  city: string;
  map_url: string;
  reservoir: string | null;
  is_abroad: boolean;
};

export type SwimEvent = {
  id: string;
  name: string;
  type: 'competition';
  price: number;
  registration_due: string;
  start_date: string;
  end_date: string;
  company: string | null;
  is_uws: boolean;
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
