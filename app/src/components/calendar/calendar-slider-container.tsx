export default function CalendarSliderContainer({ children }: React.PropsWithChildren) {
  return (
    <div className="flex-[0_0_100%] h-auto min-w-0 w-dvw">
      <div className="h-full overflow-y-auto scrollbar px-3 pb-28 pt-16">{children}</div>
    </div>
  );
}
