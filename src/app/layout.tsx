'use client';
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store/store";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider store={store}>
        <ToastContainer
          position="top-right"     
          autoClose={5000}         
          hideProgressBar={false}   
          newestOnTop={true}         
          closeOnClick={true}       
          rtl={false}               
          pauseOnFocusLoss={false}  
          draggable={true}           
          pauseOnHover={true}       
          theme="light"              
      />
          <SessionProvider>{children}</SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
