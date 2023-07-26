'use client';
import React, {useEffect, useState} from "react";
import { SyntheticEvent } from "react";
import { Tabs, Tab } from "@mui/material";
import { useRouter, usePathname } from 'next/navigation'

const Navbar = () => {
    const [value, setValue] = useState(0);
    const router = useRouter();
    const pathname = usePathname()
 const handleChange = (e: SyntheticEvent, newValue: number) => {
     setValue(newValue)
     if (newValue === 0) {
         router.push('/round')
     } else {
         router.push('/square')
     }
 }

 useEffect(()=>{
    if (pathname === '/square') {
        setValue(1)
    }
 },[])

 return (
     <Tabs value={value} onChange={handleChange} centered>
         <Tab label="Round" />
         <Tab label="Square" />
     </Tabs>
 );
}

export default Navbar;