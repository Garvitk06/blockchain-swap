"use client";

import { motion } from "framer-motion";
import { Cpu, Coins, Layers, Activity } from "lucide-react";

const features = [
  {
    title: "Atomic Swaps",
    desc: "Perform complex multi-hop trades in a single transaction with full atomicity.",
    icon: <Cpu className="text-violet-400" />,
    className: "md:col-span-2",
  },
  {
    title: "Custom SEP-41",
    desc: "Launch and manage your own tokens with admin-controlled distribution.",
    icon: <Coins className="text-cyan-400" />,
    className: "md:col-span-1",
  },
  {
    title: "Monolithic Pools",
    desc: "LP shares and AMM logic combined for maximum gas efficiency on Soroban.",
    icon: <Layers className="text-white" />,
    className: "md:col-span-1",
  },
  {
    title: "Event Streaming",
    desc: "Subscribe to real-time horizon events for instant transaction confirmation.",
    icon: <Activity className="text-stellar-blue" />,
    className: "md:col-span-2",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Core Protocol Features</h2>
        <p className="text-zinc-500 max-w-xl mx-auto text-lg">
          StellarSwap leverages the full potential of Soroban to bring institutional-grade DeFi to the Stellar network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`glass glass-hover p-8 rounded-[32px] group ${f.className}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
            <p className="text-zinc-500 leading-relaxed text-sm md:text-base">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
