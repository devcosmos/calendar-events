import clsx from 'clsx';

type ButtonSize = 'sm' | 'lg';

interface BlurButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
}

export default function HeaderButton({ size = 'lg', className, children, ...props }: BlurButtonProps) {
  return (
    <button
      className={clsx(
        'flex items-center justify-center',
        'text-nowrap !leading-none capitalize',
        'w-auto relative backdrop-blur-md overflow-hidden',
        'border border-tg-text-color/10 rounded-full',
        'bg-tg-section-bg-color/10 text-tg-text-color',
        size === 'lg' && 'h-12 px-4 text-lg',
        size === 'sm' && 'h-8 py-1 px-3 text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
