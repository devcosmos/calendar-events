import Link from 'next/link';

import clsx from 'clsx';

import { ArrowRight } from '@components/icon/outline';

type ButtonVariant = 'default' | 'outline' | 'blur';
type ButtonSize = 'md' | 'lg' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string; // Если передан href — рендерим ссылку
  external?: boolean; // Открывать в новой вкладке
  variant?: ButtonVariant;
  size?: ButtonSize;
  addIcon?: boolean; // Добавить Chevron Right
}

export default function Button({
  href,
  external = false,
  variant = 'default',
  size = 'md',
  addIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  const buttonClasses = clsx(
    'w-full flex items-center border overflow-hidden relative',
    'text-nowrap leading-none',
    size === 'md' && 'py-2 px-4 text-lg rounded-lg',
    size === 'lg' && 'h-12 px-4 text-lg rounded-full',
    size === 'sm' && 'h-8 py-1 px-3 text-sm rounded-full',
    addIcon ? 'justify-between gap-3' : 'justify-center',
    variant === 'default' && 'bg-tg-button-color border-tg-button-color text-tg-button-text-color',
    variant === 'outline' && 'bg-transparent border-tg-link-color text-tg-link-color',
    variant === 'blur' && 'bg-tg-section-bg-color/10 backdrop-blur-md border-tg-text-color/10 text-tg-text-color',
    className,
  );

  const ActionButtonBody = (
    <>
      {children}
      {addIcon && (
        <ArrowRight
          className={clsx(
            '!size-5 -me-2',
            variant === 'outline' ? '!fill-tg-link-color' : '!fill-tg-button-text-color',
          )}
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
