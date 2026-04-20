"use client";

import { ArrowLeftRight, Github, Twitter, MessageSquare } from "lucide-react";
import Link from "next/link";
import { CONTRACT_IDS } from "@/lib/stellar";

export default function Footer() {
  return (
    <footer className="py-24 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-stellar-blue rounded-lg">
              <ArrowLeftRight size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl">StellarSwap</span>
          </Link>
          <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed">
             Building the future of liquidity on the Stellar network. Secure, atomic, and blisteringly fast.
          </p>
          <div className="flex gap-4">
             <div className="p-3 glass-hover glass rounded-xl cursor-pointer">
                <Twitter size={20} />
             </div>
             <div className="p-3 glass-hover glass rounded-xl cursor-pointer">
                <Github size={20} />
             </div>
             <div className="p-3 glass-hover glass rounded-xl cursor-pointer">
                <MessageSquare size={20} />
             </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 pt-1">Resources</h4>
          <ul className="space-y-4 text-zinc-500 text-sm">
             <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
             <li><Link href="#" className="hover:text-white transition-colors">Brand Assets</Link></li>
             <li><Link href="#" className="hover:text-white transition-colors">Developer Portal</Link></li>
             <li><Link href="#" className="hover:text-white transition-colors">Audit Reports</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 pt-1">Contracts (Testnet)</h4>
          <ul className="space-y-4 text-xs font-mono text-zinc-600">
             <li className="flex flex-col gap-1">
                <span className="text-zinc-500 uppercase text-[9px] tracking-widest font-bold">Router</span>
                <span className="text-white truncate">{CONTRACT_IDS.router}</span>
             </li>
             <li className="flex flex-col gap-1">
                <span className="text-zinc-500 uppercase text-[9px] tracking-widest font-bold">Liquidity Pool</span>
                <span className="text-white truncate">{CONTRACT_IDS.pool}</span>
             </li>
             <li className="flex flex-col gap-1">
                <span className="text-zinc-500 uppercase text-[9px] tracking-widest font-bold">Token Factory</span>
                <span className="text-white truncate">{CONTRACT_IDS.token}</span>
             </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-mono">
         <p>© 2026 StellarSwap Protocol. All rights reserved.</p>
         <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
         </div>
      </div>
    </footer>
  );
}
