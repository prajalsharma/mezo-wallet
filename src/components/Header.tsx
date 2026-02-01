"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNetwork } from "@/hooks/useNetwork";
import { motion } from "framer-motion";

export default function Header() {
  const { network, toggleNetwork } = useNetwork();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50"
      style={{ background: "#100d2e" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #89a3c6, #2d2275)",
            }}
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
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              Mezo Wallet
            </h1>
            <p className="text-xs" style={{ color: "#89a3c6" }}>
              Bitcoin L2 Manager
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Network Toggle */}
          <button
            onClick={toggleNetwork}
            className="group relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200"
            style={{
              background: "rgba(137, 163, 198, 0.15)",
              borderColor: "rgba(137, 163, 198, 0.3)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background:
                  network === "mainnet" ? "#f2e396" : "#89a3c6",
                boxShadow:
                  network === "mainnet"
                    ? "0 0 8px #f2e396"
                    : "0 0 8px #89a3c6",
              }}
            />
            <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
              {network === "mainnet" ? "Mainnet" : "Testnet"}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="text-gray-400"
            >
              <path
                d="M3 5l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Connect Button */}
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </motion.header>
  );
}
