import { isDev } from '@utils/consts';

export enum RequestMethod {
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
}

export const FRONTEND_URL = 'https://swim-calendar-alpha.vercel.app';
export const API_BACKEND_URL = 'https://swim-calendar-alpha.vercel.app/api';
export const TG_BOT_NAME = isDev ? 'Skshfntorps_bot' : 'swim_calendar_bot';

export const TG_CHAT_NAME = isDev ? 'test_schedule_chat' : 'swimcosmos';
export const TG_CHANNEL_NAME = 'swim_calendar';
export const TG_MINI_APP_NAME = isDev ? 'blablabla' : 'swim_calendar_app';

export const ENDPOINTS = {
  BACKEND: {
    USER: `${API_BACKEND_URL}/user`,
    POST: `${API_BACKEND_URL}/post/`,
  },
  TG: {
    SUPPORT: `/${TG_CHAT_NAME}`,
    SUPPORT_FULL: `https://t.me/${TG_CHAT_NAME}`,
    CHANNEL_SHORT_LINK: `/${TG_CHANNEL_NAME}`,
    CHANNEL_FULL_LINK: `https://t.me/${TG_CHANNEL_NAME}`,
    TMA_LINK: `https://t.me/${TG_BOT_NAME}/${TG_MINI_APP_NAME}`,
    SHARE: (url: string, text: string) => `/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
};
