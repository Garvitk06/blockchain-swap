import { Horizon, SorobanRpc, Networks, Asset, Operation, TransactionBuilder, BASE_FEE } from "@stellar/stellar-sdk";

const rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org";
const horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL || "https://horizon-testnet.stellar.org";
const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET;

export const server = new SorobanRpc.Server(rpcUrl);
export const horizonServer = new Horizon.Server(horizonUrl);

export const NETWORK_DETAILS = {
  network: networkPassphrase,
  networkPassphrase,
};

// Trustline Issuer Configuration
export const ISSUER_ADDRESS = "GBSDMBQCO3Q73LABJKLHVGRAIBKESOXBATZ5UTMJE6PMQ6N6X4CQPNBM";

export const CONTRACT_IDS = {
  token: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ID || "CC...",
  pool: process.env.NEXT_PUBLIC_POOL_CONTRACT_ID || "CC...",
  router: process.env.NEXT_PUBLIC_ROUTER_CONTRACT_ID || "CC...",
};

export const checkTrustline = async (address: string, assetCode: string, retries = 1) => {
  for (let i = 0; i < retries; i++) {
    try {
      const account = await horizonServer.loadAccount(address);
      const isTrusted = account.balances.some(
        (b: any) => b.asset_code === assetCode || (assetCode === "XLM" && b.asset_type === "native")
      );
      if (isTrusted) return true;
      if (retries > 1) await new Promise(r => setTimeout(r, 1200)); // Slightly longer wait
    } catch (e) {
      // On the last retry, if it's still failing (e.g. account not found), return false
      if (i === retries - 1) return false;
      await new Promise(r => setTimeout(r, 1500)); // Wait longer on error
    }
  }
  return false;
};

export const createTrustlineXDR = async (address: string, assetCode: string) => {
  try {
    const account = await horizonServer.loadAccount(address);
    const asset = new Asset(assetCode, ISSUER_ADDRESS);
    
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: networkPassphrase,
    })
      .addOperation(
        Operation.changeTrust({
          asset: asset,
        })
      )
      .setTimeout(30)
      .build();

    return transaction.toXDR();
  } catch (e) {
    console.error("Failed to build trustline XDR", e);
    throw e;
  }
};

export const submitTransactionXDR = async (signedXdr: string) => {
  try {
    const transaction = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
    const response = await horizonServer.submitTransaction(transaction);
    return response;
  } catch (e: any) {
    const data = e.response?.data;
    const resultCodes = data?.extras?.result_codes;
    let errorMsg = resultCodes 
      ? `${resultCodes.transaction} : ${resultCodes.operations?.[0] || ""}`
      : (data?.detail || e.message || "Submission failed");

    if (errorMsg.includes("op_underfunded") || errorMsg.includes("tx_insufficient_balance")) {
      errorMsg = "Your account has insufficient XLM for this transaction. Please fund your Testnet account using Friendbot.";
    }
    
    console.error("Transaction submission failed:", data || e);
    throw new Error(errorMsg);
  }
};
