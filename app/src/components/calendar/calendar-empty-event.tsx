import { Ufo } from '@components/icon/outline';

export default function CalendarEmptyEvent({
  title,
}: React.PropsWithChildren<{
  title: string;
}>) {
  return (
    <div className="flex flex-col gap-8 items-center bg-tg-section-bg-color p-7 rounded-2xl">
      <Ufo className="size-16 text-tg-link-color animate-pulse" />
      <h3 className="text-lg whitespace-break-spaces leading-tight">{title}</h3>
    </div>
  );
}
