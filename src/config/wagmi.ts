"use client";

import {
  getConfig,
  unisatWalletMezoMainnet,
  unisatWalletMezoTestnet,
  okxWalletMezoMainnet,
  okxWalletMezoTestnet,
  xverseWalletMezoMainnet,
  xverseWalletMezoTestnet,
} from "@mezo-org/passport";

const bitcoinWallets = [
  {
    groupName: "Bitcoin Wallets",
    wallets: [
      unisatWalletMezoMainnet,
      unisatWalletMezoTestnet,
      okxWalletMezoMainnet,
      okxWalletMezoTestnet,
      xverseWalletMezoMainnet,
      xverseWalletMezoTestnet,
    ],
  },
];

export const wagmiConfig = getConfig({
  appName: "Mezo Wallet Manager",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
  wallets: bitcoinWallets,
});
