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
    <div className="min-h-screen" style={{ background: "#ececec" }}>
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
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
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Wallet Summary */}
              <WalletSummary />

              {/* Tab Navigation */}
              <div
                className="flex items-center gap-1 p-1 rounded-xl border w-fit"
                style={{
                  background: "#ffffff",
                  borderColor: "#d4d4e0",
                }}
              >
                {([
                  { key: "assets" as Tab, label: "Assets", icon: Coins },
                  { key: "history" as Tab, label: "History", icon: History },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      color:
                        activeTab === tab.key ? "#ffffff" : "#5a5a7a",
                    }}
                  >
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, #89a3c6, #2d2275)",
                        }}
                        transition={{ type: "spring", duration: 0.3 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <tab.icon size={16} />
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "assets" ? (
                  <motion.div
                    key="assets-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AssetList onSend={setSendAsset} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="history-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <TransactionHistory />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        className="mt-12 py-4 text-center text-xs"
        style={{ background: "#100d2e", color: "#89a3c6" }}
      >
        Mezo Wallet Manager — Bitcoin L2 dApp
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
