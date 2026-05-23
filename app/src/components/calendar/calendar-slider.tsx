'use client';

import { useState } from 'react';

import { Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import CalendarMonthView from '@components/calendar/calendar-month';
import CalendarMonthList from '@components/calendar/calendar-month-list';
import CalendarSliderContainer from '@components/calendar/calendar-slider-container';

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

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const displayIndex = selectedMonthIndex ?? currentMonthIndex;

  // Only render prev/curr/next months
  const visibleSlides: { month: CalendarMonth; index: number }[] = [];
  if (months.length > 0) {
    if (displayIndex > 0) visibleSlides.push({ month: months[displayIndex - 1], index: displayIndex - 1 });
    visibleSlides.push({ month: months[displayIndex], index: displayIndex });
    if (displayIndex < months.length - 1)
      visibleSlides.push({ month: months[displayIndex + 1], index: displayIndex + 1 });
  }

  return (
    <Swiper
      modules={[Mousewheel]}
      spaceBetween={10}
      slidesPerView={1}
      className="w-full h-full pt-[4.1875rem]"
      mousewheel={{
        enabled: true,
        forceToAxis: true,
        releaseOnEdges: true,
        thresholdDelta: 10,
      }}
      onSwiper={setSwiper}
      onSlidesUpdated={(swiper) => {
        const centerIdx = swiper.slides.findIndex((slide) => slide.hasAttribute(DataQuerySelector.SelectedMonthSlide));
        if (centerIdx === -1) return;

        if (isFirstLoad) {
          swiper.slideTo(centerIdx, 0);
          setIsFirstLoad(false);
        } else {
          setTimeout(() => swiper.slideTo(centerIdx, 300), 50);
        }
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

      {/* Right edge: month list */}
      <SwiperSlide className="h-auto">
        <CalendarSliderContainer>
          <CalendarMonthList months={months} />
        </CalendarSliderContainer>
      </SwiperSlide>
    </Swiper>
  );
}
