import { SwimEvent } from '@utils/types';

export enum ReservoirType {
  Pool = 'pool',
  OpenWater = 'openwater',
}

export type EventFilters = {
  selectedCompanies: string[];
  selectedCities: string[];
  selectedReservoirTypes: ReservoirType[];
};

export const RESERVOIR_TYPE_LABELS: Record<ReservoirType, string> = {
  [ReservoirType.Pool]: 'Бассейн',
  [ReservoirType.OpenWater]: 'Открытая вода',
};

export const getReservoirType = (event: SwimEvent): ReservoirType => {
  return event.location.reservoir === 'Бассейн' ? ReservoirType.Pool : ReservoirType.OpenWater;
};

export const isEventMatchingFilters = (event: SwimEvent, filters: EventFilters): boolean => {
  const companyMatches =
    filters.selectedCompanies.length === 0 ||
    (event.company !== null && filters.selectedCompanies.includes(event.company));

  const cityMatches = filters.selectedCities.length === 0 || filters.selectedCities.includes(event.location.city);

  const reservoirType = getReservoirType(event);
  const reservoirMatches =
    filters.selectedReservoirTypes.length === 0 || filters.selectedReservoirTypes.includes(reservoirType);

  return companyMatches && cityMatches && reservoirMatches;
};

export const filterEventsByFilters = (events: SwimEvent[], filters: EventFilters): SwimEvent[] => {
  return events.filter((event) => isEventMatchingFilters(event, filters));
};

export const hasActiveEventFilters = (filters: EventFilters): boolean => {
  return (
    filters.selectedCompanies.length > 0 ||
    filters.selectedCities.length > 0 ||
    filters.selectedReservoirTypes.length > 0
  );
};
