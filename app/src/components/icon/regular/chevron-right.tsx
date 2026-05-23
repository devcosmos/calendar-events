import IconWrapper from '@components/icon/icon-wrapper';

export default function ChevronRight({ ...rest }: React.SVGAttributes<SVGElement>) {
  return (
    <IconWrapper width="320" {...rest}>
      <path d="M305 239c9.4 9.4 9.4 24.6 0 33.9L113 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l175-175L79 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L305 239z" />
    </IconWrapper>
  );
}
