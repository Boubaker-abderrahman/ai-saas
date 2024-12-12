"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "./ui/button"
import { Montserrat } from "next/font/google"
import { SignInButton } from "@clerk/nextjs"

const font = Montserrat ({
    weight:"600",
    subsets : ["latin"]
})


const LandingNavbar = () => {
  return (
        <nav className="p-4 bg-transparent flex items-center justify-between">
            <Link href="/" className="flex items-center">
                {/* <div className="relative h-8 w-8 mr-4">
                <Image
                    fill
                    alt="Logo"
                    I
                    src="/logo.png"
                /> 
                </div> */}
                <h1 className={cn("text-2xl font-bold text-white", font.className)}>
                    Genius
                </h1>
            </Link>
            <div className="flex items-center gap-x-2">
                <SignInButton>
                    <Button variant="outline" className="rounded-full">
                        Get started
                    </Button>
                </SignInButton>
            </div>
        </nav>
        
  )
}

export default LandingNavbar
