import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import NavbarServer from "./_components/Navbar/NavbarServer";
import Footer from "./_components/Footer/Footer";
import ToastProvider from "./_components/ToastProvider/ToastProvider";

export const metadata: Metadata = {
  title: "FreshCart",
  description:
    "Shop fresh fruits, vegetables, and everyday groceries online at great prices, with fast delivery straight to your door.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white" suppressHydrationWarning>
        <Suspense
          fallback={
            <div aria-hidden="true" className="h-16 lg:h-28">
              <div className="hidden h-10 border-b border-gray-100 bg-white lg:block" />
              <div className="h-16 bg-white shadow-sm lg:h-[72px]" />
            </div>
          }
        >
          <NavbarServer />
        </Suspense>
        <div className="pt-16 lg:pt-0"></div>
        {children}
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
