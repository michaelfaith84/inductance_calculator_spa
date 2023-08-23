import React from 'react';
import {Box, Divider, Typography, Link} from "@mui/material";
import Navbar from "@/app/components/navbar";

const Header = () => {
 return (
    <Box>
        <Typography py={1} component={"h1"} variant={"h4"} textAlign={"center"}><a href={"https://forum.dangerousthings.com/t/coil-inductance-calculator/4952"}><Link>Inductance Calculator</Link></a></Typography>
        <Divider />
        <Navbar />
    </Box>
 );}

export default Header;