import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { postEvent } from '@tma.js/sdk-react';

import { useSwiperStore } from '@store/swiperStore';

import { AppRoute, DataQuerySelector } from '@utils/consts';

export const useTabBarEvents = () => {
  const pathname = usePathname();

  const t = useTranslations('tab-bar');

  const { swiper, setSelectedMonthIndex, currMonthIndex } = useSwiperStore();
  const isOnCalendar = pathname === AppRoute.Home;

  const handleNavigationButtonClick = (
    event: React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    querySelector: DataQuerySelector.Today,
  ) => {
    if (!isOnCalendar || !swiper) return;

    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();

    const selectedSlideIndex = swiper.slides.findIndex((slide) =>
      slide.hasAttribute(DataQuerySelector.SelectedMonthSlide),
    );
    if (selectedSlideIndex === -1) return;

    const scrollToToday = (slideIndex: number) => {
      if (slideIndex < 0 || !swiper.slides[slideIndex]) return;
      swiper.slides[slideIndex]
        .querySelector(`[${querySelector}]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    if (currMonthIndex !== null) {
      setSelectedMonthIndex(currMonthIndex);
    }

    if (swiper.activeIndex === selectedSlideIndex) {
      scrollToToday(selectedSlideIndex);
      return;
    }

    const handleTransitionEnd = () => {
      scrollToToday(selectedSlideIndex);
      swiper.off('transitionEnd', handleTransitionEnd);
    };

    swiper.on('transitionEnd', handleTransitionEnd);
    swiper.slideTo(selectedSlideIndex, 300);
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
