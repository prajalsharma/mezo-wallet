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
      <div className="flex items-center gap-2 mb-4">
        <History size={18} style={{ color: "#2d2275" }} />
        <h2 className="text-lg font-semibold" style={{ color: "#100d2e" }}>
          Transaction History
        </h2>
      </div>

      {transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
          style={{ color: "#5a5a7a" }}
        >
          <History size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No transactions yet</p>
          <p className="text-xs mt-1">
            Your send transactions will appear here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
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
                  className="group flex items-center justify-between p-4 rounded-xl border transition-all duration-200"
                  style={{
                    background: "#ffffff",
                    borderColor: "#d4d4e0",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: status.bg }}
                    >
                      {tx.type === "send" ? (
                        <ArrowUpRight size={16} style={{ color: status.color }} />
                      ) : (
                        <ArrowDownLeft size={16} style={{ color: status.color }} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium" style={{ color: "#100d2e" }}>
                          {tx.type === "send" ? "Sent" : "Received"}{" "}
                          {tx.symbol}
                        </p>
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
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
                        className="text-xs font-mono mt-0.5"
                        style={{ color: "#5a5a7a" }}
                      >
                        {truncateHash(tx.hash)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium" style={{ color: "#100d2e" }}>
                        {tx.type === "send" ? "-" : "+"}
                        {tx.value} {tx.symbol}
                      </p>
                      <p className="text-xs" style={{ color: "#5a5a7a" }}>
                        {formatTimestamp(tx.timestamp)}
                      </p>
                    </div>
                    <a
                      href={getExplorerTxUrl(network, tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="View on explorer"
                      style={{ color: "#5a5a7a" }}
                    >
                      <ExternalLink size={14} />
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
