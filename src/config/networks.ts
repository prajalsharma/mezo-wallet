import { mezoMainnet, mezoTestnet } from "@mezo-org/passport";
import type { NetworkType } from "@/types";

export { mezoMainnet, mezoTestnet };

export const NETWORKS = {
  mainnet: mezoMainnet,
  testnet: mezoTestnet,
} as const;

export const EXPLORER_URLS: Record<NetworkType, string> = {
  mainnet: "https://explorer.mezo.org",
  testnet: "https://explorer.test.mezo.org",
};

export function getExplorerTxUrl(
  network: NetworkType,
  txHash: string
): string {
  return `${EXPLORER_URLS[network]}/tx/${txHash}`;
}

export function getExplorerAddressUrl(
  network: NetworkType,
  address: string
): string {
  return `${EXPLORER_URLS[network]}/address/${address}`;
}
