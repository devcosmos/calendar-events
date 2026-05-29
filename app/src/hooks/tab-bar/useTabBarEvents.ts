import { usePathname } from 'next/navigation';

import { useSwiperStore } from '@store/swiperStore';

import { AppRoute, DataQuerySelector } from '@utils/consts';

export const useTabBarEvents = () => {
  const pathname = usePathname();

  const { swiper, setSelectedMonthIndex, currMonthIndex } = useSwiperStore();
  const isOnCalendar = pathname === AppRoute.Home;

  const handleNavigationButtonClick = (
    event: React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    querySelector: DataQuerySelector.Today,
  ) => {
    if (!isOnCalendar || !swiper || swiper.destroyed || currMonthIndex === null) return;

    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();

    setSelectedMonthIndex(currMonthIndex);

    const trySlideAndScroll = (retries = 10) => {
      if (!swiper || swiper.destroyed || !swiper.slides) return;

      const centerIdx = swiper.slides.findIndex((slide) => slide.hasAttribute(DataQuerySelector.SelectedMonthSlide));
      if (centerIdx === -1) {
        if (retries > 0) setTimeout(() => trySlideAndScroll(retries - 1), 80);
        return;
      }

      const scrollToMarker = (slideIndex: number) => {
        if (!swiper || swiper.destroyed || !swiper.slides || !swiper.slides[slideIndex]) return false;

        const marker = swiper.slides[slideIndex].querySelector(`[${querySelector}]`);
        if (!marker) return false;

        marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
      };

      if (swiper.activeIndex === centerIdx) {
        const didScroll = scrollToMarker(centerIdx);
        if (!didScroll && retries > 0) setTimeout(() => trySlideAndScroll(retries - 1), 80);
        return;
      }

      const handleTransitionEnd = () => {
        const didScroll = scrollToMarker(centerIdx);
        swiper.off('transitionEnd', handleTransitionEnd);
        if (!didScroll && retries > 0) setTimeout(() => trySlideAndScroll(retries - 1), 80);
      };

      swiper.on('transitionEnd', handleTransitionEnd);
      swiper.slideTo(centerIdx, 300);
    };

    trySlideAndScroll();
  };

  return { pathname, handleNavigationButtonClick };
};
