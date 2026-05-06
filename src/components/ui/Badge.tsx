interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "abandono" | "maltrato" | "negligencia" | "venta" | "crueldad";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-secondary text-primary",
  abandono: "bg-warning/15 text-warning",
  maltrato: "bg-danger/15 text-danger",
  negligencia: "bg-yellow-100 text-yellow-800",
  venta: "bg-purple/15 text-purple",
  crueldad: "bg-danger/20 text-danger",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
