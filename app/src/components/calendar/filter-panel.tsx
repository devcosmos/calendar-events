'use client';

import { useFilterStore } from '@store/filterStore';

interface FilterPanelProps {
  companies: string[];
}

export default function FilterPanel({ companies }: FilterPanelProps) {
  const selectedCompanies = useFilterStore((s) => s.selectedCompanies);
  const toggleCompany = useFilterStore((s) => s.toggleCompany);
  const clearFilters = useFilterStore((s) => s.clearFilters);

  const hasActiveFilters = selectedCompanies.length > 0;

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-tg-hint-color uppercase tracking-wide">Компании</span>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-tg-link-color">
            Сбросить
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {companies.map((company) => {
          const isSelected = selectedCompanies.includes(company);
          return (
            <button
              key={company}
              onClick={() => toggleCompany(company)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                isSelected
                  ? 'bg-tg-button-color text-tg-button-text-color border-tg-button-color'
                  : 'bg-tg-section-bg-color text-tg-text-color border-tg-text-color/10'
              }`}
            >
              {company}
            </button>
          );
        })}
      </div>
    </div>
  );
}
