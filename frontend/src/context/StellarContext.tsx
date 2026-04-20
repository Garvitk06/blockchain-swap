"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { initPolyfills } from "@/lib/polyfills";
import { connectWallet, signWithFreighter, isWalletConnected } from "@/lib/freighter";
import { checkTrustline, createTrustlineXDR, submitTransactionXDR, NETWORK_DETAILS } from "@/lib/stellar";
import { toast } from "sonner";

// Initialize polyfills immediately at module level
initPolyfills();

interface StellarContextType {
  address: string | null;
  loading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  checkAssetTrust: (assetCode: string, retries?: number) => Promise<boolean>;
  setupTrustline: (assetCode: string) => Promise<boolean>;
}

const StellarContext = createContext<StellarContextType | undefined>(undefined);

export function StellarProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [connectAttempts, setConnectAttempts] = useState(0);

  // Client-side initialization
  useEffect(() => {
    initPolyfills();

    const checkExistingSession = async () => {
      try {
        const alreadyConnected = await isWalletConnected();
        const savedAddress = localStorage.getItem("stellar_address");
        
        if (alreadyConnected && savedAddress) {
          // If extension says connected and we have a saved address, 
          // just restore it without prompting.
          setAddress(savedAddress);
        }
      } catch (e) {
        console.warn("Session check failed", e);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const connect = useCallback(async () => {
    setLoading(true);
    const toastId = toast.loading("Connecting to Freighter...");
    try {
      const pubKey = await connectWallet();
      if (pubKey) {
        setAddress(pubKey);
        localStorage.setItem("stellar_address", pubKey);
        toast.success("Wallet Connected!", { id: toastId });
        setConnectAttempts(0);
      }
    } catch (e: any) {
      console.error("Connection failed", e);
      setConnectAttempts(prev => prev + 1);
      
      const errorMsg = e.message || "Unknown error";
      
      // Still keep the manual fallback as a safety net
      if (connectAttempts >= 1) {
        toast.error("Handshake Issue", {
          id: toastId,
          description: "Freighter is taking long to respond. Try manual entry?",
          duration: 10000,
          action: {
            label: "Enter Manually",
            onClick: () => {
              const addr = window.prompt("Enter your Stellar Public Key:");
              if (addr && addr.startsWith("G") && addr.length === 56) {
                setAddress(addr);
                localStorage.setItem("stellar_address", addr);
                toast.success("Linked Successfully");
              }
            }
          }
        });
      } else {
        toast.error(errorMsg, { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  }, [connectAttempts]);

  const disconnect = useCallback(() => {
    setAddress(null);
    localStorage.removeItem("stellar_address");
    setConnectAttempts(0);
    toast.info("Wallet Disconnected");
  }, []);

  const checkAssetTrust = useCallback(async (assetCode: string, retries = 1) => {
    if (!address) return false;
    // Self-trust protection: if the user is the issuer, they don't need a trustline
    const ISSUER_ADDRESS = "GBSDMBQCO3Q73LABJKLHVGRAIBKESOXBATZ5UTMJE6PMQ6N6X4CQPNBM";
    if (address === ISSUER_ADDRESS) return true;
    
    return await checkTrustline(address, assetCode, retries);
  }, [address]);

  const setupTrustline = useCallback(async (assetCode: string) => {
    if (!address) return false;
    const toastId = toast.loading(`Enabling ${assetCode}...`);
    try {
      const xdr = await createTrustlineXDR(address, assetCode);
      const signed = await signWithFreighter(xdr, NETWORK_DETAILS.network);
      if (signed) {
        toast.loading("Submitting to network...", { id: toastId });
        await submitTransactionXDR(signed);
        
        // Essential delay: Give Horizon time to index before first check
        await new Promise(r => setTimeout(r, 1500));
        
        // Wait and retry verification to handle Horizon delay
        const verified = await checkAssetTrust(assetCode, 5);
        if (verified) {
          toast.success(`${assetCode} Enabled!`, { id: toastId });
          return true;
        }
      }
      toast.error("Verification failed or rejected", { id: toastId });
      return false;
    } catch (e: any) {
      if (e.message.includes("insufficient XLM")) {
        toast.error("Insufficient Funds", {
          id: toastId,
          description: "Your Testnet account needs XLM to enable tokens.",
          action: {
            label: "Get XLM",
            onClick: () => window.open(`https://laboratory.stellar.org/#account-creator?public_key=${address}`, "_blank")
          }
        });
      } else {
        toast.error(`Failed to enable ${assetCode}: ${e.message}`, { id: toastId });
      }
      return false;
    }
  }, [address, checkAssetTrust]);

  const contextValue = useMemo(() => ({
    address, 
    loading, 
    connect, 
    disconnect, 
    checkAssetTrust, 
    setupTrustline 
  }), [address, loading, connect, disconnect, checkAssetTrust, setupTrustline]);

  return (
    <StellarContext.Provider value={contextValue}>
      {children}
    </StellarContext.Provider>
  );
}

export function useStellarContext() {
  const context = useContext(StellarContext);
  if (context === undefined) {
    throw new Error("useStellarContext must be used within a StellarProvider");
  }
  return context;
}
