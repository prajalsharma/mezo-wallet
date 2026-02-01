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
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8 border"
      style={{
        background: "linear-gradient(135deg, #100d2e 0%, #1a1550 50%, #2d2275 100%)",
        borderColor: "rgba(137, 163, 198, 0.2)",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/4"
        style={{ background: "radial-gradient(circle, rgba(137,163,198,0.15) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/3 -translate-x-1/4"
        style={{ background: "radial-gradient(circle, rgba(242,227,150,0.1) 0%, transparent 70%)" }}
      />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={16} style={{ color: "#89a3c6" }} />
              <span className="text-sm font-medium" style={{ color: "#89a3c6" }}>
                {walletAddress ? "Bitcoin Wallet" : "EVM Wallet"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono text-sm sm:text-base">
                {accountAddress ? truncateAddress(accountAddress) : "—"}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 rounded-lg transition-colors"
                style={{ color: copied ? "#f2e396" : "#89a3c6" }}
                title="Copy address"
              >
                {copied ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Copy size={14} />
                )}
              </button>
              {accountAddress && (
                <a
                  href={getExplorerAddressUrl(network, accountAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg transition-colors"
                  style={{ color: "#89a3c6" }}
                  title="View on explorer"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{
              background: "rgba(137, 163, 198, 0.1)",
              borderColor: "rgba(137, 163, 198, 0.3)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: network === "mainnet" ? "#f2e396" : "#89a3c6",
              }}
            />
            <span className="text-xs font-medium" style={{ color: "#89a3c6" }}>
              Mezo {network === "mainnet" ? "Mainnet" : "Testnet"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* BTC Balance */}
          <div
            className="rounded-xl p-4 border"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(137, 163, 198, 0.15)",
            }}
          >
            <p className="text-xs mb-1 flex items-center gap-1" style={{ color: "#89a3c6" }}>
              <Image src="/icons/btc.svg" alt="BTC" width={16} height={16} />
              BTC Balance
            </p>
            {isLoading ? (
              <div className="h-7 w-24 rounded animate-pulse" style={{ background: "rgba(137,163,198,0.2)" }} />
            ) : (
              <p className="text-xl font-bold text-white">
                {btcAsset ? btcAsset.balance : "0.00000000"}{" "}
                <span className="text-sm" style={{ color: "#89a3c6" }}>BTC</span>
              </p>
            )}
          </div>

          {/* Total Portfolio */}
          <div
            className="rounded-xl p-4 border"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(137, 163, 198, 0.15)",
            }}
          >
            <p className="text-xs mb-1 flex items-center gap-1" style={{ color: "#89a3c6" }}>
              <TrendingUp size={14} />
              Portfolio Value
            </p>
            {isLoading ? (
              <div className="h-7 w-20 rounded animate-pulse" style={{ background: "rgba(137,163,198,0.2)" }} />
            ) : (
              <p className="text-xl font-bold text-white">
                ${totalUsdValue}
              </p>
            )}
          </div>

          {/* Assets Count */}
          <div
            className="rounded-xl p-4 border"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(137, 163, 198, 0.15)",
            }}
          >
            <p className="text-xs mb-1" style={{ color: "#89a3c6" }}>Total Assets</p>
            {isLoading ? (
              <div className="h-7 w-8 rounded animate-pulse" style={{ background: "rgba(137,163,198,0.2)" }} />
            ) : (
              <p className="text-xl font-bold text-white">
                {assets.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
