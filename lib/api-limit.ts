import { auth } from "@clerk/nextjs/server"
import clientPromise from "../lib/connectDb"
import { MAX_FREE_API_CALL } from "./constants";


export const increaseApiLimit = async ()=>{
    const { userId } = await auth()

    if(!userId) {
        return ;
    }

    const client = await clientPromise;
    const db = client.db("api-checker");
    const user = await db
        .collection("user")
        .findOne({userId : userId})

    if(user){
        await db.collection("user").updateOne(
            { userId: userId }, 
            { 
                $inc: { ApiCount: 1 }, 
                $set: { updatedAt: new Date() } 
            } 
        );
    }
    else
    {
        await db
        .collection("user")
        .insertOne({userId : userId , ApiCount : 1,createdAt: new Date() , updatedAt : new Date() })
    }
    

}

export const checkApiLimit = async ()=>{

    const {userId } =await auth()

    
    if(!userId) {
        return false;
    }

    const client = await clientPromise;
    const db = client.db("api-checker");
    const user = await db
        .collection("user")
        .findOne({userId : userId})

    if(!user || user.ApiCount < MAX_FREE_API_CALL){
        return true
    }else{
        return false
    }
}

export const getApiLimitCount = async ()=>{

    const {userId } =await auth()

    
    if(!userId) {
        return 0;
    }

    const client = await clientPromise;
    const db = client.db("api-checker");
    const user = await db
        .collection("user")
        .findOne({userId : userId})

    if(!user){
        return 0
    }else{
        return  user.ApiCount
    }
}