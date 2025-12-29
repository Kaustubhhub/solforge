"use client"

import dynamic from "next/dynamic"

const WalletButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (m) => m.WalletMultiButton
    ),
  { ssr: false }
)

export default WalletButton
