import clsx from 'clsx';

import { ChevronDown } from '@components/icon/regular';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

export default function Select({ placeholder, children, ...rest }: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        className={clsx(
          'block w-full appearance-none py-2 px-4 bg-tg-section-bg-color transition-colors',
          'text-lg leading-normal',
          'border rounded-lg border-tg-section-bg-color',
          'focus:outline-none',
          rest.value ? 'text-tg-text-color' : 'text-tg-section-header-text-color',
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDown
        className={clsx(
          'pointer-events-none absolute top-3 right-3 size-5 transition-all',
          rest.value ? 'fill-tg-text-color' : 'fill-tg-section-header-text-color',
        )}
      />
    </div>
  );
}
