"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNetwork } from "@/hooks/useNetwork";
import { useWalletAccount } from "@mezo-org/passport";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, LogOut, Wallet } from "lucide-react";

export default function Header() {
  const { network, toggleNetwork } = useNetwork();
  const { isConnected } = useWalletAccount();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50"
      style={{ background: "#000000" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ background: "#ff004d" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-white"
            >
              <path
                d="M10 2L2 6v8l8 4 8-4V6l-8-4z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M10 6v8M6 8v4M14 8v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-white leading-tight">
              Mezo Wallet
            </h1>
            <p className="text-xs" style={{ color: "#a6a6a6" }}>
              Bitcoin L2 Manager
            </p>
          </div>
          <h1 className="sm:hidden text-base font-bold text-white">
            Mezo
          </h1>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Network Toggle - visible when connected */}
          {isConnected && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleNetwork}
              className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl border transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(255, 255, 255, 0.15)",
              }}
              data-tooltip="Switch network"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={network}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background:
                      network === "mainnet" ? "#ff004d" : "#a6a6a6",
                    boxShadow:
                      network === "mainnet"
                        ? "0 0 10px #ff004d"
                        : "0 0 10px #a6a6a6",
                  }}
                />
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={network}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white transition-colors whitespace-nowrap"
                >
                  {network === "mainnet" ? "Mainnet" : "Testnet"}
                </motion.span>
              </AnimatePresence>
              <ArrowLeftRight
                size={12}
                className="text-gray-500 group-hover:text-gray-300 transition-colors flex-shrink-0"
              />
            </motion.button>
          )}

          {/* Connect / Account Button */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openConnectModal,
              openAccountModal,
              connectModalOpen,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none" as const,
                      userSelect: "none" as const,
                    },
                  })}
                >
                  {connected ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={openAccountModal}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        borderColor: "rgba(255, 255, 255, 0.15)",
                        color: "#ffffff",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "#ff004d" }}
                      >
                        <Wallet size={12} className="text-white" />
                      </div>
                      <span className="hidden sm:inline">
                        {account.displayName}
                      </span>
                      <LogOut size={14} className="text-gray-500 ml-1" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={openConnectModal}
                      disabled={connectModalOpen}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-80"
                      style={{
                        background: "#ff004d",
                        color: "#ffffff",
                        boxShadow: "0 2px 12px rgba(255, 0, 77, 0.3)",
                      }}
                    >
                      <Wallet size={15} />
                      Connect
                    </motion.button>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </motion.header>
  );
}
