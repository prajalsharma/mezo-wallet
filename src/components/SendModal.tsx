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
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 backdrop-blur-sm"
          style={{ background: "rgba(16, 13, 46, 0.6)" }}
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
          style={{
            background: "#ffffff",
            borderColor: "#d4d4e0",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: "#d4d4e0" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#f5f5f8" }}
              >
                <Image src={asset.icon} alt={asset.symbol} width={24} height={24} />
              </div>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: "#100d2e" }}>
                  Send {asset.symbol}
                </h3>
                <p className="text-xs" style={{ color: "#5a5a7a" }}>
                  Balance: {asset.balance} {asset.symbol}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#5a5a7a" }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            <AnimatePresence mode="wait">
              {/* INPUT STEP */}
              {step === "input" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "#5a5a7a" }}
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
                      className="w-full px-4 py-3 rounded-xl border text-sm font-mono focus:outline-none transition-all"
                      style={{
                        background: "#f5f5f8",
                        borderColor: "#d4d4e0",
                        color: "#100d2e",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "#5a5a7a" }}
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
                        className="w-full px-4 py-3 pr-20 rounded-xl border text-sm font-mono focus:outline-none transition-all"
                        style={{
                          background: "#f5f5f8",
                          borderColor: "#d4d4e0",
                          color: "#100d2e",
                        }}
                      />
                      <button
                        onClick={() => setAmount(asset.balance)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-xs font-semibold transition-colors"
                        style={{
                          background: "rgba(45, 34, 117, 0.1)",
                          color: "#2d2275",
                        }}
                      >
                        MAX
                      </button>
                    </div>
                  </div>

                  {/* Gas Estimate */}
                  {estimatedGas && (
                    <div
                      className="flex items-start gap-2 p-3 rounded-xl border"
                      style={{
                        background: "rgba(242, 227, 150, 0.15)",
                        borderColor: "rgba(242, 227, 150, 0.3)",
                      }}
                    >
                      <Fuel size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#e6a817" }} />
                      <div>
                        <p className="text-xs" style={{ color: "#100d2e" }}>
                          <span className="font-medium">Estimated fee:</span>{" "}
                          {parseFloat(estimatedGas).toFixed(10)} BTC
                        </p>
                        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "#5a5a7a" }}>
                          <Info size={10} />
                          This covers the network cost to process your transaction
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs flex items-center gap-1"
                      style={{ color: "#dc3545" }}
                    >
                      <AlertCircle size={12} />
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleContinue}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #89a3c6, #2d2275)",
                      boxShadow: "0 4px 16px rgba(45, 34, 117, 0.25)",
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
                  className="space-y-4"
                >
                  <div
                    className="rounded-xl p-4 border space-y-3"
                    style={{ background: "#f5f5f8", borderColor: "#d4d4e0" }}
                  >
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "#5a5a7a" }}>Sending</span>
                      <span className="text-sm font-semibold" style={{ color: "#100d2e" }}>
                        {amount} {asset.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "#5a5a7a" }}>To</span>
                      <span className="text-xs font-mono" style={{ color: "#100d2e" }}>
                        {recipient.slice(0, 10)}...{recipient.slice(-6)}
                      </span>
                    </div>
                    {estimatedGas && (
                      <div
                        className="flex justify-between border-t pt-3"
                        style={{ borderColor: "#d4d4e0" }}
                      >
                        <span className="text-xs" style={{ color: "#5a5a7a" }}>
                          Network Fee
                        </span>
                        <span className="text-xs" style={{ color: "#100d2e" }}>
                          ~{parseFloat(estimatedGas).toFixed(10)} BTC
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className="flex items-start gap-2 p-3 rounded-xl border"
                    style={{
                      background: "rgba(242, 227, 150, 0.1)",
                      borderColor: "rgba(242, 227, 150, 0.25)",
                    }}
                  >
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#e6a817" }} />
                    <p className="text-xs" style={{ color: "#5a5a7a" }}>
                      Please verify the recipient address. Transactions on the blockchain cannot be reversed.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("input")}
                      className="flex-1 py-3 rounded-xl border font-medium text-sm transition-colors"
                      style={{
                        background: "#f5f5f8",
                        borderColor: "#d4d4e0",
                        color: "#5a5a7a",
                      }}
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleSend}
                      className="flex-1 py-3 rounded-xl text-white font-semibold text-sm shadow-lg transition-all"
                      style={{
                        background: "linear-gradient(135deg, #89a3c6, #2d2275)",
                        boxShadow: "0 4px 16px rgba(45, 34, 117, 0.25)",
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
                  className="flex flex-col items-center py-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 size={40} style={{ color: "#2d2275" }} />
                  </motion.div>
                  <p className="mt-4 font-medium" style={{ color: "#100d2e" }}>
                    {txHash ? "Waiting for confirmation..." : "Sending transaction..."}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#5a5a7a" }}>
                    {txHash
                      ? "Your transaction is being confirmed on the network"
                      : "Please confirm in your wallet"}
                  </p>
                  {txHash && (
                    <a
                      href={getExplorerTxUrl(network, txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-xs hover:underline"
                      style={{ color: "#2d2275" }}
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
                  className="flex flex-col items-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(242, 227, 150, 0.2)" }}
                  >
                    <CheckCircle2 size={36} style={{ color: "#2d8a4e" }} />
                  </motion.div>
                  <p className="mt-4 font-medium" style={{ color: "#100d2e" }}>
                    Transaction Confirmed!
                  </p>
                  <p className="text-xs mt-1 text-center" style={{ color: "#5a5a7a" }}>
                    {amount} {asset.symbol} sent successfully
                  </p>
                  {txHash && (
                    <a
                      href={getExplorerTxUrl(network, txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-xs hover:underline"
                      style={{ color: "#2d2275" }}
                    >
                      View on Explorer →
                    </a>
                  )}
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2 rounded-xl border text-sm font-medium transition-colors"
                    style={{
                      background: "#f5f5f8",
                      borderColor: "#d4d4e0",
                      color: "#5a5a7a",
                    }}
                  >
                    Done
                  </button>
                </motion.div>
              )}

              {/* ERROR STEP */}
              {step === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(220, 53, 69, 0.1)" }}
                  >
                    <AlertCircle size={36} style={{ color: "#dc3545" }} />
                  </motion.div>
                  <p className="mt-4 font-medium" style={{ color: "#100d2e" }}>
                    Transaction Failed
                  </p>
                  <p className="text-xs mt-1 text-center max-w-xs" style={{ color: "#5a5a7a" }}>
                    {error || "Something went wrong"}
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
                      style={{
                        background: "#f5f5f8",
                        borderColor: "#d4d4e0",
                        color: "#5a5a7a",
                      }}
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setStep("input");
                        setError("");
                        setTxHash(undefined);
                      }}
                      className="px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors"
                      style={{
                        background: "linear-gradient(135deg, #89a3c6, #2d2275)",
                      }}
                    >
                      Try Again
                    </button>
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
