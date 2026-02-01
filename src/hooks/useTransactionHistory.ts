"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useWalletAccount } from "@mezo-org/passport";
import type { Transaction } from "@/types";
import { useNetwork } from "./useNetwork";

const TX_STORAGE_KEY = "mezo-wallet-txs";

function getStorageKey(address: string, chainId: number) {
  return `${TX_STORAGE_KEY}-${address}-${chainId}`;
}

function readTransactions(address: string, chainId: number): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(getStorageKey(address, chainId));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function writeTransactions(
  address: string,
  chainId: number,
  txs: Transaction[]
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    getStorageKey(address, chainId),
    JSON.stringify(txs.slice(0, 50))
  );
}

// Simple event emitter for transaction updates
const listeners = new Set<() => void>();
let txVersion = 0;
function emitUpdate() {
  txVersion++;
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return txVersion;
}
function getServerSnapshot() {
  return 0;
}

export function useTransactionHistory() {
  const { accountAddress } = useWalletAccount();
  const { chainId } = useNetwork();

  // Re-render when txVersion changes
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const transactions = useMemo(() => {
    if (!accountAddress) return [];
    return readTransactions(accountAddress, chainId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, chainId, txVersion]);

  const addTransaction = useCallback(
    (tx: Transaction) => {
      if (!accountAddress) return;
      const current = readTransactions(accountAddress, chainId);
      const updated = [tx, ...current];
      writeTransactions(accountAddress, chainId, updated);
      emitUpdate();
    },
    [accountAddress, chainId]
  );

  const updateTransaction = useCallback(
    (hash: string, updates: Partial<Transaction>) => {
      if (!accountAddress) return;
      const current = readTransactions(accountAddress, chainId);
      const updated = current.map((tx) =>
        tx.hash === hash ? { ...tx, ...updates } : tx
      );
      writeTransactions(accountAddress, chainId, updated);
      emitUpdate();
    },
    [accountAddress, chainId]
  );

  return { transactions, addTransaction, updateTransaction };
}
