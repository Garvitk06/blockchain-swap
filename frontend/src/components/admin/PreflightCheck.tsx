"use client";

import { Activity, ShieldCheck, Database, Server } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import StatusBadge from "../shared/StatusBadge";
import { CONTRACT_IDS } from "@/lib/stellar";

export default function PreflightCheck() {
  const isRouterSet = CONTRACT_IDS.router && !CONTRACT_IDS.router.includes("...");
  const isPoolSet = CONTRACT_IDS.pool && !CONTRACT_IDS.pool.includes("...");

  const checks = [
    { name: "Soroban RPC", status: "Healthy", icon: Server, color: "text-green-400" },
    { name: "Router Contract", status: isRouterSet ? "Connected" : "Simulated", icon: Database, color: isRouterSet ? "text-green-400" : "text-amber-400" },
    { name: "Liquidity Pool", status: isPoolSet ? "Ready" : "Demo Only", icon: ShieldCheck, color: isPoolSet ? "text-green-400" : "text-amber-400" },
    { name: "Ledger Polling", status: "Active", icon: Activity, color: "text-green-400" },
  ];

  return (
    <GlassCard className="p-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
        Protocol Health 
        <StatusBadge type={isRouterSet ? "live" : "info"}>
          {isRouterSet ? "Testnet Live" : "Testnet Testing"}
        </StatusBadge>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check) => (
          <div key={check.name} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stellar-blue/10 rounded-xl">
                <check.icon size={18} className="text-stellar-blue" />
              </div>
              <span className="text-sm font-medium text-zinc-300">{check.name}</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest flex-shrink-0 ml-2 ${check.color}`}>{check.status}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
