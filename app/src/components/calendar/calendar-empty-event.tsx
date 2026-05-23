export default function CalendarEmptyEvent({
  title,
}: React.PropsWithChildren<{
  title: string;
}>) {
  return (
    <div className="flex bg-tg-section-bg-color p-1 rounded-2xl">
      <h3 className="py-7 px-3 w-full text-tg-hint-color text-sm text-center">{title}</h3>
    </div>
  );
}
