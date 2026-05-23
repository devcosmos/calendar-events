import { useEffect, useRef } from 'react';

export function useClientOnce(fn: () => void): void {
  const calledOnce = useRef(false);

  useEffect(() => {
    if (!calledOnce.current) {
      calledOnce.current = true;
      fn();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
