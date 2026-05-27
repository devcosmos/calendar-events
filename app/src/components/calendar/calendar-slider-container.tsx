export default function CalendarSliderContainer({ children }: React.PropsWithChildren) {
  return <div className="h-full overflow-y-auto scrollbar mx-3 pb-28 pt-16">{children}</div>;
}
