import { clsx } from 'clsx';

type FilterOption<T extends string> = {
  id: T;
  label: string;
};

interface FilterOptionGroupProps<T extends string> {
  title: string;
  options: FilterOption<T>[];
  selectedIds: T[];
  onToggle: (id: T) => void;
  withTopMargin?: boolean;
}

export function FilterOptionGroup<T extends string>({
  title,
  options,
  selectedIds,
  onToggle,
  withTopMargin = false,
}: FilterOptionGroupProps<T>) {
  return (
    <>
      <div className={clsx('flex items-center justify-between', withTopMargin && 'mt-2')}>
        <span className="text-lg mt-1">{title}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {options.map(({ id, label }) => {
          const isSelected = selectedIds.includes(id);

          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm border text-nowrap transition-colors',
                isSelected
                  ? 'bg-tg-button-color text-tg-button-text-color border-tg-button-color'
                  : 'bg-tg-section-bg-color text-tg-text-color border-tg-text-color/10',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}
