# Mezo Wallet Manager

A production-ready Bitcoin Wallet Manager dApp for the Mezo Network. Manage BTC and ERC-20 assets, send tokens, and track transactions with a modern, responsive UI.

## Features

- **Bitcoin Wallet Connect** — Connect via Unisat, OKX Wallet, and Xverse through Mezo Passport (built on RainbowKit)
- **Asset Dashboard** — View BTC balance, ERC-20 tokens, and total portfolio value
- **Send Assets** — Transfer BTC and tokens to any Mezo address with gas estimation and confirmation UI
- **Network Toggle** — Switch between Mezo Mainnet and Testnet
- **Transaction History** — Track sent transactions with status indicators (confirmed/pending/failed)
- **Modern UI** — Gradients, animations, micro-interactions, responsive design

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4
- **Wallet**: @mezo-org/passport (RainbowKit-based)
- **Web3**: wagmi v2, viem v2
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Networks

| Network | Chain ID | RPC |
|---------|----------|-----|
| Mezo Mainnet | 31612 | https://rpc-http.mezo.boar.network |
| Mezo Testnet | 31611 | https://rpc.test.mezo.org |

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- A WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)

### Install

```bash
git clone <repository-url>
cd mezo-wallet
npm install
```

### Configure

Create `.env.local` with your WalletConnect Project ID:

```env
NEXT_PUBLIC_WC_PROJECT_ID=your_project_id_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `NEXT_PUBLIC_WC_PROJECT_ID` to environment variables
4. Deploy

### Netlify

1. Push to GitHub
2. Import in [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add environment variables

## Project Structure

```
src/
├── app/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/
│   ├── AssetCard.tsx      # Individual asset display card
│   ├── AssetList.tsx      # Asset list with refresh
│   ├── ConnectScreen.tsx  # Landing/connect wallet screen
│   ├── Dashboard.tsx      # Main dashboard with tabs
│   ├── Header.tsx         # Navigation header with network toggle
│   ├── Providers.tsx      # Wagmi/RainbowKit/Passport providers
│   ├── SendModal.tsx      # Send transaction modal with gas estimation
│   ├── TransactionHistory.tsx  # Transaction history list
│   └── WalletSummary.tsx  # Wallet summary card
├── config/
│   ├── networks.ts        # Mezo chain definitions and explorers
│   └── wagmi.ts           # Wagmi config with Bitcoin wallets
├── hooks/
│   ├── useAssets.ts       # Asset balance fetching
│   ├── useNetwork.tsx     # Network toggle context
│   └── useTransactionHistory.ts  # Local transaction history
└── types/
    └── index.ts           # TypeScript type definitions
```

## Testing

### Manual Testing Checklist

- [ ] Wallet connect with Unisat, OKX, Xverse
- [ ] Dashboard shows BTC balance and token balances
- [ ] Network toggle switches between Mainnet/Testnet
- [ ] Send flow: address input → amount → gas estimate → confirm → status
- [ ] Transaction history shows sent transactions
- [ ] Responsive on mobile and desktop
- [ ] Error states display correctly

### Testnet Testing

1. Get testnet BTC from the [Mezo Faucet](https://faucet.test.mezo.org)
2. Switch to Testnet using the network toggle
3. Connect your wallet
4. Test sending a small amount to another address

## License

MIT
