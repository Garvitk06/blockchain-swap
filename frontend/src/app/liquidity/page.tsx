"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  Droplets, 
  Wallet,
  Loader2,
  ArrowRightLeft
} from "lucide-react";
import { useState, useEffect } from "react";
import { useStellar } from "@/hooks/useStellar";
import { usePoolData } from "@/hooks/usePoolData";
import { useLiquidity } from "@/hooks/useLiquidity";
import Navbar from "@/components/landing/Navbar";
import GlassCard from "@/components/shared/GlassCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { useBalances } from "@/hooks/useBalances";
import { toast } from "sonner";

export default function LiquidityPage() {
  const { address, connect, checkAssetTrust, setupTrustline } = useStellar();
  const [activeTab, setActiveTab] = useState<"add" | "remove">("add");
  const { reserves, totalShares, userShares, loading: poolLoading } = usePoolData("XLM", "0", address);
  const { deposit, withdraw, loading: actionLoading } = useLiquidity();
  const { balances, refresh: refreshBalances } = useBalances(address);

  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [removePercent, setRemovePercent] = useState(50);
  
  const [hasTrustB, setHasTrustB] = useState(true);
  const [isCheckingTrust, setIsCheckingTrust] = useState(false);

  // Check trustline for Asset B (TKNA)
  useEffect(() => {
    const verifyTrust = async () => {
      if (!address) return;
      setIsCheckingTrust(true);
      const trusted = await checkAssetTrust("TKNA");
      setHasTrustB(trusted);
      setIsCheckingTrust(false);
    };
    verifyTrust();
  }, [address, checkAssetTrust]);

  useEffect(() => {
    if (amountA && reserves) {
      const ratio = Number(reserves.resB) / Number(reserves.resA);
      setAmountB((parseFloat(amountA) * ratio).toFixed(4));
    } else {
      setAmountB("");
    }
  }, [amountA, reserves]);

  const handleDeposit = async () => {
    if (!address) return connect();

    // Step 1: Trustline Check for TKNA
    if (!hasTrustB) {
      if (balances.XLM < 1.0) {
        toast.error("Insufficient XLM balance to enable token (requires at least 1 XLM)");
        return;
      }
      const success = await setupTrustline("TKNA");
      if (success) {
        const trusted = await checkAssetTrust("TKNA", 5);
        setHasTrustB(trusted);
        refreshBalances();
      }
      return;
    }

    const scaledA = (parseFloat(amountA) * 10000000).toString();
    const scaledB = (parseFloat(amountB) * 10000000).toString();
    await deposit(address, scaledA, scaledB);
  };

  const handleWithdraw = async () => {
    if (!address) return connect();
    const shareToBurn = (userShares * BigInt(removePercent)) / BigInt(100);
    await withdraw(address, shareToBurn.toString());
  };

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-20 selection:bg-stellar-blue/30 overflow-x-hidden">
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <Droplets className="text-stellar-blue" size={32} />
                 <h1 className="text-4xl font-bold tracking-tight">Manage Liquidity</h1>
              </div>
              <p className="text-zinc-500 max-w-lg font-medium">
                Add assets to the protocol to earn 0.3% trading fees. Manage your share of the liquidity pool.
              </p>
           </div>
           <StatusBadge type="live">XLM / TKNA Pool</StatusBadge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 
                 {/* Liquidity Management Card */}
                 <GlassCard className="p-8">
                    <div className="flex p-1 bg-white/5 rounded-2xl gap-1 mb-10 w-full">
                      <button 
                        onClick={() => setActiveTab("add")}
                        className={`relative flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === "add" ? "text-black" : "text-zinc-500 hover:text-white"}`}
                      >
                        {activeTab === "add" && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white rounded-xl" />}
                        <span className="relative z-10 flex items-center gap-2"><Plus size={16}/> Add Liquidity</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab("remove")}
                        className={`relative flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === "remove" ? "text-black" : "text-zinc-500 hover:text-white"}`}
                      >
                        {activeTab === "remove" && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white rounded-xl" />}
                        <span className="relative z-10 flex items-center gap-2"><Minus size={16}/> Remove Liquidity</span>
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {activeTab === "add" ? (
                        <motion.div key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Input Asset A</span>
                                <span className="text-[10px] font-medium text-zinc-500">Balance: {balances.XLM || 0}</span>
                              </div>
                             <div className="flex justify-between items-center gap-4">
                                <input type="number" placeholder="0.00" value={amountA} onChange={(e) => setAmountA(e.target.value)} className="bg-transparent text-3xl font-bold outline-none w-full" />
                                <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl border border-white/5 font-bold">🚀 XLM</div>
                             </div>
                          </div>
                          <div className="flex justify-center -my-3 relative z-20">
                             <div className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-cyan-400"><Plus size={16} /></div>
                          </div>
                          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Calculated Asset B</span>
                                <span className="text-[10px] font-medium text-zinc-500">Balance: {balances.TKNA || 0}</span>
                              </div>
                             <div className="flex justify-between items-center gap-4">
                                <input type="number" placeholder="0.00" value={amountB} readOnly className="bg-transparent text-3xl font-bold outline-none w-full text-zinc-500" />
                                <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl border border-white/5 font-bold">🧪 TKNA</div>
                             </div>
                          </div>
                          <button 
                             onClick={handleDeposit} 
                             disabled={actionLoading || !amountA || isCheckingTrust} 
                             className="w-full py-5 rounded-2xl bg-stellar-blue text-white font-extrabold text-lg mt-8 hover:shadow-[0_0_30px_rgba(1,90,209,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {actionLoading || isCheckingTrust ? (
                              <Loader2 className="animate-spin" />
                            ) : !address ? (
                              "Connect Wallet"
                            ) : !hasTrustB ? (
                              "Enable TKNA"
                            ) : (
                              "Add Liquidity"
                            )}
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div key="remove" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                          <div className="text-center p-8 rounded-3xl bg-white/[0.03] border border-white/5">
                              <div className="text-5xl font-bold mb-2">{removePercent}%</div>
                              <input type="range" min="0" max="100" value={removePercent} onChange={(e) => setRemovePercent(parseInt(e.target.value))} className="w-full mt-8 accent-cyan-400" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <div className="text-[10px] text-zinc-500 font-bold mb-1 uppercase">XLM to Receive</div>
                                  <div className="text-xl font-bold">{(Number(userShares) * removePercent / 1e9).toFixed(2)}</div>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <div className="text-[10px] text-zinc-500 font-bold mb-1 uppercase">TKNA to Receive</div>
                                  <div className="text-xl font-bold">{(Number(userShares) * removePercent / 1e9).toFixed(2)}</div>
                              </div>
                          </div>
                          <button onClick={handleWithdraw} disabled={actionLoading || userShares === BigInt(0)} className="w-full py-5 rounded-2xl bg-red-500/20 text-red-500 border border-red-500/50 font-extrabold text-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-30">
                            {actionLoading ? <Loader2 className="animate-spin" /> : "Remove Assets"}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </GlassCard>

                 {/* Position Information Overlay */}
                 <div className="space-y-8">
                    <GlassCard className="p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-stellar-blue/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-stellar-blue/10 transition-all" />
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest text-zinc-500"><Wallet size={16} /> Active Position</h3>
                        {address ? (
                           <div className="space-y-8">
                              <div className="flex justify-between items-end">
                                 <div>
                                    <div className="text-xs text-zinc-500 mb-1">Your Total Share</div>
                                    <div className="text-4xl font-bold font-mono text-cyan-400">{totalShares > 0 ? ((Number(userShares) / Number(totalShares)) * 100).toFixed(2) : "0.00"}%</div>
                                 </div>
                                 <div className="text-right">
                                    <div className="text-xs text-zinc-500 mb-1">LP Tokens</div>
                                    <div className="text-xl font-bold font-mono">{Number(userShares) / 10000000} LP</div>
                                 </div>
                              </div>
                              <div className="space-y-4 pt-6 border-t border-white/5">
                                 <p className="text-xs text-zinc-500 leading-relaxed font-medium italic">Your liquidity is generating 0.3% fees on every trade in this pool. Fees are automatically compounded into your position.</p>
                              </div>
                           </div>
                        ) : (
                           <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] gap-4">
                              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Connect Wallet to view position</p>
                              <button onClick={connect} className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-xs font-bold transition-all">Connect Now</button>
                           </div>
                        )}
                    </GlassCard>

                    <div className="p-8 rounded-[32px] bg-stellar-blue/5 border border-stellar-blue/10">
                       <h4 className="font-bold flex items-center gap-2 text-sm mb-4"><ArrowRightLeft size={16} className="text-stellar-blue" /> Why Add Liquidity?</h4>
                       <ul className="space-y-3 text-xs text-zinc-400 font-medium list-disc ml-4">
                          <li>Earn passive income from trading volume.</li>
                          <li>Help stabilize the XLM/TKNA network.</li>
                          <li>Receive LP tokens that represent your pool ownership.</li>
                       </ul>
                    </div>
                 </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
