import './globals.css'
import { Inter } from 'next/font/google'
import Header from "@/app/components/header";
import {Container} from "@mui/material";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Inductance Calculator',
  description: 'A tool for designing NFC antennae.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <body className={`bg ${inter.className}`}>

        <Container maxWidth={"sm"}>
          <Header />
          {children}
        </Container>
      </body>
    </html>
  )
}
