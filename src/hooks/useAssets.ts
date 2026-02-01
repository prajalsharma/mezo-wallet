"use client";

import { useMemo } from "react";
import { useBalance } from "wagmi";
import { useTokensBalances, useWalletAccount } from "@mezo-org/passport";
import type { Asset } from "@/types";
import { useNetwork } from "./useNetwork";

const TOKEN_ICONS: Record<string, string> = {
  BTC: "/icons/btc.svg",
  mcbBTC: "/icons/btc.svg",
  mDAI: "/icons/dai.svg",
  mFBTC: "/icons/btc.svg",
  mSolvBTC: "/icons/btc.svg",
  mswBTC: "/icons/btc.svg",
  mT: "/icons/mezo.svg",
  mUSDC: "/icons/usdc.svg",
  mUSDe: "/icons/usde.svg",
  mUSDT: "/icons/usdt.svg",
  mxSolvBTC: "/icons/btc.svg",
  MUSD: "/icons/musd.svg",
  MEZO: "/icons/mezo.svg",
};

const TOKEN_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  mcbBTC: "Mezo cbBTC",
  mDAI: "Mezo DAI",
  mFBTC: "Mezo FBTC",
  mSolvBTC: "Mezo SolvBTC",
  mswBTC: "Mezo swBTC",
  mT: "Mezo T",
  mUSDC: "Mezo USDC",
  mUSDe: "Mezo USDe",
  mUSDT: "Mezo USDT",
  mxSolvBTC: "Mezo xSolvBTC",
  MUSD: "Mezo USD",
  MEZO: "Mezo Token",
};

export function useAssets() {
  const { chainId } = useNetwork();
  const { accountAddress } = useWalletAccount();

  const nativeBalance = useBalance({
    address: accountAddress,
    chainId,
  });

  const tokensBalances = useTokensBalances();

  const assets = useMemo<Asset[]>(() => {
    const result: Asset[] = [];

    // Add native BTC balance
    if (nativeBalance.data) {
      result.push({
        symbol: "BTC",
        name: "Bitcoin",
        balance: parseFloat(nativeBalance.data.formatted).toFixed(8),
        balanceUsd: "",
        decimals: nativeBalance.data.decimals,
        rawBalance: nativeBalance.data.value,
        icon: TOKEN_ICONS.BTC,
      });
    }

    // Add token balances from passport
    if (tokensBalances.data) {
      const tokenData = tokensBalances.data as Record<
        string,
        {
          value: bigint;
          formatted: string;
          symbol: string;
          decimals: number;
          usd: { value: bigint; formatted: string };
        }
      >;
      for (const [key, balance] of Object.entries(tokenData)) {
        if (key === "BTC") continue; // already added from native
        if (balance.value === BigInt(0)) continue;
        result.push({
          symbol: key,
          name: TOKEN_NAMES[key] || key,
          balance: parseFloat(balance.formatted).toFixed(
            key.includes("USD") ? 2 : 8
          ),
          balanceUsd: balance.usd?.formatted || "",
          decimals: balance.decimals,
          rawBalance: balance.value,
          icon: TOKEN_ICONS[key] || "/icons/token.svg",
        });
      }
    }

    return result;
  }, [nativeBalance.data, tokensBalances.data]);

  const totalUsdValue = useMemo(() => {
    if (!tokensBalances.data) return "0.00";
    const tokenData = tokensBalances.data as Record<
      string,
      { usd: { value: bigint; formatted: string } }
    >;
    let total = 0;
    for (const balance of Object.values(tokenData)) {
      total += parseFloat(balance.usd?.formatted || "0");
    }
    return total.toFixed(2);
  }, [tokensBalances.data]);

  return {
    assets,
    totalUsdValue,
    isLoading: nativeBalance.isLoading || tokensBalances.isLoading,
    refetch: () => {
      nativeBalance.refetch();
      tokensBalances.refetch();
    },
  };
}
