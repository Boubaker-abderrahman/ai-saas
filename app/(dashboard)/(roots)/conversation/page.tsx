"use client"

import * as z from "zod";

import { Heading } from '@/components/Heading';
import { MessageSquare } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

import { formScheme } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import {Empty} from "@/components/Empty";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useProModel } from "@/hooks/use-pro-modal";
type messageProps = {role ?: string , prompt ?: string}

const ConversationPage = () => {

  const router = useRouter()
  const [messages ,setMessages] = useState<messageProps[]>([])

  const proModel = useProModel()

  const form = useForm<z.infer<typeof formScheme>>({
    resolver : zodResolver(formScheme),
    defaultValues: {
    prompt: ""
    }
    });
     

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values : z.infer<typeof formScheme>)=>{
      try{

        const userMessage :messageProps = {
          role : "user",
          prompt : values.prompt
        }

        const response = await axios.post("api/conversation" ,{
          message : userMessage 
        })
        

        setMessages((current)=>[...current,userMessage,response.data ])

        form.reset()

      }catch(error){
        //open pro model
        console.log(error)
        const axiosError =error as AxiosError
        if(axiosError?.response?.status === 403 ){
          proModel.onOpen()
        }else{
          toast.error("Something went wrong")
        }
      }finally{
        router.refresh()
      }
    }

    const [isMounted ,setIsMounted] = useState(false)
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if (!isMounted)return null;


    return (
    <div>
        <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon = {MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
        />
        <div className="px-4 lg:px-8">
          <div>
                <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within: shadow-sm grid grid-cols-12 gap-2">
                  <FormField
                      name="prompt"
                      render={({ field }) => (
                        <FormItem className="col-span-12 lg:col-span-10">
                          <FormControl className="m-0 p-0">
                            <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                            disabled={isLoading}
                            placeholder="How do I calculate the radius of a circle?"
                            {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                      />
                      <Button className="lg:col-span-2 col-span-12 w-full" disabled={isLoading}>
                        Generate
                      </Button>
                </form>
              </Form>
            </div>
            <div className="space-y-4 mt-4">
              {isLoading && <LoadingSpinner/>}
              
              {messages.length ===0  &&  !isLoading && 
                <Empty label="No Conversation Started "/>
               }           
               <div className="flex flex-col-reverse gap-y-4">
                {messages.length >=0  &&  !isLoading && messages.map((message,index)=>(
                  <div
                    key={index}
                    className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role=== "user"?" bg-white border border-black/10":"bg-muted" )}
                    >
                      
                    {message.role === "user" ? <UserAvatar />: ""}
                    <p>
                    {message.prompt}
                    </p>
                  </div>
                ))}

              </div>

            </div>


          </div>
        </div>
)}

export default ConversationPage
