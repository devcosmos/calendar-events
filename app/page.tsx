import CalendarView from '@components/calendar/calendar';
import PageWrapper from '@components/page-wrapper';

import { getCachedEvents } from '@utils/api/data';
import { getCurrentMonthIndex, groupEventsByMonth } from '@utils/calendarHelper';
import { AppRoute } from '@utils/consts';

interface PageProps {
  searchParams?: Promise<{ eventId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const events = await getCachedEvents();
  const months = groupEventsByMonth(events ?? []);
  const params = searchParams ? await searchParams : undefined;
  const targetEventId = params?.eventId;

  const targetMonthIndex = targetEventId
    ? months.findIndex((month) => month.events.some((event) => event.id === targetEventId))
    : -1;

  const currentMonthIndex = getCurrentMonthIndex(months);
  const normalizedTargetMonthIndex = targetMonthIndex >= 0 ? targetMonthIndex : undefined;
  const normalizedTargetEventId = normalizedTargetMonthIndex !== undefined ? targetEventId : undefined;

  return (
    <PageWrapper title={AppRoute.Home} hideTitle back={false} className="!p-0">
      <CalendarView
        months={months}
        currentMonthIndex={currentMonthIndex}
        targetMonthIndex={normalizedTargetMonthIndex}
        targetEventId={normalizedTargetEventId}
      />
    </PageWrapper>
  );
}
