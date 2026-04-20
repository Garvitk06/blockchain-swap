import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: "0 25px 50px -12px rgba(1,90,209,0.2)" } : {}}
      className={`glass rounded-[32px] overflow-hidden border border-white/5 transition-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}
