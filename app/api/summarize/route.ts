import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';
import { checkSubscription } from '@/lib/subscription';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();


    if (!body || Object.keys(body).length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Request body is missing or invalid' }), { status: 400 });
    }

    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()

    if(!freeTrial && !isPro){
      return new NextResponse("Free trial has expired" , {status : 403})
    }
    
    const response = await axios.post(`${process.env.BACKEND_AI_URL}/summarize`, {text :body.message.text });
    //to do for every endoint
    if(!isPro){
      await increaseApiLimit()
    }
    return new NextResponse(JSON.stringify({text : response.data.summary , user :"system"}), { status: 200 });
  } catch (error) {
    console.error('Error:', error);

    // Return an appropriate error response
    return new NextResponse(JSON.stringify({ error: 'Fetching failed' }), { status: 500 });
  }
}
