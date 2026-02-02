"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, History } from "lucide-react";
import { useWalletAccount } from "@mezo-org/passport";
import Header from "./Header";
import ConnectScreen from "./ConnectScreen";
import WalletSummary from "./WalletSummary";
import AssetList from "./AssetList";
import TransactionHistory from "./TransactionHistory";
import SendModal from "./SendModal";
import type { Asset } from "@/types";

type Tab = "assets" | "history";

export default function Dashboard() {
  const { isConnected } = useWalletAccount();
  const [activeTab, setActiveTab] = useState<Tab>("assets");
  const [sendAsset, setSendAsset] = useState<Asset | null>(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f4f0ed" }}>
      <Header />

      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.div
            key="connect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ConnectScreen />
          </motion.div>
        ) : (
          <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-7 sm:space-y-9"
            >
              {/* Wallet Summary */}
              <WalletSummary />

              {/* Tab Navigation */}
              <div
                className="flex items-center gap-1 p-1.5 rounded-2xl border w-fit"
                style={{
                  background: "#ffffff",
                  borderColor: "#e0dcd8",
                }}
              >
                {([
                  { key: "assets" as Tab, label: "Assets", icon: Coins },
                  { key: "history" as Tab, label: "History", icon: History },
                ]).map((tab) => (
                  <motion.button
                    key={tab.key}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab.key)}
                    className="relative flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      color:
                        activeTab === tab.key ? "#ffffff" : "#5e5e5e",
                    }}
                  >
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "#ff004d",
                        }}
                        transition={{ type: "spring", duration: 0.35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <tab.icon size={16} />
                      {tab.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "assets" ? (
                  <motion.div
                    key="assets-tab"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AssetList onSend={setSendAsset} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="history-tab"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TransactionHistory />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </main>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        className="mt-auto py-6 sm:py-8 text-center"
        style={{ background: "#000000" }}
      >
        <p className="text-xs sm:text-sm font-medium" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
          Mezo Wallet Manager
        </p>
        <p className="text-[11px] sm:text-xs mt-1.5" style={{ color: "rgba(255, 255, 255, 0.3)" }}>
          A community tool for Bitcoin on the Mezo Network — not affiliated with Mezo
        </p>
      </footer>

      {/* Send Modal */}
      <AnimatePresence>
        {sendAsset && (
          <SendModal asset={sendAsset} onClose={() => setSendAsset(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
