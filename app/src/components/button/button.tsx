import Link from 'next/link';

import clsx from 'clsx';

import { ArrowRight } from '@components/icon/outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string; // Если передан href — рендерим ссылку
  external?: boolean; // Открывать в новой вкладке
  outline?: boolean; // Outline Style
  addIcon?: boolean; // Добавить Chevron Right
}

export default function Button({
  href,
  external = false,
  outline,
  addIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  const buttonClasses = clsx(
    'w-full py-2 px-4 bg-tg-button-color flex items-center',
    'text-lg leading-normal text-tg-button-text-color ',
    'border rounded-lg border-tg-button-color',
    addIcon ? 'justify-between gap-3' : 'justify-center',
    outline && '!text-tg-link-color !border-tg-link-color bg-transparent',
    className,
  );

  const ActionButtonBody = (
    <>
      {children}
      {addIcon && (
        <ArrowRight
          className={clsx('!size-4 -me-1.5', outline ? '!fill-tg-link-color' : '!fill-tg-button-text-color')}
        />
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

  // В остальных случаях → обычная кнопка
  return (
    <button className={buttonClasses} {...props}>
      {ActionButtonBody}
    </button>
  );
}
