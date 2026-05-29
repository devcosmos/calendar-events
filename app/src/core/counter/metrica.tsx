'use client';

import { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

const COUNTER_ID = 109489379;

export default function Metrika() {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    const url = pathName + (params && '?' + params);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ym(COUNTER_ID, 'hit', url);
  }, [pathName, searchParams]);

  return (
    <Script id="yandex-metrika">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym'); ym(${COUNTER_ID}, 'init', {webvisor:true, clickmap:true, accurateTrackBounce:true, trackLinks:true});`}
    </Script>
  );
}
