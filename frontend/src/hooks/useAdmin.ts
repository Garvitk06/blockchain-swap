"use client";

import { useState, useEffect } from "react";
import { useStellar } from "./useStellar";
import { 
  TransactionBuilder, 
  Asset, 
  Operation, 
  BASE_FEE 
} from "@stellar/stellar-sdk";
import { horizonServer, ISSUER_ADDRESS, NETWORK_DETAILS } from "@/lib/stellar";
import { signWithFreighter } from "@/lib/freighter";
import { toast } from "sonner";

// For demo purposes, the first user or a specific test address can be admin
const ADMIN_ADDRESSES = [
  "GBSDMBQCO3Q73LABJKLHVGRAIBKESOXBATZ5UTMJE6PMQ6N6X4CQPNBM",
];

export const useAdmin = () => {
  const { address } = useStellar();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const currentAddress = address.trim().toUpperCase();
    const authorized = ADMIN_ADDRESSES.some(admin => admin.trim().toUpperCase() === currentAddress);
    
    setIsAdmin(authorized); 
    setLoading(false);
  }, [address]);

  const mintToken = async (targetAddress: string, amount: string) => {
    if (!address) throw new Error("Wallet not connected");
    
    const toastId = toast.loading("Preparing issuance transaction...");
    try {
      const account = await horizonServer.loadAccount(address);
      const asset = new Asset("TKNA", ISSUER_ADDRESS);

      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_DETAILS.networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: targetAddress,
            asset: asset,
            amount: amount,
          })
        )
        .setTimeout(30)
        .build();

      toast.loading("Please sign the issuance in Freighter", { id: toastId });
      const signedXdr = await signWithFreighter(tx.toXDR(), NETWORK_DETAILS.network);
      
      if (!signedXdr) throw new Error("Transaction rejected");

      toast.loading("Broadcasting issuance to network...", { id: toastId });
      const transaction = TransactionBuilder.fromXDR(signedXdr, NETWORK_DETAILS.networkPassphrase);
      const result = await horizonServer.submitTransaction(transaction);

      return { status: "SUCCESS", hash: result.hash };
    } catch (e: any) {
      console.error("Issuance failed", e);
      throw e;
    }
  };

  const seedDEXLiquidity = async () => {
    if (!address) throw new Error("Wallet not connected");
    
    const toastId = toast.loading("Smart Seeding: Preparing liquidity & orders...");
    try {
      const account = await horizonServer.loadAccount(address);
      const tknaAsset = new Asset("TKNA", ISSUER_ADDRESS);
      const xlmAsset = Asset.native();

      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_DETAILS.networkPassphrase,
      })
        // 1. Initial Mint: Ensure Admin actually has TKNA to fulfill the Sell Offer
        .addOperation(
          Operation.payment({
            destination: address,
            asset: tknaAsset,
            amount: "10000",
          })
        )
        // 2. Offer: Sell TKNA for XLM (Providing TKNA liquidity)
        .addOperation(
          Operation.manageSellOffer({
            selling: tknaAsset,
            buying: xlmAsset,
            amount: "5000",
            price: "1.1", // Add a small spread for realism
            offerId: "0" 
          })
        )
        // 3. Offer: Sell XLM for TKNA (Providing XLM liquidity)
        .addOperation(
          Operation.manageSellOffer({
            selling: xlmAsset,
            buying: tknaAsset,
            amount: "5000",
            price: "0.9", // Spread
            offerId: "0"
          })
        )
        .setTimeout(120) // Give more time for triple-op tx
        .build();

      toast.loading("Sign 'Smart Seed' (Mint + Orders) in Freighter", { id: toastId });
      const signedXdr = await signWithFreighter(tx.toXDR(), NETWORK_DETAILS.network);
      
      if (!signedXdr) throw new Error("Transaction rejected");

      toast.loading("Deploying liquidity to Stellar network...", { id: toastId });
      const transaction = TransactionBuilder.fromXDR(signedXdr, NETWORK_DETAILS.networkPassphrase);
      const result = await horizonServer.submitTransaction(transaction);

      toast.success("DEX Market is Live!", { 
        id: toastId,
        description: "Admin wallet funded & orderbook initialized successfully."
      });
      return { status: "SUCCESS", hash: result.hash };
    } catch (e: any) {
      console.error("Smart Seeding failed", e);
      toast.error("Smart Seeding failed", { id: toastId, description: e.message || "Protocol level error" });
      throw e;
    }
  };

  return { isAdmin, loading, mintToken, seedDEXLiquidity };
};
