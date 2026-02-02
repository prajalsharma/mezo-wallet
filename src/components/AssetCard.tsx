"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Send } from "lucide-react";
import type { Asset } from "@/types";

interface AssetCardProps {
  asset: Asset;
  index: number;
  onSend: (asset: Asset) => void;
}

export default function AssetCard({ asset, index, onSend }: AssetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="group relative overflow-hidden rounded-xl sm:rounded-2xl border p-5 sm:p-6 transition-all duration-200"
      style={{
        background: "#ffffff",
        borderColor: "#e0dcd8",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, rgba(255,0,77,0) 0%, rgba(255,0,77,0.04) 50%, rgba(153,0,112,0.02) 100%)",
        }}
      />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{
              background: "#f4f0ed",
              border: "1px solid #e0dcd8",
            }}
          >
            <Image
              src={asset.icon}
              alt={asset.symbol}
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm sm:text-base" style={{ color: "#000000" }}>
              {asset.symbol}
            </p>
            <p className="text-xs sm:text-sm truncate" style={{ color: "#5e5e5e" }}>
              {asset.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          <div className="text-right">
            <p className="font-medium text-sm sm:text-base" style={{ color: "#000000" }}>
              {asset.balance}
            </p>
            {asset.balanceUsd && (
              <p className="text-xs sm:text-sm" style={{ color: "#5e5e5e" }}>
                ${asset.balanceUsd}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSend(asset)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-lg transition-all duration-200"
            style={{
              background: "#ff004d",
              boxShadow: "0 4px 12px rgba(255, 0, 77, 0.25)",
            }}
          >
            <Send size={13} />
            <span className="hidden sm:inline">Send</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
