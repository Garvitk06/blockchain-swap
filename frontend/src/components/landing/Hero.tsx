"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      
      {/* Ambient Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
           initial={{ opacity: 1, y: 0 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 text-xs font-bold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                Soroban Mainnet Soon
          </div>
          <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] mb-8">
            Trade at the <br />
            <span className="text-gradient">Speed of Stellar</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-lg leading-relaxed">
            The next generation of decentralized trading. Powered by Soroban smart contracts, built for the global economy.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/swap" className="px-8 py-4 bg-white text-black rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
              Start Trading <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="px-8 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-colors">
              Read Docs
            </Link>
          </div>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800" />
              ))}
            </div>
            <div className="text-sm">
              <span className="font-bold">2,400+</span>
              <span className="text-zinc-500 ml-1">Beta Users</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Floating Token Mockup */}
          <motion.div 
             animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="relative w-72 h-72 md:w-96 md:h-96 glass-hover glass rounded-[40px] shadow-2xl flex items-center justify-center p-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-400/20 rounded-[40px]" />
            <div className="relative w-full h-full border-4 border-stellar-blue/30 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(1,90,209,0.3)]">
                <div className="text-6xl font-bold">🧪</div>
            </div>
            
            {/* Live TPS Badge */}
            <motion.div 
               animate={{ x: [0, 10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute -top-6 -left-6 glass px-6 py-4 rounded-3xl"
            >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg">
                      <Zap size={20} />
                   </div>
                   <div>
                      <div className="text-[10px] uppercase font-bold text-zinc-500">Live Throughput</div>
                      <div className="text-xl font-bold">248 TPS</div>
                   </div>
                </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
