import { SwimEvent } from '@utils/types';

export enum ReservoirType {
  Pool = 'pool',
  OpenWater = 'openwater',
}

export enum AbroadFilter {
  Russia = 'russia',
  Abroad = 'abroad',
}

export type EventFilters = {
  selectedCompanies: string[];
  selectedCities: string[];
  selectedReservoirTypes: ReservoirType[];
  selectedAbroadFilters: AbroadFilter[];
};

export const getReservoirType = (event: SwimEvent): ReservoirType => {
  return event.location.reservoir === 'Бассейн' ? ReservoirType.Pool : ReservoirType.OpenWater;
};

export const getAbroadFilter = (event: SwimEvent): AbroadFilter => {
  return event.location.is_abroad ? AbroadFilter.Abroad : AbroadFilter.Russia;
};

export const isEventMatchingFilters = (event: SwimEvent, filters: EventFilters): boolean => {
  const companyMatches =
    filters.selectedCompanies.length === 0 ||
    (event.company !== null && filters.selectedCompanies.includes(event.company));

  const cityMatches = filters.selectedCities.length === 0 || filters.selectedCities.includes(event.location.city);

  const reservoirType = getReservoirType(event);
  const reservoirMatches =
    filters.selectedReservoirTypes.length === 0 || filters.selectedReservoirTypes.includes(reservoirType);

  const abroadType = getAbroadFilter(event);
  const abroadMatches =
    filters.selectedAbroadFilters.length === 0 || filters.selectedAbroadFilters.includes(abroadType);

  return companyMatches && cityMatches && reservoirMatches && abroadMatches;
};

export const filterEventsByFilters = (events: SwimEvent[], filters: EventFilters): SwimEvent[] => {
  return events.filter((event) => isEventMatchingFilters(event, filters));
};

export const hasActiveEventFilters = (filters: EventFilters): boolean => {
  return (
    filters.selectedCompanies.length > 0 ||
    filters.selectedCities.length > 0 ||
    filters.selectedReservoirTypes.length > 0 ||
    filters.selectedAbroadFilters.length > 0
  );
};
