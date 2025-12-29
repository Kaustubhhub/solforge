"use client"

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState } from "react"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createMetadataAccountV3, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, percentAmount } from "@metaplex-foundation/umi";
import { createInitializeMintInstruction, MINT_SIZE, TOKEN_PROGRAM_ID, getMinimumBalanceForRentExemptMint } from "@solana/spl-token"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js"

const TokenLaunchPad = () => {
    const wallet = useWallet()
    const { connection } = useConnection()
    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [Supply, setSupply] = useState("")
    const [image, setImage] = useState<File | null>()


    const handleCreateToken = async () => {
        try {
            if (!wallet.publicKey) {
                throw new Error("Wallet not connected");
            }

            const mintKeypair = Keypair.generate();

            console.log(mintKeypair.publicKey.toBase58())

            const lamports =
                await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: MINT_SIZE,
                    lamports,
                    programId: TOKEN_PROGRAM_ID,
                }),
                createInitializeMintInstruction(
                    mintKeypair.publicKey,
                    9,
                    wallet.publicKey,
                    null
                )
            );

            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (
                await connection.getLatestBlockhash()
            ).blockhash;

            transaction.partialSign(mintKeypair);

            const sig = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(sig, "confirmed");

            console.log("✅ Mint created:", mintKeypair.publicKey.toBase58());

            const umi = createUmi(connection.rpcEndpoint).use(
                walletAdapterIdentity(wallet)
            );

            const metadataTx = await createMetadataAccountV3(umi, {
                mint: publicKey(mintKeypair.publicKey.toBase58()),
                mintAuthority: umi.identity,
                payer: umi.identity,
                updateAuthority: umi.identity,

                data: {
                    name: "Best Token Ever",
                    symbol: "BTE",
                    uri: "ipfs://QmcAb723KChFCzqiwVo3khj2tUFg9mzPHSFXkTsJ7a83uk",
                    sellerFeeBasisPoints: 500, // 5%
                    creators: null,
                    collection: null,
                    uses: null,
                },

                isMutable: true,
                collectionDetails: null,
            }).sendAndConfirm(umi);

            console.log("Metadata TX:", metadataTx.signature);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="text-center my-3 mx-60">
            <h1 className="font-bold text-2xl">Token Launch Pad</h1>
            <div className="flex flex-col gap-3">
                <Label htmlFor="token-name">Name of token</Label>
                <Input id="token-name"
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                    type="text" placeholder="dogecoin" />

                <Label htmlFor="token-symbol">Symbol of token</Label>
                <Input
                    onChange={(e) => {
                        setSymbol(e.target.value)
                    }}
                    id="token-symbol" type="text" placeholder="DGC" />

                <Label htmlFor="token-supply">Token supply</Label>
                <Input
                    onChange={(e) => {
                        setSupply(e.target.value)
                    }}
                    id="token-supply" type="text" placeholder="100" />

                <Label htmlFor="token-image">Image for token</Label>
                <Input
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setImage(file)
                    }}
                    id="token-image" type="file" />
            </div>
            <Button onClick={handleCreateToken} className="my-4 w-full">create mint account</Button>
        </main>
    )
}

export default TokenLaunchPad