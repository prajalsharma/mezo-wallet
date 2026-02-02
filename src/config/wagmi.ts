"use client";

import {
  getConfig,
  unisatWalletMezoMainnet,
  okxWalletMezoMainnet,
  xverseWalletMezoMainnet,
  mezoMainnet,
  mezoTestnet,
} from "@mezo-org/passport";
import { http } from "wagmi";

// Only 3 wallets — one per provider — to prevent duplicates in the modal.
// Mainnet connectors are used by default; network toggling switches the chain.
const bitcoinWallets = [
  {
    groupName: "Bitcoin Wallets",
    wallets: [
      unisatWalletMezoMainnet,
      okxWalletMezoMainnet,
      xverseWalletMezoMainnet,
    ],
  },
];

export const wagmiConfig = getConfig({
  appName: "Mezo Wallet Manager",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
  wallets: bitcoinWallets,
  // Include both chains so Mainnet ↔ Testnet switching works.
  // These override getConfig's single-chain default via restParameters spread.
  chains: [mezoMainnet, mezoTestnet],
  transports: {
    [mezoMainnet.id]: http(mezoMainnet.rpcUrls.default.http[0]),
    [mezoTestnet.id]: http(mezoTestnet.rpcUrls.default.http[0]),
  },
});
