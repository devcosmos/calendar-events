import { RefObject, useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { ComboboxInput } from '@headlessui/react';
import clsx from 'clsx';

import { AppRoute } from '@utils/consts';

interface SearchInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  setQuery: (value: string) => void;
}

export default function SearchInput({ inputRef, query, setQuery }: SearchInputProps) {
  const t = useTranslations(AppRoute.Search);

  const pathname = usePathname();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setQuery(inputValue);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ComboboxInput
      ref={inputRef}
      name="last-name"
      autoComplete="family-name"
      autoCorrect="false"
      autoFocus
      placeholder={t('search-placeholder')}
      displayValue={() => query}
      onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
      onChange={(event) => setInputValue(event.target.value)}
      className={clsx(
        'block w-full appearance-none py-2.5 px-3 bg-tg-section-bg-color',
        'text-lg text-tg-text-color',
        'border border-transparent rounded-none',
        'focus:outline-none',
      )}
    />
  );
}
