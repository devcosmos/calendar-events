import Alert from '@components/alert/alert';
import SearchSelection from '@components/search/search-selection';

import { getCachedEvents } from '@utils/api/data';
import { AppRoute } from '@utils/consts';

export default async function Search() {
  const events = await getCachedEvents();
  if (!events || Object.keys(events).length === 0) {
    return <Alert route={AppRoute.Search} title={'load-error'} />;
  }

  return <SearchSelection educationEntities={events} />;
}
