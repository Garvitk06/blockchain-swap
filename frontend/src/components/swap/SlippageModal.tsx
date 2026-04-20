"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2 } from "lucide-react";
import { useState } from "react";

export default function SlippageModal({ 
  isOpen, 
  onClose, 
  value, 
  onChange 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  value: number;
  onChange: (val: number) => void;
}) {
  const PRESETS = [0.1, 0.5, 1.0];
  const [custom, setCustom] = useState(value.toString());

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm glass rounded-3xl p-6 z-[101] shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings2 size={20} className="text-stellar-blue" />
                Settings
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-zinc-500 mb-3 block">Slippage Tolerance</label>
                <div className="flex gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => { onChange(p); setCustom(p.toString()); }}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                        value === p ? "bg-stellar-blue text-white" : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                  <div className="relative flex-1">
                    <input 
                      type="number"
                      placeholder="Custom"
                      value={custom}
                      onChange={(e) => {
                        setCustom(e.target.value);
                        onChange(parseFloat(e.target.value) || 0.5);
                      }}
                      className="w-full h-full bg-white/5 border border-white/10 rounded-xl px-3 outline-none text-right font-bold focus:border-stellar-blue"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stellar-blue/5 border border-stellar-blue/10">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your transaction will revert if the price changes unfavorably by more than this percentage.
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
