import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "card p-6",
        hover && "card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
