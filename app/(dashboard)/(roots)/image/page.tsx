"use client"

import * as z from "zod";

import { Heading } from '@/components/Heading';
import { ImageIcon } from 'lucide-react';
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
import Image from "next/image";
import { useProModel } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
// type messageProps = {role ?: string , prompt? : string }

const ImagePage = () => {

  const router = useRouter()
  // const [messages ,setMessages] = useState<messageProps[]>([])
  const [uri , setUri] = useState("")

  const form = useForm<z.infer<typeof formScheme>>({
    resolver : zodResolver(formScheme),
    defaultValues: {
    prompt: ""
    }
    });

    const proModel = useProModel()
     

    const isLoading = form.formState.isSubmitting

    const handelDownload = ()=>{
      const link = document.createElement('a')
      link.href = uri
      link.download = "image.png"
      link.click()
    }

    const onSubmit = async (values : z.infer<typeof formScheme>)=>{
      try{

        const userMessage = {
          role : "user",
          prompt : values.prompt
        }
        // const newMessage = [...messages , userMessage ]

        const response = await axios.post("api/image", {
          
            prompt: userMessage.prompt 
        });

        setUri(response?.data.dataURI)


        form.reset()

      }catch(error ){
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
        title="Image Generation"
        description="Our most advanced Image Generation model."
        icon = {ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
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
                            placeholder="A beautiful Mountain"
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
              
              {!uri  &&  !isLoading && 
                <Empty label="No Image Generated "/>
               }           
               <div className="flex justify-center items-center">
                {uri   &&  !isLoading && 
                <Card
                className="w-96  p-0 "
                >

                  <CardContent className="p-2 flex flex-col gap-3 justify-center  ">
                    <Image  src={uri} alt="image" width={230} height={264} className="rounded-md w-full"/> 
                    <Button onClick={handelDownload} variant="outline" className="w-full"> Download</Button>
                  </CardContent>
                 

                </Card>
                  
                  }
              </div>

            </div>


          </div>
        </div>
)}

export default ImagePage
