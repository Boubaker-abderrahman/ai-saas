"use client"

import * as z from "zod";

import { Heading } from '@/components/Heading';
import {  Languages } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

import { formScheme, languages } from './constants';
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
import { useProModel } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

type messageProps = {role ?: string , text ?: string , sourceLang  : string , targetLang : string}

const TranslatePage = () => {

  const router = useRouter()
  const [messages ,setMessages] = useState<messageProps[]>([])

  const proModel = useProModel()


  const form = useForm<z.infer<typeof formScheme>>({
    resolver : zodResolver(formScheme),
    defaultValues: {
    text: "",
    sourceLang : "english",
    targetLang : "french"
    }
    });
     

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values : z.infer<typeof formScheme>)=>{
      
      try{

        const userMessage :messageProps = {
          role: "user",
          text: values.text,
          sourceLang: values.sourceLang,
          targetLang: values.targetLang
        }

        const response = await axios.post("api/translate" ,userMessage)
        

        setMessages((current)=>[...current,userMessage,response.data ])

        form.reset()

      }catch(error){
        //open pro model
        console.log(error)
        const axiosError = error as AxiosError;
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
        title="Text Translation"
        description="Translate Text using AI ."
        icon = {Languages }
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
        />
        <div className="px-4 lg:px-8">
          <div>
                <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                  <FormField
                      name="text"
                      render={({ field }) => (
                        <FormItem className="col-span-12 lg:col-span-6">
                          <FormControl className="m-0 p-0">
                            <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                            disabled={isLoading}
                            placeholder="It is a beautiful day"
                            {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                      />

                  <FormField
                      name="sourceLang"
                      render={({ field }) => (
                        <FormItem className="col-span-6 lg:col-span-2">
                          <FormControl className="m-0 p-0">
                          <Select 
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          
                          >
                            <SelectTrigger >
                              <SelectValue placeholder="English" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Source Language</SelectLabel>
                                {languages.length > 0 && languages.map((langue ,index)=>(
                                  <SelectItem key={index} value={langue.label}>{langue.name}</SelectItem>
                                ))}
                                
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          </FormControl>
                        </FormItem>
                      )}
                      />
                      <FormField
                      name="targetLang"
                      render={({ field }) => (
                        <FormItem className="col-span-6 lg:col-span-2">
                          <FormControl className="m-0 p-0">
                          <Select 
                          disabled={isLoading}
                          onValueChange={field.onChange}

                          >
                            <SelectTrigger >
                              <SelectValue placeholder="French" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Target Language</SelectLabel>
                                {languages.length > 0 && languages.map((langue , index)=>(
                                  <SelectItem key={index} value={langue.label}>{langue.name}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
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
                <Empty label="No Text Generated "/>
               }           
               <div className="flex flex-col-reverse gap-y-4">
                {messages.length >=0  &&  !isLoading && messages.map((message,index)=>(
                  <div
                    key={index}
                    className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role=== "user"?" bg-white border border-black/10":"bg-muted" )}
                    >
                      
                    {message.role === "user" ? <UserAvatar />: ""}
                    
                    <p>
                      {message.text}
                    </p>
                    
                  </div>
                ))}

              </div>

            </div>


          </div>
        </div>
)}

export default TranslatePage
