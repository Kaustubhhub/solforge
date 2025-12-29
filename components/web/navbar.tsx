"use client"
import Image from "next/image"
import { ModeToggle } from "./modeToggle"
import WalletButton from "./walletButton"

const Navbar = () => {
    return (
        <div className="flex justify-around items-center py-3 border">
            <div className="flex justify-around items-center gap-2">
                <Image src={"/currency.png"} height={30} width={30} alt="logo" />
                <p className="font-bold text-xl">Solforge</p>
            </div>
            <div className="flex justify-around items-center gap-2">
                <WalletButton />
                <ModeToggle />
            </div>

        </div>
    )
}

export default Navbar