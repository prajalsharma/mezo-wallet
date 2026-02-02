"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  History,
} from "lucide-react";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { useNetwork } from "@/hooks/useNetwork";
import { getExplorerTxUrl } from "@/config/networks";

function truncateHash(hash: string) {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function formatTimestamp(ts: number) {
  const date = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const statusConfig = {
  confirmed: {
    icon: CheckCircle2,
    color: "#2d8a4e",
    bg: "rgba(45, 138, 78, 0.1)",
    label: "Confirmed",
  },
  pending: {
    icon: Clock,
    color: "#e6a817",
    bg: "rgba(230, 168, 23, 0.1)",
    label: "Pending",
  },
  failed: {
    icon: XCircle,
    color: "#dc3545",
    bg: "rgba(220, 53, 69, 0.1)",
    label: "Failed",
  },
};

export default function TransactionHistory() {
  const { transactions } = useTransactionHistory();
  const { network } = useNetwork();

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-6 sm:mb-7">
        <History size={20} style={{ color: "#ff004d" }} />
        <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "#000000" }}>
          Transaction History
        </h2>
        {transactions.length > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255, 0, 77, 0.08)", color: "#ff004d" }}
          >
            {transactions.length}
          </span>
        )}
      </div>

      {transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 sm:py-20"
          style={{ color: "#5e5e5e" }}
        >
          <History size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm sm:text-base font-medium">No transactions yet</p>
          <p className="text-xs sm:text-sm mt-1.5">
            Your send transactions will appear here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence>
            {transactions.map((tx, i) => {
              const status = statusConfig[tx.status];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={tx.hash}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className="group flex items-center justify-between p-5 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-200 hover:shadow-sm"
                  style={{
                    background: "#ffffff",
                    borderColor: "#e0dcd8",
                  }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: status.bg }}
                    >
                      {tx.type === "send" ? (
                        <ArrowUpRight size={17} style={{ color: status.color }} />
                      ) : (
                        <ArrowDownLeft size={17} style={{ color: status.color }} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm sm:text-base font-medium" style={{ color: "#000000" }}>
                          {tx.type === "send" ? "Sent" : "Received"}{" "}
                          {tx.symbol}
                        </p>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium"
                          style={{
                            background: status.bg,
                            color: status.color,
                          }}
                        >
                          <StatusIcon size={10} />
                          {status.label}
                        </span>
                      </div>
                      <p
                        className="text-xs font-mono mt-1 truncate"
                        style={{ color: "#5e5e5e" }}
                      >
                        {truncateHash(tx.hash)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-medium" style={{ color: "#000000" }}>
                        {tx.type === "send" ? "-" : "+"}
                        {tx.value} {tx.symbol}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#5e5e5e" }}>
                        {formatTimestamp(tx.timestamp)}
                      </p>
                    </div>
                    <a
                      href={getExplorerTxUrl(network, tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50"
                      data-tooltip="View on explorer"
                      style={{ color: "#5e5e5e" }}
                    >
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
