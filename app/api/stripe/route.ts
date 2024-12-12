import { absoluteURL } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/connectDb"
import { stripe } from "@/lib/stripe";





const settingURL = absoluteURL("/settings")


export async function GET(){

    try {
        const {userId } = await auth()

        const user = await currentUser()

        if(!user || !userId) {
            return new NextResponse("Unauthorized" , {status : 401})
        }

        const client = await clientPromise;
        const db = client.db("stripe-subscription");
        const userSubscription = await db
            .collection("userSubscription")
            .findOne({userId : userId})

        if(userSubscription && userSubscription.stripeCustomerId){
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer : userSubscription.stripeCustomerId,
                return_url : settingURL
            })
            return new NextResponse(JSON.stringify({url : stripeSession.url}))
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url : settingURL,
            cancel_url : settingURL,
            payment_method_types : ["card"],
            mode : "subscription",
            billing_address_collection:"auto",
            customer_email : user.emailAddresses[0].emailAddress,
            line_items:[
                {
                    price_data : {
                        currency :"USD",
                        product_data : {
                            name : "Genius Pro",
                            description : "Unlimited IA Generation"
                        },
                        unit_amount : 2000,
                        recurring : {
                            interval:"month"
                        }
                    },
                    quantity : 1,
                }
            ], 
            metadata : {
                userId,
            }

        })

        

        return new NextResponse(JSON.stringify({url : stripeSession.url}))
    } catch (error) {
        console.log("Stripe Error" , error)
        return new NextResponse("Internal Error " , {status : 500})

    }
}