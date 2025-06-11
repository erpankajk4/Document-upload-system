import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./css/globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "File Upload System",
  description: "A modern file upload system with drag-and-drop functionality",
  keywords: ["file upload", "drag and drop", "file management"],
  authors: [{ name: "Pankaj Prajapat" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${inter.className} bg-gray-50 antialiased`}>
        <Toaster position="top-right" />
        {/*  modal portal */}
        <div id="modal-portal" className="relative z-[999999]" />
        {children}
      </body>
    </html>
  );
}
