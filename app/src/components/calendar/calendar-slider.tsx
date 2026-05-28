'use client';

import { useEffect, useRef } from 'react';

import { Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';

import CalendarMonthView from '@components/calendar/calendar-month';
import CalendarMonthList from '@components/calendar/calendar-month-list';
import CalendarSliderContainer from '@components/calendar/calendar-slider-container';
import FilterPanel from '@components/calendar/filter-panel';

import { useMainStore } from '@store/mainStore';
import { useSwiperStore } from '@store/swiperStore';

import { DataQuerySelector } from '@utils/consts';
import { CalendarMonth } from '@utils/types';

interface CalendarSliderProps {
  months: CalendarMonth[];
  currentMonthIndex: number;
}

export default function CalendarSlider({ months, currentMonthIndex }: CalendarSliderProps) {
  const setSwiper = useSwiperStore((s) => s.setSwiper);
  const selectedMonthIndex = useSwiperStore((s) => s.selectedMonthIndex);

  const { hintForSwiping, hideHintForSwiping } = useMainStore();

  const swiperRef = useRef<SwiperType | null>(null);

  const displayIndex = selectedMonthIndex ?? currentMonthIndex;

  const companyCountMap = months
    .flatMap((m) => m.events)
    .reduce<Record<string, number>>((acc, e) => {
      if (e.company) acc[e.company] = (acc[e.company] ?? 0) + 1;
      return acc;
    }, {});

  const allCompanies = Object.entries(companyCountMap)
    .filter(([, count]) => count >= 10)
    .map(([company]) => company)
    .sort();

  const cityCountMap = months
    .flatMap((m) => m.events)
    .reduce<Record<string, number>>((acc, e) => {
      const city = e.location.city?.trim();
      if (city) acc[city] = (acc[city] ?? 0) + 1;
      return acc;
    }, {});

  const allCities = Object.entries(cityCountMap)
    .filter(([, count]) => count > 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
    .map(([city]) => city);

  const reservoirTypes: Array<{ id: string; label: string }> = [];
  const reservoirCountMap = months
    .flatMap((m) => m.events)
    .reduce<Record<string, number>>((acc, e) => {
      const type = e.location.reservoir === 'Бассейн' ? 'pool' : 'openwater';
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    }, {});

  if (reservoirCountMap['pool']) reservoirTypes.push({ id: 'pool', label: 'Бассейн' });
  if (reservoirCountMap['openwater']) reservoirTypes.push({ id: 'openwater', label: 'Открытая вода' });

  // Only render prev/curr/next months
  const visibleSlides: { month: CalendarMonth; index: number }[] = [];
  if (months.length > 0) {
    if (displayIndex > 0) visibleSlides.push({ month: months[displayIndex - 1], index: displayIndex - 1 });
    visibleSlides.push({ month: months[displayIndex], index: displayIndex });
    if (displayIndex < months.length - 1)
      visibleSlides.push({ month: months[displayIndex + 1], index: displayIndex + 1 });
  }

  // Slide 0 is MonthList, then optionally prev month, then curr month
  const initialSwiperIndex = displayIndex > 0 ? 2 : 1;

  const hintScroll = (swiper: SwiperType) => {
    if (!swiper || swiper.destroyed) return;

    if (hintForSwiping) {
      const initialTranslate = swiper.getTranslate();
      const shift = initialTranslate - 50;

      swiper.translateTo(shift, 400, false, true);

      setTimeout(() => {
        if (!swiper || swiper.destroyed) return;
        swiper.translateTo(initialTranslate, 400, false, true);
      }, 400);
      swiper.on('slideChange', hideHintForSwiping);
    }
  };

  // First-load: scroll to today and show swipe hint
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      const swiper = swiperRef.current;
      if (!swiper || swiper.destroyed) return;
      swiper.slides[swiper.activeIndex]
        ?.querySelector(`[${DataQuerySelector.Today}]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        if (swiperRef.current && !swiperRef.current.destroyed) hintScroll(swiperRef.current);
      }, 1000);
    }, 100);
    return () => clearTimeout(scrollTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Swiper
      modules={[Mousewheel]}
      spaceBetween={10}
      slidesPerView={1}
      initialSlide={initialSwiperIndex}
      className="w-full h-full"
      mousewheel={{
        enabled: true,
        forceToAxis: true,
        releaseOnEdges: true,
        thresholdDelta: 10,
      }}
      onSwiper={(s) => {
        setSwiper(s);
        swiperRef.current = s;
      }}
      onSlidesUpdated={(swiper) => {
        const centerIdx = swiper.slides.findIndex((slide) => slide.hasAttribute(DataQuerySelector.SelectedMonthSlide));
        if (centerIdx === -1) return;
        // slideTo is a no-op if already at centerIdx (initial load), animates otherwise
        setTimeout(() => swiper.slideTo(centerIdx, 300), 50);
      }}
      onSlideChangeTransitionEnd={(swiper) => {
        // Скролл на первом и последнем слайде до текущей недели
        swiper.slides[swiper.activeIndex]
          .querySelector(`[${DataQuerySelector.CurrentMonthButton}]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }}
    >
      {/* Left edge: month list */}
      <SwiperSlide className="h-auto">
        <CalendarSliderContainer>
          <CalendarMonthList months={months} />
        </CalendarSliderContainer>
      </SwiperSlide>

      {/* Slides: prev / curr / next */}
      {visibleSlides.map(({ month, index }) => (
        <SwiperSlide
          className="h-auto"
          key={`${month.year}-${month.month}`}
          {...(index === displayIndex && { [DataQuerySelector.SelectedMonthSlide]: '' })}
        >
          <CalendarSliderContainer>
            <CalendarMonthView month={month} />
          </CalendarSliderContainer>
        </SwiperSlide>
      ))}

      {/* Right edge: filter panel */}
      <SwiperSlide className="h-auto">
        <CalendarSliderContainer>
          <FilterPanel companies={allCompanies} cities={allCities} reservoirTypes={reservoirTypes} />
        </CalendarSliderContainer>
      </SwiperSlide>
    </Swiper>
  );
}
