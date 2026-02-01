"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useSwitchChain } from "wagmi";
import { mezoMainnet, mezoTestnet } from "@/config/networks";
import type { NetworkType } from "@/types";

interface NetworkContextValue {
  network: NetworkType;
  toggleNetwork: () => void;
  chainId: number;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>("mainnet");
  const { switchChain } = useSwitchChain();

  const toggleNetwork = useCallback(() => {
    const next = network === "mainnet" ? "testnet" : "mainnet";
    setNetwork(next);
    const chain = next === "mainnet" ? mezoMainnet : mezoTestnet;
    switchChain?.({ chainId: chain.id });
  }, [network, switchChain]);

  const chainId =
    network === "mainnet" ? mezoMainnet.id : mezoTestnet.id;

  return (
    <NetworkContext.Provider value={{ network, toggleNetwork, chainId }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}
