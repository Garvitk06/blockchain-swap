"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Total Value Locked", value: "$42.8M", color: "text-violet-400" },
  { label: "24h Volume", value: "$12.4M", color: "text-cyan-400" },
  { label: "Total Swaps", value: "842k+", color: "text-white" },
  { label: "Active Pools", value: "128", color: "text-zinc-400" },
];

export default function StatsBar() {
  return (
    <div id="stats" className="py-12 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 mb-2">{stat.label}</div>
            <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
