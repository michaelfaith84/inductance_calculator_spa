'use client';
import React, {useState} from "react";
import { SyntheticEvent } from "react";
import { Tabs, Tab } from "@mui/material";
import { useRouter } from 'next/navigation'

const Navbar = () => {
    const [value, setValue] = useState(0);
    const router = useRouter();
 const handleChange = (e: SyntheticEvent, newValue: number) => {
     setValue(newValue)
     if (newValue === 0) {
         router.push('/round')
     } else {
         router.push('/square')
     }
 }

 return (
     <Tabs value={value} onChange={handleChange} centered>
         <Tab label="Round" />
         <Tab label="Square" />
     </Tabs>
 );
}

export default Navbar;