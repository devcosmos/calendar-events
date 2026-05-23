import { Ufo } from '@components/icon/light';

export default function SearchEmptyResult({
  title,
}: React.PropsWithChildren<{
  title: string;
}>) {
  return (
    <div className="h-full w-full flex flex-1 items-center">
      <div className="flex flex-wrap justify-center gap-2 text-center w-full">
        <Ufo className="!size-28 !fill-tg-subtitle-text-color !opacity-50" />
        <h2 className="text-2xl w-full text-tg-subtitle-text-color !opacity-50 whitespace-break-spaces">{title}</h2>
      </div>
    </div>
  );
}
