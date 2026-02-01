"use client";

import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Shield, Zap, Layers } from "lucide-react";

export default function ConnectScreen() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "#89a3c6" }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "#2d2275" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #89a3c6, #2d2275)",
            boxShadow: "0 10px 40px rgba(45, 34, 117, 0.3)",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            className="text-white"
          >
            <path
              d="M20 4L4 12v16l16 8 16-8V12L20 4z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M20 12v16M12 16v8M28 16v8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold mb-3"
          style={{ color: "#100d2e" }}
        >
          Mezo Wallet Manager
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto mb-8"
          style={{ color: "#5a5a7a" }}
        >
          Connect your Bitcoin wallet to manage assets on the Mezo Network.
          View balances, send tokens, and track transactions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ConnectButton />
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto"
        >
          {[
            {
              icon: Shield,
              label: "Secure",
              desc: "BTC wallet signing",
            },
            {
              icon: Zap,
              label: "Fast",
              desc: "Bitcoin L2 speed",
            },
            {
              icon: Layers,
              label: "Multi-Asset",
              desc: "BTC + ERC-20 tokens",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="text-center"
            >
              <feature.icon
                size={20}
                className="mx-auto mb-2"
                style={{ color: "#2d2275" }}
              />
              <p
                className="text-xs font-medium"
                style={{ color: "#100d2e" }}
              >
                {feature.label}
              </p>
              <p className="text-[10px]" style={{ color: "#5a5a7a" }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
