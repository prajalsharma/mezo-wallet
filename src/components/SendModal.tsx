"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Fuel,
  Info,
} from "lucide-react";
import { parseEther, formatEther, isAddress } from "viem";
import {
  useSendTransaction,
  useEstimateGas,
  useGasPrice,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useWalletAccount } from "@mezo-org/passport";
import { useNetwork } from "@/hooks/useNetwork";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { getExplorerTxUrl } from "@/config/networks";
import type { Asset, SendStep } from "@/types";

interface SendModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export default function SendModal({ asset, onClose }: SendModalProps) {
  const [step, setStep] = useState<SendStep>("input");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [processedHash, setProcessedHash] = useState<string | null>(null);

  const { accountAddress } = useWalletAccount();
  const { network, chainId } = useNetwork();
  const { addTransaction, updateTransaction } = useTransactionHistory();

  const { sendTransactionAsync } = useSendTransaction();

  // Gas estimation
  const { data: gasEstimate } = useEstimateGas({
    to: isAddress(recipient) ? (recipient as `0x${string}`) : undefined,
    value: amount ? parseEther(amount) : undefined,
    chainId,
  });

  const { data: gasPrice } = useGasPrice({ chainId });

  // Wait for tx receipt
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (!receipt || !txHash || txHash === processedHash) return;
    setProcessedHash(txHash);
    if (receipt.status === "success") {
      setStep("success");
      updateTransaction(txHash, { status: "confirmed" });
    } else {
      setStep("error");
      setError("Transaction failed on chain");
      updateTransaction(txHash, { status: "failed" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt, txHash]);

  if (!asset) return null;

  const estimatedGas =
    gasEstimate && gasPrice
      ? formatEther(gasEstimate * gasPrice)
      : null;

  const validate = () => {
    if (!isAddress(recipient)) {
      setError("Please enter a valid Mezo address");
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    if (parseFloat(amount) > parseFloat(asset.balance)) {
      setError("Insufficient balance");
      return false;
    }
    setError("");
    return true;
  };

  const handleContinue = () => {
    if (validate()) {
      setStep("confirm");
    }
  };

  const handleSend = async () => {
    setStep("sending");
    setError("");
    try {
      const hash = await sendTransactionAsync({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
        chainId,
      });
      setTxHash(hash);

      addTransaction({
        hash,
        from: accountAddress || "",
        to: recipient,
        value: amount,
        symbol: asset.symbol,
        timestamp: Date.now(),
        status: "pending",
        type: "send",
      });
    } catch (err: unknown) {
      setStep("error");
      const message =
        err instanceof Error ? err.message : "Transaction failed";
      setError(
        message.includes("User rejected")
          ? "Transaction was rejected"
          : message.slice(0, 100)
      );
    }
  };

  const handleClose = () => {
    setStep("input");
    setRecipient("");
    setAmount("");
    setError("");
    setTxHash(undefined);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 backdrop-blur-sm"
          style={{ background: "rgba(0, 0, 0, 0.6)" }}
          onClick={handleClose}
        />

        {/* Modal - bottom sheet on mobile, centered on desktop */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 40 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border-t sm:border shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh] overflow-y-auto"
          style={{
            background: "#ffffff",
            borderColor: "#e0dcd8",
          }}
        >
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: "#e0dcd8" }} />
          </div>

          {/* Header */}
          <div
            className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b"
            style={{ borderColor: "#e0dcd8" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "#f4f0ed" }}
              >
                <Image src={asset.icon} alt={asset.symbol} width={28} height={28} />
              </div>
              <div>
                <h3 className="font-semibold text-base" style={{ color: "#000000" }}>
                  Send {asset.symbol}
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: "#5e5e5e" }}>
                  Balance: {asset.balance} {asset.symbol}
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="p-2.5 rounded-xl transition-colors hover:bg-gray-100"
              style={{ color: "#5e5e5e" }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="px-5 sm:px-7 py-6 sm:py-7">
            <AnimatePresence mode="wait">
              {/* INPUT STEP */}
              {step === "input" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  <div>
                    <label
                      className="block text-xs sm:text-sm font-medium mb-2.5"
                      style={{ color: "#5e5e5e" }}
                    >
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => {
                        setRecipient(e.target.value);
                        setError("");
                      }}
                      placeholder="0x..."
                      className="w-full px-4 py-3.5 rounded-xl border text-sm font-mono focus:outline-none transition-all"
                      style={{
                        background: "#f4f0ed",
                        borderColor: "#e0dcd8",
                        color: "#000000",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs sm:text-sm font-medium mb-2.5"
                      style={{ color: "#5e5e5e" }}
                    >
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setError("");
                        }}
                        placeholder="0.00"
                        step="any"
                        min="0"
                        className="w-full px-4 py-3.5 pr-20 rounded-xl border text-sm font-mono focus:outline-none transition-all"
                        style={{
                          background: "#f4f0ed",
                          borderColor: "#e0dcd8",
                          color: "#000000",
                        }}
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAmount(asset.balance)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{
                          background: "rgba(255, 0, 77, 0.1)",
                          color: "#ff004d",
                        }}
                      >
                        MAX
                      </motion.button>
                    </div>
                  </div>

                  {/* Gas Estimate */}
                  {estimatedGas && (
                    <div
                      className="flex items-start gap-2.5 p-3.5 rounded-xl border"
                      style={{
                        background: "rgba(230, 168, 23, 0.08)",
                        borderColor: "rgba(230, 168, 23, 0.2)",
                      }}
                    >
                      <Fuel size={15} className="mt-0.5 flex-shrink-0" style={{ color: "#e6a817" }} />
                      <div>
                        <p className="text-xs sm:text-sm" style={{ color: "#000000" }}>
                          <span className="font-medium">Estimated fee:</span>{" "}
                          {parseFloat(estimatedGas).toFixed(10)} BTC
                        </p>
                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#5e5e5e" }}>
                          <Info size={10} />
                          Network cost to process your transaction
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs sm:text-sm flex items-center gap-1.5"
                      style={{ color: "#dc3545" }}
                    >
                      <AlertCircle size={14} />
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinue}
                    className="w-full py-3.5 sm:py-4 rounded-xl text-white font-semibold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
                    style={{
                      background: "#ff004d",
                      boxShadow: "0 4px 16px rgba(255, 0, 77, 0.25)",
                    }}
                  >
                    Continue
                    <ArrowRight size={16} />
                  </motion.button>
                </motion.div>
              )}

              {/* CONFIRM STEP */}
              {step === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  <div
                    className="rounded-xl sm:rounded-2xl p-4 sm:p-5 border space-y-3.5"
                    style={{ background: "#f4f0ed", borderColor: "#e0dcd8" }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm" style={{ color: "#5e5e5e" }}>Sending</span>
                      <span className="text-sm sm:text-base font-semibold" style={{ color: "#000000" }}>
                        {amount} {asset.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm" style={{ color: "#5e5e5e" }}>To</span>
                      <span className="text-xs sm:text-sm font-mono" style={{ color: "#000000" }}>
                        {recipient.slice(0, 10)}...{recipient.slice(-6)}
                      </span>
                    </div>
                    {estimatedGas && (
                      <div
                        className="flex justify-between items-center border-t pt-3.5"
                        style={{ borderColor: "#e0dcd8" }}
                      >
                        <span className="text-xs sm:text-sm" style={{ color: "#5e5e5e" }}>
                          Network Fee
                        </span>
                        <span className="text-xs sm:text-sm" style={{ color: "#000000" }}>
                          ~{parseFloat(estimatedGas).toFixed(10)} BTC
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className="flex items-start gap-2.5 p-3.5 rounded-xl border"
                    style={{
                      background: "rgba(230, 168, 23, 0.08)",
                      borderColor: "rgba(230, 168, 23, 0.2)",
                    }}
                  >
                    <AlertCircle size={15} className="mt-0.5 flex-shrink-0" style={{ color: "#e6a817" }} />
                    <p className="text-xs sm:text-sm" style={{ color: "#5e5e5e" }}>
                      Please verify the recipient address. Transactions on the blockchain cannot be reversed.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStep("input")}
                      className="flex-1 py-3.5 rounded-xl border font-medium text-sm sm:text-base transition-colors"
                      style={{
                        background: "#f4f0ed",
                        borderColor: "#e0dcd8",
                        color: "#5e5e5e",
                      }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSend}
                      className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm sm:text-base shadow-lg transition-all"
                      style={{
                        background: "#ff004d",
                        boxShadow: "0 4px 16px rgba(255, 0, 77, 0.25)",
                      }}
                    >
                      Confirm Send
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* SENDING STEP */}
              {step === "sending" && (
                <motion.div
                  key="sending"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-10 sm:py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 size={44} style={{ color: "#ff004d" }} />
                  </motion.div>
                  <p className="mt-5 font-medium text-base" style={{ color: "#000000" }}>
                    {txHash ? "Waiting for confirmation..." : "Sending transaction..."}
                  </p>
                  <p className="text-sm mt-1.5" style={{ color: "#5e5e5e" }}>
                    {txHash
                      ? "Your transaction is being confirmed on the network"
                      : "Please confirm in your wallet"}
                  </p>
                  {txHash && (
                    <a
                      href={getExplorerTxUrl(network, txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-sm hover:underline"
                      style={{ color: "#ff004d" }}
                    >
                      View on Explorer →
                    </a>
                  )}
                </motion.div>
              )}

              {/* SUCCESS STEP */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-10 sm:py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(45, 138, 78, 0.1)" }}
                  >
                    <CheckCircle2 size={40} style={{ color: "#2d8a4e" }} />
                  </motion.div>
                  <p className="mt-5 font-medium text-base" style={{ color: "#000000" }}>
                    Transaction Confirmed!
                  </p>
                  <p className="text-sm mt-1.5 text-center" style={{ color: "#5e5e5e" }}>
                    {amount} {asset.symbol} sent successfully
                  </p>
                  {txHash && (
                    <a
                      href={getExplorerTxUrl(network, txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-sm hover:underline"
                      style={{ color: "#ff004d" }}
                    >
                      View on Explorer →
                    </a>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClose}
                    className="mt-7 px-8 py-2.5 rounded-xl border text-sm font-medium transition-colors"
                    style={{
                      background: "#f4f0ed",
                      borderColor: "#e0dcd8",
                      color: "#5e5e5e",
                    }}
                  >
                    Done
                  </motion.button>
                </motion.div>
              )}

              {/* ERROR STEP */}
              {step === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-10 sm:py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(220, 53, 69, 0.1)" }}
                  >
                    <AlertCircle size={40} style={{ color: "#dc3545" }} />
                  </motion.div>
                  <p className="mt-5 font-medium text-base" style={{ color: "#000000" }}>
                    Transaction Failed
                  </p>
                  <p className="text-sm mt-1.5 text-center max-w-xs" style={{ color: "#5e5e5e" }}>
                    {error || "Something went wrong"}
                  </p>
                  <div className="flex gap-3 mt-7">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleClose}
                      className="px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors"
                      style={{
                        background: "#f4f0ed",
                        borderColor: "#e0dcd8",
                        color: "#5e5e5e",
                      }}
                    >
                      Close
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setStep("input");
                        setError("");
                        setTxHash(undefined);
                      }}
                      className="px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-colors"
                      style={{
                        background: "#ff004d",
                      }}
                    >
                      Try Again
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
