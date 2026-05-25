import Link from 'next/link';

import { postEvent } from '@tma.js/sdk-react';
import clsx from 'clsx';

import { AppRoute } from '@utils/consts';

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
  return (
    <Link
      href={href}
      onMouseDown={() => postEvent('web_app_trigger_haptic_feedback', { type: 'selection_change' })}
      className={clsx(
        'min-w-14 h-14 relative rounded-full pb-1.5 p-1',
        'flex flex-1 flex-col items-center justify-center gap-1.5',
        'text-xs leading-none font-normal',
        'transition-transform duration-200 ease-in-out',
        'group active:scale-95',
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
