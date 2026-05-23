import CalendarView from '@components/calendar/calendar';
import PageWrapper from '@components/page-wrapper';

import { getCachedEvents } from '@utils/api/data';
import { getCurrentMonthIndex, groupEventsByMonth } from '@utils/calendarHelper';
import { AppRoute } from '@utils/consts';

export default async function Page() {
  const events = await getCachedEvents();
  const months = groupEventsByMonth(events ?? []);
  const currentMonthIndex = getCurrentMonthIndex(months);

  return (
    <PageWrapper title={AppRoute.Home} hideTitle back={false} removePadding>
      <CalendarView months={months} currentMonthIndex={currentMonthIndex} />
    </PageWrapper>
  );
}
