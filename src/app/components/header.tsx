import React from 'react';
import {Box, Divider, Typography} from "@mui/material";
import Navbar from "@/app/components/navbar";

const Header = () => {
 return (
    <Box>
        <Typography py={1} component={"h1"} variant={"h4"} textAlign={"center"}>Inductance Calculator</Typography>
        <Divider />
        <Navbar />
    </Box>
 );}

export default Header;