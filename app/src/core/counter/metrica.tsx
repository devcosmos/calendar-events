'use client';

import { useEffect, useRef } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    ym?: (counterId: number, methodName: string, ...args: unknown[]) => void;
  }
}

const COUNTER_ID = 109489379;

export default function Metrika() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const skipFirstHit = useRef(true);

  useEffect(() => {
    if (!window.ym) return;

    if (skipFirstHit.current) {
      skipFirstHit.current = false;
      return;
    }

    window.ym(COUNTER_ID, 'hit', window.location.href);
  }, [pathName, searchParams]);

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym'); ym(${COUNTER_ID}, 'init', {webvisor:true, clickmap:true, accurateTrackBounce:true, trackLinks:true});`}
    </Script>
  );
}
