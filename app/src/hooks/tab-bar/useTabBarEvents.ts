import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { postEvent } from '@tma.js/sdk-react';

import { useSwiperStore } from '@store/swiperStore';

import { AppRoute, DataQuerySelector } from '@utils/consts';

export const useTabBarEvents = () => {
  const pathname = usePathname();

  const t = useTranslations('tab-bar');

  const { swiper, setSelectedMonthIndex, currMonthIndex, setSelectedWeekIndex, currWeekIndex, selectedWeekIndex } =
    useSwiperStore();
  const isOnCalendar = pathname === AppRoute.Home;

  const handleNavigationButtonClick = (
    event: React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    querySelector: DataQuerySelector.Today | DataQuerySelector.Tomorrow,
  ) => {
    if (!swiper) return;

    if (isOnCalendar) {
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation();

      // Navigate to current month slide (slide 0 = list, slides 1..N = months)
      if (currMonthIndex !== null) {
        setSelectedMonthIndex(currMonthIndex);
        swiper.slideTo(
          swiper.slides.findIndex((slide) => slide.hasAttribute(DataQuerySelector.SelectedMonthSlide)),
          300,
        );
      }
      return;
    }

    if (swiper.activeIndex === undefined || !swiper.slides || swiper.slides.length === 0) return;

    const handleTransitionEnd = () => {
      swiper.slides[swiper.activeIndex].querySelector(`[${querySelector}]`)?.scrollIntoView({ behavior: 'smooth' });
      swiper.off('transitionEnd', handleTransitionEnd);
    };

    const targetSlide = swiper.slides[swiper.activeIndex];
    const targetElement = targetSlide.querySelector(`[${querySelector}]`);

    if (targetSlide.hasAttribute(DataQuerySelector.SelectedMonthSlide)) {
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        setSelectedWeekIndex(currWeekIndex);
        swiper.on('transitionEnd', handleTransitionEnd);
      }
    } else {
      if (selectedWeekIndex !== currWeekIndex) {
        setSelectedWeekIndex(currWeekIndex);
      }
      swiper.slideTo(swiper.slides.findIndex((slide) => slide.hasAttribute(DataQuerySelector.SelectedMonthSlide)));
      swiper.on('transitionEnd', handleTransitionEnd);
    }
  };

  const handleDisableButtonClick = (event: React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, id: string) => {
    event.preventDefault();

    postEvent('web_app_open_popup', {
      title: t('popup-title'),
      message: t('popup-message'),
      buttons: [
        { id: `check_${id}`, type: 'default', text: t('popup-check-button') },
        { id: `close_${id}`, type: 'close' },
      ],
    });
  };

  return { pathname, handleDisableButtonClick, handleNavigationButtonClick };
};
