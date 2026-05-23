// Loading animation
const shimmer =
  'before:absolute before:z-10 before:opacity-50 before:inset-0 before:-translate-x-full before:animate-[shimmer_1s_infinite] before:bg-gradient-to-r before:from-transparent before:via-tg-secondary-bg-color before:to-transparent';

export function SelectSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden block w-full py-2 px-4 bg-tg-section-bg-color rounded-lg`}>
      <span className="block text-lg leading-normal border opacity-0">Skeleton</span>
    </div>
  );
}

export function ScheduleSkeleton() {
  return (
    <div className={`${shimmer} w-full relative overflow-hidden flex flex-wrap px-3`}>
      <ScheduleHeaderSkeleton />
      <ScheduleDaySkeleton />
      <ScheduleDaySkeleton />
    </div>
  );
}

export function ScheduleHeaderSkeleton() {
  return (
    <div className="my-2 block w-full p-3.5 bg-tg-section-bg-color rounded-xl">
      <span className="block text-sm leading-normal border opacity-0">Skeleton</span>
    </div>
  );
}

function DayHeaderSkeleton() {
  return (
    <div className="flex w-full justify-between my-3 opacity-50">
      <div className="w-5 h-2 my-2 bg-tg-text-color rounded" />
      <div className="w-10 h-2 my-2 bg-tg-hint-color rounded" />
    </div>
  );
}

export function ScheduleDaySkeleton() {
  return (
    <>
      <DayHeaderSkeleton />
      <div className="flex w-full flex-col flex-wrap gap-1.5">
        <div className="block w-full h-20 bg-tg-section-bg-color rounded-2xl" />
        <div className="block w-full h-20 bg-tg-section-bg-color rounded-2xl" />
        <div className="block w-full h-20 bg-tg-section-bg-color rounded-2xl" />
        <div className="block w-full h-20 bg-tg-section-bg-color rounded-2xl" />
      </div>
    </>
  );
}

export function SearchInputSkeleton() {
  return (
    <div className={`${shimmer} w-full relative overflow-hidden`}>
      <div className="w-full py-2.5 px-3 bg-tg-section-bg-color text-lg border rounded-2xl border-tg-section-bg-color">
        <span className="opacity-0">Skeleton</span>
      </div>
    </div>
  );
}

export function SearchInputWithListSkeleton() {
  return (
    <div
      className={`${shimmer} relative w-full overflow-hidden bg-tg-section-bg-color rounded-2xl flex-1 flex flex-col flex-wrap`}
    >
      <div className="w-full border-b border-b-tg-section-separator-color">
        <div className="w-full py-2.5 px-3 text-lg border border-tg-section-bg-color">
          <span className="opacity-0">Skeleton</span>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute top-0 right-0 bottom-0 left-0">
          <div className="h-full overflow-hidden scrollbar">
            {[...Array(12).keys()].map((index) => (
              <div key={index}>
                <div className="text-lg py-2.5">
                  <span className="opacity-0">Skeleton</span>
                </div>
                <div className="w-full ms-3 h-px bg-tg-section-separator-color" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
