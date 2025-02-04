import {stripe} from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/connectDb"

import Stripe from "stripe";

 

type StripeWebhookError = {
    type: "StripeSignatureVerificationError" | "StripeInvalidRequestError" | "UnknownError";
    message: string;
    rawError?: Error; 
  };

 export async function POST(req: Request){

    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature") as string

    let event : Stripe.Event;

    try{
        event = stripe.webhooks.constructEvent(body, signature,process.env.STRIPE_WEBHOOK_SECRET!)
    }catch(error ){
        console.log(error)
        const stripeError = error as StripeWebhookError 
        return new NextResponse(`Error in webHook : ${stripeError?.message}`,{status : 400} )
    }

    const session = event.data.object as Stripe.Checkout.Session

    const client = await clientPromise;
    const db = client.db("stripe-subscription");

    if(event.type === "checkout.session.completed"){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        if(!session?.metadata?.userId){
            return new NextResponse("User id is required" , {status : 400})
        }

        
        await db
            .collection("userSubscription")
            .insertOne({
            
            userId: session?.metadata?.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription. items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
                ),
            
        });

    }
    if(event.type === "invoice.payment_succeeded"){

        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        await db
            .collection("userSubscription")
            .updateOne({
                stripeSubscriptionId: subscription.id,
            },
            {
            $set :{
                    stripePriceId: subscription. items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(
                        subscription.current_period_end * 1000
                        ),
                },
            }
        );
    }
    return new NextResponse(null , {status : 200})




 }