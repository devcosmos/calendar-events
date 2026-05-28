import IconWrapper from '@components/icon/icon-wrapper';

export function ArrowDown({ ...rest }: React.SVGAttributes<SVGElement>) {
  return (
    <IconWrapper {...rest}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.43 8.512a.75.75 0 0 1 1.058-.081L12 14.012l6.512-5.581a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6a.75.75 0 0 1-.081-1.057"
        clipRule="evenodd"
      />
    </IconWrapper>
  );
}
