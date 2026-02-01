"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { PassportProvider } from "@mezo-org/passport";
import { useState } from "react";
import { wagmiConfig } from "@/config/wagmi";
import { NetworkProvider, useNetwork } from "@/hooks/useNetwork";
import "@rainbow-me/rainbowkit/styles.css";

function InnerProviders({ children }: { children: React.ReactNode }) {
  const { network } = useNetwork();

  return (
    <PassportProvider environment={network}>
      {children}
    </PassportProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchInterval: 30_000,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#2d2275",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <NetworkProvider>
            <InnerProviders>{children}</InnerProviders>
          </NetworkProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
