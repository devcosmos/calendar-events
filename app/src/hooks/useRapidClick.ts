import { useCallback, useRef, useState } from 'react';

type UseRapidClickOptions = {
  count: number;
  interval: number;
  onSuccess: () => void;
};

export function useRapidClick({ count, interval, onSuccess }: UseRapidClickOptions) {
  const [, setClickTimestamps] = useState<number[]>([]);

  const triggeredRef = useRef(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerClick = useCallback(() => {
    const now = Date.now();

    setClickTimestamps((prev) => {
      const updated = [...prev, now].filter((t) => now - t < interval);

      if (!triggeredRef.current && updated.length >= count) {
        triggeredRef.current = true;

        setTimeout(onSuccess, 0);

        if (resetTimeout.current) {
          clearTimeout(resetTimeout.current);
        }
        resetTimeout.current = setTimeout(() => {
          triggeredRef.current = false;
        }, interval);

        return [];
      }

      return updated;
    });
  }, [count, interval, onSuccess]);

  return registerClick;
}
