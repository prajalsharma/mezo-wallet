"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWalletAccount } from "@mezo-org/passport";
import { useNetwork } from "@/hooks/useNetwork";
import { useAssets } from "@/hooks/useAssets";
import {
  Copy,
  CheckCircle2,
  ExternalLink,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { getExplorerAddressUrl } from "@/config/networks";

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletSummary() {
  const { accountAddress, walletAddress, isConnected } = useWalletAccount();
  const { network } = useNetwork();
  const { assets, totalUsdValue, isLoading } = useAssets();
  const [copied, setCopied] = useState(false);

  const btcAsset = assets.find((a) => a.symbol === "BTC");

  if (!isConnected) return null;

  const handleCopy = () => {
    if (accountAddress) {
      navigator.clipboard.writeText(accountAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border"
      style={{
        background: "#000000",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/4"
        style={{ background: "radial-gradient(circle, rgba(255, 0, 77, 0.15) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/3 -translate-x-1/4"
        style={{ background: "radial-gradient(circle, rgba(153, 0, 112, 0.1) 0%, transparent 70%)" }}
      />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={16} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
              <span className="text-sm font-medium" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                {walletAddress ? "Bitcoin Wallet" : "EVM Wallet"}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-white font-mono text-sm sm:text-base lg:text-lg">
                {accountAddress ? truncateAddress(accountAddress) : "—"}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: copied ? "#ff004d" : "rgba(255, 255, 255, 0.5)" }}
                data-tooltip="Copy address"
              >
                {copied ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Copy size={15} />
                )}
              </motion.button>
              {accountAddress && (
                <a
                  href={getExplorerAddressUrl(network, accountAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                  data-tooltip="View on explorer"
                >
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>

          <div
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderColor: "rgba(255, 255, 255, 0.15)",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: network === "mainnet" ? "#ff004d" : "rgba(255, 255, 255, 0.4)",
                boxShadow: network === "mainnet" ? "0 0 6px #ff004d" : "0 0 6px rgba(255,255,255,0.4)",
              }}
            />
            <span className="text-xs sm:text-sm font-medium" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              Mezo {network === "mainnet" ? "Mainnet" : "Testnet"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {/* BTC Balance */}
          <div
            className="rounded-xl sm:rounded-2xl p-5 sm:p-6 border"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <p className="text-xs sm:text-sm mb-2 flex items-center gap-1.5" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              <Image src="/icons/btc.svg" alt="BTC" width={16} height={16} />
              BTC Balance
            </p>
            {isLoading ? (
              <div className="h-8 w-28 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.1)" }} />
            ) : (
              <p className="text-xl sm:text-2xl font-bold text-white">
                {btcAsset ? btcAsset.balance : "0.00000000"}{" "}
                <span className="text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>BTC</span>
              </p>
            )}
          </div>

          {/* Total Portfolio */}
          <div
            className="rounded-xl sm:rounded-2xl p-5 sm:p-6 border"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <p className="text-xs sm:text-sm mb-2 flex items-center gap-1.5" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              <TrendingUp size={14} />
              Portfolio Value
            </p>
            {isLoading ? (
              <div className="h-8 w-24 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.1)" }} />
            ) : (
              <p className="text-xl sm:text-2xl font-bold text-white">
                ${totalUsdValue}
              </p>
            )}
          </div>

          {/* Assets Count */}
          <div
            className="rounded-xl sm:rounded-2xl p-5 sm:p-6 border"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <p className="text-xs sm:text-sm mb-2" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Total Assets</p>
            {isLoading ? (
              <div className="h-8 w-10 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.1)" }} />
            ) : (
              <p className="text-xl sm:text-2xl font-bold text-white">
                {assets.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
