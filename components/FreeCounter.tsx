"use client"

import { Zap } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Progress } from "./ui/progress"
import { MAX_FREE_API_CALL } from "@/lib/constants"
import { useProModel } from "@/hooks/use-pro-modal"

type FreeCounterProps = {
    apiLimitCount : number,
    isPro : boolean
}
const FreeCounter = ({apiLimitCount = 0 , isPro = false} : FreeCounterProps) => {
    const proModal = useProModel()

    if(isPro)return null
  return (
        <div className="px-3">
            <Card className="bg-white/10 border-0">
                <CardContent className="py-6">
                <div className="text-center text-sm text-white mb-4 space-y-2">
                    <p>
                    {apiLimitCount} / {MAX_FREE_API_CALL} Free Generations
                    </p>
                    <Progress
                        className="h-3  "
                        value={(apiLimitCount / MAX_FREE_API_CALL) * 100}
                    />
                </div>
                    <Button className="w-full " variant="premium" onClick={proModal.onOpen}>
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                </CardContent>
            </Card>
        </div>
  )
}

export default FreeCounter
