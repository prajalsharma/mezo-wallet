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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins size={18} style={{ color: "#2d2275" }} />
          <h2 className="text-lg font-semibold" style={{ color: "#100d2e" }}>
            Assets
          </h2>
        </div>
        <motion.button
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          onClick={() => refetch()}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#5a5a7a" }}
          title="Refresh balances"
        >
          <RefreshCw size={16} />
        </motion.button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl border animate-pulse"
              style={{
                background: "rgba(255,255,255,0.6)",
                borderColor: "#d4d4e0",
              }}
            />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
          style={{ color: "#5a5a7a" }}
        >
          <Coins size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No assets found</p>
          <p className="text-xs mt-1">
            Your BTC and token balances will appear here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
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
