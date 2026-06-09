import Link from 'next/link';

import { Switch } from '@headlessui/react';

import { ArrowRight } from '@components/icon/outline';

import { cn } from '@utils/helper';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string; // Левый заголовок
  value?: string; // Значение поля для правой стороны, если нет, просто выводим ChevronRight
  href?: string; // Если передан href — рендерим ссылку
  external?: boolean; // Открывать в новой вкладке
  enabled?: boolean | null; // Используется для превращения пункта в switch
  setEnabled?: (isEnabled: boolean) => void; // Используется для превращения пункта в switch
}

export default function ActionButton({
  title,
  value,
  href,
  external = false,
  enabled = null,
  setEnabled,
  className,
  children,
  ...props
}: ActionButtonProps) {
  const buttonClasses = cn(
    'w-full max-w-full flex justify-between items-center gap-3',
    'py-4 px-3.5',
    'border border-tg-section-bg-color rounded-2xl',
    'bg-tg-section-bg-color text-tg-text-color',
    'text-lg font-normal leading-[1.125]',
    className,
  );

  const ActionButtonBody = (
    <>
      <span className="flex items-center gap-4 py-0.5 overflow-hidden">
        {children}
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{title}</span>
      </span>
      {value ? (
        <span className="text-tg-link-color text-end whitespace-nowrap">{value}</span>
      ) : (
        <ArrowRight className={cn('-me-1.5 fill-tg-button-text-color')} />
      )}
    </>
  );

  // Если передан href (и external === true) → создаём <a> для внешних ссылок
  if (href && external) {
    return (
      <a href={href} className={buttonClasses} target="_blank" rel="noopener noreferrer">
        {ActionButtonBody}
      </a>
    );
  }

  // Если передан href (и external === false) → создаём <Link> для внутренней навигации
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {ActionButtonBody}
      </Link>
    );
  }

  // Если передан enabled и setEnabled → создаём <Switch> для управления состоянием
  if (enabled !== null && setEnabled) {
    return (
      <Switch className={cn(buttonClasses, 'group')} checked={enabled} onChange={setEnabled}>
        <span className="flex items-center gap-4 overflow-hidden">
          {children}
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">{title}</span>
        </span>
        <div className="inline-flex h-7 w-12 items-center rounded-full transition bg-tg-secondary-bg-color group-data-checked:bg-tg-link-color">
          <span className="size-5 translate-x-1 rounded-full bg-tg-button-text-color transition group-data-checked:translate-x-6" />
        </div>
      </Switch>
    );
  }

  // В остальных случаях → обычная кнопка
  return (
    <button className={buttonClasses} {...props}>
      {ActionButtonBody}
    </button>
  );
}
