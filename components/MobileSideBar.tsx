"use client"

import React, { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import Sidebar from './Sidebar'

const MobileSideBar = ({apiLimitCount , isPro =false} : {apiLimitCount : number ,isPro :boolean }) => {
    const [isMounted ,setIsMounted] = useState(false)

    useEffect(()=>{
        setIsMounted(true)

        
    },[])

    if (!isMounted)return null;
  return (
    <Sheet >
        <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu/>
        </Button>
        </SheetTrigger>
        <SheetContent side="left" className='p-0 border-none'>
          <Sidebar isPro={isPro} apiLimitCount={apiLimitCount}/>
        </SheetContent>
      </Sheet>
  )
}

export default MobileSideBar

