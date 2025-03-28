import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const openSans = Open_Sans({
    variable: "--font-open-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Game-2048",
    description: "Created with 💝 by Ankur Jaiswal",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="light" style={{"colorScheme":"light"}}>
            <head>
                <link rel="icon" href="/logo.png" type="image/png" />
            </head>
            <body className={`${openSans.variable} antialiased size-full pb-4`}>
                <ThemeProvider>
                    <StoreProvider>{children}</StoreProvider>
                </ThemeProvider>
                <GoogleAnalytics />
            </body>
        </html>
    );
}
