import { usePathname } from 'next/navigation';

import { useSwiperStore } from '@store/swiperStore';

import { AppRoute, DataQuerySelector } from '@utils/consts';

export const useTabBarEvents = () => {
  const pathname = usePathname();

  const { emblaApi, setSelectedMonthIndex, currMonthIndex } = useSwiperStore();
  const isOnCalendar = pathname === AppRoute.Home;

  const handleNavigationButtonClick = (
    event: React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    querySelector: DataQuerySelector.Today,
  ) => {
    if (!isOnCalendar || !emblaApi || currMonthIndex === null) return;

    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();

    setSelectedMonthIndex(currMonthIndex);

    const trySlideAndScroll = (retries = 10) => {
      if (!emblaApi) return;

      const centerIdx = emblaApi
        .slideNodes()
        .findIndex((slide) => slide.hasAttribute(DataQuerySelector.SelectedMonthSlide));
      if (centerIdx === -1) {
        if (retries > 0) setTimeout(() => trySlideAndScroll(retries - 1), 80);
        return;
      }

      const scrollToMarker = (slideIndex: number) => {
        const slide = emblaApi.slideNodes()[slideIndex];
        if (!slide) return false;

        const marker = slide.querySelector(`[${querySelector}]`);
        if (!marker) return false;

        marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
      };

      if (emblaApi.selectedScrollSnap() === centerIdx) {
        const didScroll = scrollToMarker(centerIdx);
        if (!didScroll && retries > 0) setTimeout(() => trySlideAndScroll(retries - 1), 80);
        return;
      }

      const handleSettle = () => {
        const didScroll = scrollToMarker(centerIdx);
        emblaApi.off('settle', handleSettle);
        if (!didScroll && retries > 0) setTimeout(() => trySlideAndScroll(retries - 1), 80);
      };

      emblaApi.on('settle', handleSettle);
      emblaApi.scrollTo(centerIdx);
    };

    trySlideAndScroll();
  };

  return { pathname, handleNavigationButtonClick };
};
