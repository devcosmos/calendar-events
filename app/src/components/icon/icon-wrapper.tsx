
export default function IconWrapper({
  className,
  children,
  width = 512,
  height = 512,
  ...rest
}: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      className={`size-5 fill-tg-text-color flex-shrink-0 ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      {...rest}
    >
      {children}
    </svg>
  );
}
