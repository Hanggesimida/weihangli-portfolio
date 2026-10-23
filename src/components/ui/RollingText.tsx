interface RollingTextProps {
  children: string;
  className?: string;
}

export function RollingText({ children, className }: RollingTextProps) {
  return (
    <span
      className={`relative inline-flex flex-col overflow-y-hidden px-[0.05em] ${className ?? ""}`}
      style={{ height: "1.3em", lineHeight: "1.3em" }}
    >
      <span className="group-hover:-translate-y-full transition-transform duration-[0.4s] ease-[cubic-bezier(.51,.92,.24,1.15)] will-change-transform">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-full group-hover:-translate-y-full transition-transform duration-[0.4s] ease-[cubic-bezier(.51,.92,.24,1.15)] will-change-transform"
      >
        {children}
      </span>
    </span>
  );
}
