import { cn } from "@/lib/utils";

interface ShieldIconProps {
  className?: string;
  variant?: "default" | "safe" | "warning" | "danger";
}

export const ShieldIcon = ({ className, variant = "default" }: ShieldIconProps) => {
  const colorClasses = {
    default: "text-primary",
    safe: "text-safe",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6", colorClasses[variant], className)}
    >
      <path
        d="M12 2L3 7V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V7L12 2Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {variant === "safe" && (
        <path
          d="M9 12L11 14L15 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {variant === "warning" && (
        <>
          <path
            d="M12 9V13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </>
      )}
      {variant === "danger" && (
        <>
          <path
            d="M9 9L15 15M15 9L9 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
};
