import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCP & Liberty computers",
  description: "Receipt management online solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <ReactQueryProvider>
       <main className="size-full h-dvh">{children}
       {/* <span className=" w-full  sticky bottom-0 text-xs text-center  text-muted-foreground">
            https://mcp-liberty-techs.vercel.app{" "}
          </span> */}
       </main>
        <Toaster />

       </ReactQueryProvider>
      </body>
    </html>
  );
}
