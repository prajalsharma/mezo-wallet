import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@mezo-org/passport",
    "@mezo-org/orangekit",
    "@mezo-org/orangekit-smart-account",
    "@mezo-org/orangekit-contracts",
    "@mezo-org/mezo-clay",
    "@mezo-org/mezod-contracts",
    "@mezo-org/musd-contracts",
    "@mezo-org/sign-in-with-wallet",
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@mezo-org/orangekit-smart-account/src": path.resolve(
        __dirname,
        "node_modules/@mezo-org/orangekit-smart-account/dist/src"
      ),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
    };
    return config;
  },
};

export default nextConfig;
