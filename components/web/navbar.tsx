"use client"
import Image from "next/image"
import { ModeToggle } from "./modeToggle"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { buttonVariants } from "../ui/button"

const Navbar = () => {
    return (
        <div className="flex justify-around items-center py-3 border">
            <div className="flex justify-around items-center gap-2">
                <Image src={"/currency.png"} height={30} width={30} alt="logo" />
                <p className="font-bold text-xl">Solforge</p>
            </div>
            <div className="flex justify-around items-center gap-2">
                <ModeToggle />
                <WalletMultiButton/>
            </div>

        </div>
    )
}

export default Navbar