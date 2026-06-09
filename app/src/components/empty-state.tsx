import { cn } from '@utils/helper';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
}

export default function EmptyState({ icon, title }: EmptyStateProps) {
  return (
    <div className="h-2/3 w-full flex items-center flex-1 shrink-0">
      <div className="flex flex-col items-center w-full justify-center text-center gap-8">
        <div
          className={cn(
            'bg-tg-section-bg-color rounded-full size-48 text-tg-link-color flex items-center justify-center',
            '[&>svg]:size-24 [&>svg]:animate-pulse',
          )}
        >
          {icon}
        </div>
        <p className="text-lg whitespace-break-spaces leading-tight mb-7 px-2">{title}</p>
      </div>
    </div>
  );
}
