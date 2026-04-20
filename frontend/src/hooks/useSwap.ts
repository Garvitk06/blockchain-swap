"use client";

import { useState } from "react";
import { TransactionBuilder, Contract, Address, xdr, Asset, Operation, nativeToScVal } from "@stellar/stellar-sdk";
import { server, horizonServer, NETWORK_DETAILS, CONTRACT_IDS, ISSUER_ADDRESS } from "@/lib/stellar";
import { signWithFreighter } from "@/lib/freighter";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export type SwapStatus = "IDLE" | "CONNECTING" | "SIGNING" | "SUBMITTING" | "SUCCESS" | "ERROR";

export const useSwap = () => {
  const [status, setStatus] = useState<SwapStatus>("IDLE");
  const [txHash, setTxHash] = useState<string | null>(null);

  const executeSwap = async (
    userAddress: string,
    tokenIn: string,
    amountIn: string, // Scaled 1e7
    minOut: string    // Scaled 1e7
  ) => {
    setStatus("CONNECTING");
    const toastId = toast.loading("Preparing transaction...");

    try {
      // 1. Classic DEX Fallback (Stellar Traditional DEX)
      if (!CONTRACT_IDS.router || CONTRACT_IDS.router.includes("...") || !CONTRACT_IDS.router.startsWith("C")) {
        console.log("Using Classic DEX Path Payment fallback...");
        
        const account = await horizonServer.loadAccount(userAddress);
        const assetIn = tokenIn === "XLM" ? Asset.native() : new Asset("TKNA", ISSUER_ADDRESS);
        const assetOut = tokenIn === "XLM" ? new Asset("TKNA", ISSUER_ADDRESS) : Asset.native();

        // Convert scaled integer strings (raw amounts) back to decimal strings for Classic Operations
        const decAmountIn = (BigInt(amountIn).toString().padStart(8, '0'));
        const formattedIn = decAmountIn.slice(0, -7) + "." + decAmountIn.slice(-7);
        
        const decMinOut = (BigInt(minOut).toString().padStart(8, '0'));
        const formattedOut = decMinOut.slice(0, -7) + "." + decMinOut.slice(-7);

        const tx = new TransactionBuilder(account, {
          fee: "1000",
          networkPassphrase: NETWORK_DETAILS.networkPassphrase,
        })
          .addOperation(
            Operation.pathPaymentStrictSend({
              sendAsset: assetIn,
              sendAmount: formattedIn, 
              destAsset: assetOut,
              destMin: formattedOut, 
              destination: userAddress,
              path: []
            })
          )
          .setTimeout(180)
          .build();

        setStatus("SIGNING");
        toast.loading("Actual Transaction: Please sign in Freighter", { id: toastId });
        
        const signedXdr = await signWithFreighter(tx.toXDR(), NETWORK_DETAILS.network);
        if (!signedXdr) throw new Error("Signing rejected");

        setStatus("SUBMITTING");
        toast.loading("Broadcasting to Stellar Testnet...", { id: toastId });
        
        const transaction = TransactionBuilder.fromXDR(signedXdr, NETWORK_DETAILS.networkPassphrase);
        const result = await horizonServer.submitTransaction(transaction);

        setStatus("SUCCESS");
        setTxHash(result.hash);
        
        toast.success("Transaction Confirmed!", {
          id: toastId,
          description: `Swapped ${formattedIn} ${tokenIn} successfully.`
        });

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#06B6D4', '#ffffff']
        });
        
        return result;
      }

      // 2. Soroban Smart Contract Path (Standard Router)
      const account = await server.getAccount(userAddress);
      const contract = new Contract(CONTRACT_IDS.router);

      const tx = new TransactionBuilder(account, {
        fee: "1000",
        networkPassphrase: NETWORK_DETAILS.networkPassphrase,
      })
        .addOperation(
          contract.call(
            "swap_exact_tokens",
            new Address(userAddress).toScVal(),
            new Address(CONTRACT_IDS.pool).toScVal(),
            new Address(tokenIn).toScVal(),
            nativeToScVal(BigInt(amountIn), { type: "i128" }),
            nativeToScVal(BigInt(minOut), { type: "i128" })
          )
        )
        .setTimeout(30)
        .build();

      setStatus("SIGNING");
      toast.loading("Please sign the transaction in Freighter", { id: toastId });

      const signedXdr = await signWithFreighter(tx.toXDR(), NETWORK_DETAILS.network);
      if (!signedXdr) throw new Error("User rejected signing");

      setStatus("SUBMITTING");
      toast.loading("Broadcasting to Soroban RPC...", { id: toastId });

      const result = await server.sendTransaction(
        TransactionBuilder.fromXDR(signedXdr, NETWORK_DETAILS.networkPassphrase)
      );

      if (result.status && (result.status as string) === "PENDING") {
        setStatus("SUCCESS");
        setTxHash(result.hash);
        toast.success("Swap confirmed!", {
          id: toastId,
          description: `Transaction ${result.hash.slice(0, 8)}... completed.`
        });
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#06B6D4', '#ffffff']
        });

        return result;
      } else {
        throw new Error("Transaction failed or was rejected by the network.");
      }
    } catch (e: any) {
      console.error("Swap process failed", e);
      setStatus("ERROR");
      
      let errorMsg = e.message || "Unknown error";
      const extras = e.response?.data?.extras;
      if (extras?.result_codes) {
        const rc = extras.result_codes;
        errorMsg = `Stellar Error: ${rc.transaction}${rc.operations ? ` (${rc.operations[0]})` : ''}`;
      } else if (e.response?.data?.detail) {
        errorMsg = e.response.data.detail;
      }

      toast.error("Transaction Failed", {
        id: toastId,
        description: errorMsg,
        action: errorMsg.includes("insufficient XLM") ? {
          label: "Get XLM",
          onClick: () => window.open(`https://laboratory.stellar.org/#account-creator?public_key=${userAddress}`, "_blank")
        } : undefined
      });
      throw e;
    }
  };

  return { executeSwap, status, txHash };
};
