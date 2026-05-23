import { RequestMethod } from '@utils/api/endpoints';

export const sendRequest = async <TResponse, TBody>(
  url: string,
  body: TBody,
  method: RequestMethod,
  headers: HeadersInit = { 'Content-Type': 'application/json' },
  init?: RequestInit
): Promise<TResponse> => {
  try {
    let finalUrl = url;
    const fetchOptions: RequestInit = {
      method,
      headers,
      ...init,
    };

    if (method === RequestMethod.GET) {
      const query = new URLSearchParams(
        Object.entries(body as Record<string, unknown>)
          .reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
      ).toString();

      if (query) {
        finalUrl += `?${query}`;
      }
    } else {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(finalUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка запроса:', error);
    throw error;
  }
};
