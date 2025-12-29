"use client"

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState } from "react"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token"

const TokenLaunchPad = () => {
    const wallet = useWallet()
    const { connection } = useConnection()
    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [Supply, setSupply] = useState("")
    const [image, setImage] = useState<File | null>()
    
    const handleCreateToken = async () => {
        if (!wallet.publicKey) {
            toast.error("Please connect a wallet.")
            return
        }

        const mintKeypair = Keypair.generate();
        console.log(mintKeypair.publicKey.toBase58())
        const lamports = await getMinimumBalanceForRentExemptMint(connection);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID
            }),
            createInitializeMint2Instruction(mintKeypair.publicKey, 9, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID)
        )

        transaction.feePayer = wallet.publicKey
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintKeypair)

        await wallet.sendTransaction(transaction, connection);
        console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`)
    }
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