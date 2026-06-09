import clsx from 'clsx';

import { ArrowRight } from '@components/icon/outline';

import { DataQuerySelector } from '@utils/consts';
import { CalendarMonth } from '@utils/types';

interface CalendarMonthItemProps {
  month: CalendarMonth;
  label: string;
  isCurrent: boolean;
  isSelected: boolean;
  isPast: boolean;
  filteredCount: number;
  onClick: () => void;
}

export default function MonthButton({
  month,
  label,
  isCurrent,
  isSelected,
  isPast,
  filteredCount,
  onClick,
}: CalendarMonthItemProps) {
  return (
    <button
      className={clsx(
        'flex items-center justify-between gap-3',
        'relative w-full overflow-hidden',
        'px-1 py-1',
        'border border-tg-section-bg-color rounded-2xl',
        'bg-tg-section-bg-color text-tg-text-color',
      )}
      {...(isCurrent && { [DataQuerySelector.CurrentMonthButton]: '' })}
      onClick={onClick}
    >
      <div className="flex gap-3.5 items-center">
        <span className="border border-tg-text-color/25 rounded-full size-8 text-sm leading-none pt-[1px] flex justify-center items-center flex-shrink-0">
          {month.month}
        </span>
        <span
          className={clsx(
            'capitalize flex items-baseline text-lg font-normal leading-none text-nowrap',
            isPast && !isSelected && 'opacity-25',
            isCurrent && '!text-orange !opacity-100',
            isSelected && !isCurrent && 'text-tg-link-color !opacity-100',
          )}
        >
          {label}
          {filteredCount > 0 && <span className="text-base opacity-50">&nbsp;&mdash;&nbsp;{filteredCount}</span>}
        </span>
      </div>
      <ArrowRight className="size-5 !fill-tg-button-text-color" />
    </button>
  );
}
