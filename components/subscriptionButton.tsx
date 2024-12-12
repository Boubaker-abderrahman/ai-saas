"use client"
import axios from "axios";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface SubscriptionButtonProps {
    isPro: boolean;
    };

export const SubscriptionButton = ({isPro = false} : SubscriptionButtonProps) => {

    const [isLoading , setIsLoading] = useState(false)
    const router = useRouter()


    const onClick = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get("/api/stripe") 

            window.location.href = response.data.url
        } catch (error) {
        console.log("Error In Billing", error);
        toast.error("Something went wrong")
        }finally{
            setIsLoading(false)
            router.refresh()
            
        }
    }
    return (

        <Button variant={isPro ? "default": "premium"} onClick={onClick} disabled={isLoading}>
            {isPro? "Manage Subscription": "Upgrade"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
        </Button>
    )
};