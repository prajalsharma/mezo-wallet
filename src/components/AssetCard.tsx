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
      className="group relative overflow-hidden rounded-xl border p-4 transition-all duration-200"
      style={{
        background: "#ffffff",
        borderColor: "#d4d4e0",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, rgba(137,163,198,0) 0%, rgba(137,163,198,0.06) 50%, rgba(45,34,117,0.03) 100%)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: "#f5f5f8",
              border: "1px solid #d4d4e0",
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
          <div>
            <p className="font-semibold text-sm" style={{ color: "#100d2e" }}>
              {asset.symbol}
            </p>
            <p className="text-xs" style={{ color: "#5a5a7a" }}>
              {asset.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium text-sm" style={{ color: "#100d2e" }}>
              {asset.balance}
            </p>
            {asset.balanceUsd && (
              <p className="text-xs" style={{ color: "#5a5a7a" }}>
                ${asset.balanceUsd}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSend(asset)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-lg transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #89a3c6, #2d2275)",
              boxShadow: "0 4px 12px rgba(45, 34, 117, 0.25)",
            }}
          >
            <Send size={12} />
            Send
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
