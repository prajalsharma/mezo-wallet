"use client";

import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Shield,
  Zap,
  Layers,
  Wallet,
  Bitcoin,
  ArrowRight,
  Lock,
  TrendingUp,
  Globe,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: Bitcoin,
    title: "Use BTC Without Selling",
    description:
      "Unlock the value of your Bitcoin. Access DeFi, borrow, and transact — all while keeping your BTC.",
  },
  {
    icon: Lock,
    title: "Self-Custody Finance",
    description:
      "Your keys, your coins. Mezo enables decentralized finance without giving up control of your assets.",
  },
  {
    icon: TrendingUp,
    title: "Earn Yield on Bitcoin",
    description:
      "Put your BTC to work. Earn yield through lending, liquidity, and protocol participation on Mezo L2.",
  },
  {
    icon: Globe,
    title: "Open Financial Access",
    description:
      "Permissionless and borderless. Anyone with Bitcoin can participate in the Mezo economy.",
  },
];

const stats = [
  { label: "Bitcoin L2", value: "Mezo Network" },
  { label: "Wallets Supported", value: "Unisat · OKX · Xverse" },
  { label: "Networks", value: "Mainnet & Testnet" },
];

export default function ConnectScreen() {
  return (
    <div className="relative">
      {/* ───────────── HERO SECTION ───────────── */}
      <section className="relative min-h-[80vh] sm:min-h-[75vh] flex flex-col items-center justify-center px-6 sm:px-8 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.06, 0.12, 0.06] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] rounded-full blur-3xl"
            style={{ background: "#ff004d" }}
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.04, 0.1, 0.04] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute -bottom-32 -right-20 w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] rounded-full blur-3xl"
            style={{ background: "#990070" }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.07, 0.03] }}
            transition={{ duration: 14, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-3xl"
            style={{ background: "#ff004d" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center max-w-2xl mx-auto z-10"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 sm:mb-10 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl"
            style={{
              background: "#ff004d",
              boxShadow: "0 12px 48px rgba(255, 0, 77, 0.3)",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="text-white w-10 h-10 sm:w-12 sm:h-12"
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

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8"
            style={{
              background: "rgba(255, 0, 77, 0.08)",
              color: "#000000",
              border: "1px solid rgba(255, 0, 77, 0.2)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#ff004d", boxShadow: "0 0 8px #ff004d" }}
            />
            Built on the Mezo Network
          </motion.div>

          {/* Main Tagline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-5 sm:mb-6 leading-tight tracking-tight"
            style={{ color: "#000000" }}
          >
            Your Bitcoin.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ff004d, #990070)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Your Finance.
            </span>
            <br />
            Your Freedom.
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg max-w-xl mx-auto mb-10 sm:mb-12 leading-relaxed"
            style={{ color: "#5e5e5e" }}
          >
            Manage your Bitcoin on Mezo — the Layer 2 that unlocks BTC utility
            without selling. Send, receive, and track assets with
            self-custody wallets.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
          >
            <ConnectButton.Custom>
              {({ openConnectModal, connectModalOpen }) => (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openConnectModal}
                  disabled={connectModalOpen}
                  className="relative px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-white font-semibold text-base sm:text-lg shadow-xl transition-all cursor-pointer disabled:opacity-80"
                  style={{
                    background: "#ff004d",
                    boxShadow: "0 8px 32px rgba(255, 0, 77, 0.3)",
                  }}
                >
                  <span className="flex items-center gap-3">
                    <Wallet size={20} />
                    Connect Wallet
                    <ArrowRight size={18} />
                  </span>
                </motion.button>
              )}
            </ConnectButton.Custom>

            <p
              className="text-xs sm:text-sm flex items-center gap-2"
              style={{ color: "#5e5e5e" }}
            >
              <Wallet size={13} />
              Supports Unisat, OKX Wallet, and Xverse
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={24} style={{ color: "#a6a6a6" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ───────────── STATS BAR ───────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-4xl mx-auto px-6 -mt-4 mb-12 sm:mb-16"
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 rounded-2xl sm:rounded-3xl border overflow-hidden"
          style={{
            background: "#ffffff",
            borderColor: "#e0dcd8",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center py-5 sm:py-6 px-4"
              style={{
                borderRight:
                  i < stats.length - 1 ? "1px solid #e0dcd8" : "none",
              }}
            >
              <p
                className="text-xs uppercase tracking-wider font-medium mb-1.5"
                style={{ color: "#a6a6a6" }}
              >
                {stat.label}
              </p>
              <p
                className="text-sm sm:text-base font-semibold"
                style={{ color: "#000000" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ───────────── FEATURES SECTION ───────────── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 pb-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12 sm:mb-14"
        >
          <h2
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{ color: "#000000" }}
          >
            Unlock the Power of Your Bitcoin
          </h2>
          <p
            className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
            style={{ color: "#5e5e5e" }}
          >
            Mezo is building permissionless Bitcoin finance — where you keep
            custody and gain access to a new financial layer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: 0.1 * i }}
              className="group relative rounded-2xl border p-6 sm:p-8 transition-all duration-300 hover:shadow-lg"
              style={{
                background: "#ffffff",
                borderColor: "#e0dcd8",
              }}
            >
              {/* Hover accent bar */}
              <div
                className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(90deg, #ff004d, #990070)",
                }}
              />

              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(255, 0, 77, 0.06)" }}
              >
                <feature.icon size={24} style={{ color: "#ff004d" }} />
              </div>

              <h3
                className="text-base sm:text-lg font-semibold mb-2.5"
                style={{ color: "#000000" }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#5e5e5e" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────────── BOTTOM CTA ───────────── */}
      <section className="relative overflow-hidden">
        <div
          className="max-w-5xl mx-auto px-6 sm:px-8 py-14 sm:py-20"
          style={{ borderTop: "1px solid #e0dcd8" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 text-center"
          >
            <h2
              className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-5"
              style={{ color: "#000000" }}
            >
              Ready to put your Bitcoin to work?
            </h2>
            <p
              className="text-sm sm:text-base max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed"
              style={{ color: "#5e5e5e" }}
            >
              Connect your wallet and start exploring Bitcoin DeFi on the Mezo
              Network. Testnet available for builders.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ConnectButton.Custom>
                {({ openConnectModal, connectModalOpen }) => (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={openConnectModal}
                    disabled={connectModalOpen}
                    className="px-8 py-4 rounded-2xl text-white font-semibold text-sm sm:text-base shadow-lg transition-all cursor-pointer disabled:opacity-80"
                    style={{
                      background: "#ff004d",
                      boxShadow: "0 6px 24px rgba(255, 0, 77, 0.25)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Wallet size={18} />
                      Get Started
                    </span>
                  </motion.button>
                )}
              </ConnectButton.Custom>

              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                {[
                  { icon: Shield, label: "Non-Custodial" },
                  { icon: Zap, label: "L2 Speed" },
                  { icon: Layers, label: "Multi-Asset" },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(255, 0, 77, 0.06)",
                      color: "#ff004d",
                    }}
                  >
                    <badge.icon size={13} />
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
