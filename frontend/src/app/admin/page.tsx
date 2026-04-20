"use client";

import { LayoutDashboard, Lock, ShieldAlert } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { useAdmin } from "@/hooks/useAdmin";
import MintCard from "@/components/admin/MintCard";
import PreflightCheck from "@/components/admin/PreflightCheck";
import StatusBadge from "@/components/shared/StatusBadge";
import { motion } from "framer-motion";

export default function AdminPage() {
  const { isAdmin, loading, seedDEXLiquidity } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Navbar />
        <div className="p-8 rounded-full border-b-2 border-stellar-blue animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <Navbar />
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <Lock className="text-red-500" size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-zinc-500 max-w-md mb-8">
          You must be connected with a protocol administrator wallet to access this section.
        </p>
        <StatusBadge type="error">Access Denied</StatusBadge>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-12 selection:bg-stellar-blue/30">
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="text-stellar-blue" size={32} />
              <h1 className="text-4xl font-bold tracking-tight">Protocol Hub</h1>
            </div>
            <p className="text-zinc-500 font-medium">Global administration and diagnostic console</p>
          </div>
          <div className="flex gap-3">
             <StatusBadge type="live">Live Monitor</StatusBadge>
             <StatusBadge type="success" className="bg-stellar-blue/20">Admin Connected</StatusBadge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-8"
          >
            <MintCard />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-stellar-blue/5 rounded-full -mr-16 -mt-16 group-hover:bg-stellar-blue/10 transition-colors" />
                  <h3 className="text-xl font-bold mb-2">Orderbook Controls</h3>
                  <p className="text-sm text-zinc-500 mb-6 font-medium">Initialize the Traditional DEX orderbook to enable real network swaps.</p>
                  <button 
                    onClick={seedDEXLiquidity}
                    className="text-stellar-blue font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Seed DEX Liquidity
                  </button>
               </div>
               <div className="glass p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />
                  <h3 className="text-xl font-bold mb-2">Security Audit</h3>
                  <p className="text-sm text-zinc-500 mb-6 font-medium">Review contract interactions and suspicious ledger activity</p>
                  <button className="text-purple-400 font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all">
                    View Logs
                  </button>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <PreflightCheck />
            <div className="mt-8 p-6 rounded-[32px] bg-red-500/5 border border-red-500/10 flex items-start gap-4">
               <ShieldAlert className="text-red-500 mt-1" size={20} />
               <div>
                  <h4 className="text-sm font-bold text-red-400 mb-1">Danger Zone</h4>
                  <p className="text-xs text-red-400/60 leading-relaxed font-medium">
                    Functions in this area can permanently alter protocol state. Proceed with extreme caution.
                  </p>
                  <button className="mt-4 text-xs font-bold text-red-500 bg-red-500/10 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all">
                    Pause Protocol
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
