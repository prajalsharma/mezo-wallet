"use client";

import { motion } from "framer-motion";
import { RefreshCw, Coins } from "lucide-react";
import { useAssets } from "@/hooks/useAssets";
import AssetCard from "./AssetCard";
import type { Asset } from "@/types";

interface AssetListProps {
  onSend: (asset: Asset) => void;
}

export default function AssetList({ onSend }: AssetListProps) {
  const { assets, isLoading, refetch } = useAssets();

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-7">
        <div className="flex items-center gap-2.5">
          <Coins size={20} style={{ color: "#ff004d" }} />
          <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "#000000" }}>
            Assets
          </h2>
          {!isLoading && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(255, 0, 77, 0.08)", color: "#ff004d" }}
            >
              {assets.length}
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={() => refetch()}
          className="p-2.5 rounded-xl transition-colors hover:bg-white"
          style={{ color: "#5e5e5e" }}
          data-tooltip="Refresh balances"
        >
          <RefreshCw size={16} />
        </motion.button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[68px] sm:h-[76px] rounded-xl sm:rounded-2xl border animate-pulse"
              style={{
                background: "rgba(255,255,255,0.6)",
                borderColor: "#e0dcd8",
              }}
            />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 sm:py-20"
          style={{ color: "#5e5e5e" }}
        >
          <Coins size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm sm:text-base font-medium">No assets found</p>
          <p className="text-xs sm:text-sm mt-1.5">
            Your BTC and token balances will appear here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {assets.map((asset, i) => (
            <AssetCard
              key={asset.symbol}
              asset={asset}
              index={i}
              onSend={onSend}
            />
          ))}
        </div>
      )}
    </div>
  );
}
