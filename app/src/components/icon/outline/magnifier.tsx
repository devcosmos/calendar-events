import IconWrapper from '@components/icon/icon-wrapper';

export function Magnifier({ ...rest }: React.SVGAttributes<SVGElement>) {
  return (
    <IconWrapper {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11.5" cy="11.5" r="9.5" />
        <path strokeLinecap="round" d="m20 20l2 2" />
      </g>
    </IconWrapper>
  );
}
