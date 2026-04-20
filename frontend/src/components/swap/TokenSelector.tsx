"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check } from "lucide-react";
import { useState } from "react";

const TOKENS = [
  { id: "XLM", name: "Stellar Lumens", symbol: "XLM", logo: "🚀" },
  { id: "TKNA", name: "Alpha Token", symbol: "TKNA", logo: "🧪" },
  { id: "TKNB", name: "Beta Token", symbol: "TKNB", logo: "⚡" },
  { id: "USDC", name: "USD Coin", symbol: "USDC", logo: "💵" },
];

export default function TokenSelector({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedToken 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (token: any) => void;
  selectedToken: string;
}) {
  const [search, setSearch] = useState("");

  const filteredTokens = TOKENS.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-md glass rounded-t-3xl md:rounded-3xl p-6 z-[101] shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Select a Token</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search name or address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-stellar-blue transition-colors"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredTokens.map((token) => (
                <button
                  key={token.id}
                  onClick={() => { onSelect(token); onClose(); }}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all ${
                    selectedToken === token.id ? "bg-stellar-blue/10 border border-stellar-blue/20" : "border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-xl">
                      {token.logo}
                    </div>
                    <div className="text-left">
                      <div className="font-bold">{token.symbol}</div>
                      <div className="text-xs text-zinc-500">{token.name}</div>
                    </div>
                  </div>
                  {selectedToken === token.id && <Check size={18} className="text-stellar-blue" />}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
