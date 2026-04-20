import { ReactNode } from "react";

interface StatusBadgeProps {
  children: ReactNode;
  type?: "success" | "warning" | "error" | "info" | "live";
  className?: string;
}

export default function StatusBadge({ children, type = "info", className = "" }: StatusBadgeProps) {
  const styles = {
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-stellar-blue/10 text-stellar-blue border-stellar-blue/20",
    live: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };

  return (
    <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 ${styles[type]} ${className}`}>
      {type === "live" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
      {children}
    </div>
  );
}
