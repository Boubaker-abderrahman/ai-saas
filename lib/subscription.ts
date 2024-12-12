import { auth } from "@clerk/nextjs/server"
import clientPromise from "./connectDb"



const DAY_IN_MS = 86_400_000

export const checkSubscription = async ()=>{


    const {userId} = await auth()

    if(!userId){
        return false
    }

    const client = await clientPromise;
    const db = client.db("stripe-subscription");

    const userSubscription = await db
    .collection("userSubscription")
    .findOne({userId})

    if(!userSubscription){
        return false
    }

    const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS >  Date.now()

    return !!isValid
}