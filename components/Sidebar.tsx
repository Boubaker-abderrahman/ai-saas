"use client"

import Link from "next/link";

import { Code, FileText, ImageIcon, Languages, LayoutDashboard, MessagesSquare, Settings} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import FreeCounter from "./FreeCounter";
import { Montserrat } from "next/font/google";

// const montserrat = Montserrat({weight:'600' , subsets :['latin']})

const routes =[
    {
        href : "/dashboard" ,
        label : "Dashboard",
        icon : LayoutDashboard,
        color: "text-sky-500"
    },
    {
        href : "/conversation" ,
        label : "Conversation",
        icon : MessagesSquare,
        color: "text-violet-500"
    },
    {
        href : "/image" ,
        label : "Image Generation",
        icon : ImageIcon,
        color: "text-pink-700"
    },
    {
        href : "/translate" ,
        label : "Text Translation",
        icon : Languages,
        color: "text-orange-500"
    },
    {
        href: "/summarize",
        label: "Text Summarization",
        icon: FileText ,
        color: "text-emerald-500"
    },
    {
        href : "/code" ,
        label : "Code Generation",
        icon : Code,
        color: "text-green-700"
    },
    {
        href : "/settings" ,
        label : "settings",
        icon : Settings,
    }
]

type sidebarProps = {
    apiLimitCount : number,
    isPro: boolean
}

const font = Montserrat ({
    weight:"600",
    subsets : ["latin"]
})

const Sidebar = ({apiLimitCount =0 , isPro =false}:sidebarProps) => {
    const pathname = usePathname()

    
    return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
        <div className="px-3 py-2 flex-1">
            <Link href="/dashboard" className="flex items-center pl-3 ">
                <div className="relative w-20 h-20 mr-4">
                <h1 className={cn("text-2xl font-bold text-white", font.className)}>
                    Genius
                </h1>
                </div>
            </Link>
                <div className="space-y-1">
                    {routes.map((route)=> (
                    <Link
                        href={route.href}
                        key={route.href}
                        className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover: text-white hover:bg-white/10 rounded-lg transition",pathname === route.href ? "bg-white/10 text-white" :"text-zinc-400")}
                        >
                            <div className="flex items-center flex-1">
                            <route.icon className={cn("h-5 w-5 mr-3", route.
                            color)} />
                            {route.label}
                            </div>
                    </Link>))}
                </div>
        </div>
        <FreeCounter 
            apiLimitCount = {apiLimitCount}
            isPro= {isPro}
        />
    </div>
    );
    }

export default Sidebar
