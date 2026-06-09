import { useRef } from 'react';

import Link from 'next/link';

import { postEvent } from '@tma.js/sdk-react';

import { AppRoute } from '@utils/consts';
import { cn } from '@utils/helper';

interface TapBarButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: AppRoute;
  title?: string;
  isActive?: boolean;
  isUnread?: boolean;
  isDisabled?: boolean;
}

export default function TapBarButton({
  href,
  title,
  isActive = false,
  isUnread = false,
  isDisabled = false,
  children,
  ...rest
}: TapBarButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseDown = () => {
    postEvent('web_app_trigger_haptic_feedback', { type: 'selection_change' });

    const el = ref.current;
    if (!el) return;

    el.classList.add('animate-[scalingSmall_0.3s]');
    el.addEventListener('animationend', () => el.classList.remove('animate-[scalingSmall_0.3s]'), { once: true });
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseDown={handleMouseDown}
      className={cn(
        'relative min-w-14 h-14 flex flex-1 flex-col items-center justify-center gap-1.5',
        'p-1 pb-2 rounded-full',
        'text-[11px] font-normal leading-none',
        'origin-center will-change-transform',
        isDisabled && 'opacity-25',
        isActive ? 'bg-tg-hint-color/10 text-tg-link-color' : 'text-tg-hint-color',
        isUnread &&
          'before:w-2.5 before:h-2.5 before:rounded-full before:absolute before:bg-orange before:top-2 before:right-6',
      )}
      {...rest}
    >
      <div className="flex justify-center items-center">{children}</div>
      {title}
    </Link>
  );
}
