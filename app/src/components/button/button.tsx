import Link from 'next/link';

import clsx from 'clsx';

import { ArrowRight } from '@components/icon/outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string; // Если передан href — рендерим ссылку
  external?: boolean; // Открывать в новой вкладке
  addIcon?: boolean; // Добавить Chevron Right
}

export default function Button({ href, external = false, addIcon, className, children, ...props }: ButtonProps) {
  const buttonClasses = clsx(
    'relative w-full flex items-center overflow-hidden',
    'py-4 px-3.5',
    'border border-tg-button-color rounded-2xl',
    'bg-tg-button-color text-tg-button-text-color',
    'text-lg font-normal leading-none text-nowrap',
    addIcon ? 'justify-between gap-3' : 'justify-center',
    className,
  );

  const ActionButtonBody = (
    <>
      {children}
      {addIcon && <ArrowRight className={clsx('!size-5 -me-2 !fill-tg-button-text-color')} />}
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
