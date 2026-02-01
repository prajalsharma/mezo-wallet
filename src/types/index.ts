export interface Asset {
  symbol: string;
  name: string;
  balance: string;
  balanceUsd: string;
  decimals: number;
  rawBalance: bigint;
  icon: string;
  contractAddress?: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  symbol: string;
  timestamp: number;
  status: "confirmed" | "pending" | "failed";
  type: "send" | "receive";
}

export type NetworkType = "mainnet" | "testnet";

export type SendStep = "input" | "confirm" | "sending" | "success" | "error";
