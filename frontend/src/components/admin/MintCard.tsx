"use client";

import { useState } from "react";
import { Coins, Loader2, CheckCircle2 } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import StatusBadge from "../shared/StatusBadge";
import { useAdmin } from "@/hooks/useAdmin";
import { useStellar } from "@/hooks/useStellar";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function MintCard() {
  const { mintToken } = useAdmin();
  const { checkAssetTrust } = useStellar();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    if (!recipient || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Trustline Check
      const hasTrust = await checkAssetTrust("TKNA");
      if (!hasTrust) {
        toast.error("Recipient lacks a trustline for TKNA");
        setLoading(false);
        return;
      }

      await mintToken(recipient, amount);
      
      // Record to MongoDB
      await fetch("/api/admin/logs", {
        method: "POST",
        body: JSON.stringify({
          adminAddress: "TESTING_ADMIN",
          action: "MINT",
          details: `Minted ${amount} TKNA to ${recipient}`,
          txHash: "mint_sim_" + Math.random().toString(36).substring(7)
        })
      });

      toast.success("Tokens Minted Successfully!");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setAmount("");
    } catch (e) {
      toast.error("Minting failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-stellar-blue/10 rounded-2xl">
            <Coins className="text-stellar-blue" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Token Issuance</h3>
            <p className="text-xs text-zinc-500">Mint protocol assets to any address</p>
          </div>
        </div>
        <StatusBadge type="info">Active</StatusBadge>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Recipient Address</label>
          <input 
            type="text"
            placeholder="G..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-stellar-blue transition-all font-mono text-sm"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Amount to Mint</label>
          <input 
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-stellar-blue transition-all font-bold text-lg"
          />
        </div>

        <button
          onClick={handleMint}
          disabled={loading}
          className="w-full py-4 bg-stellar-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(1,90,209,0.3)] transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <CheckCircle2 size={20} /> Mint Assets
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
