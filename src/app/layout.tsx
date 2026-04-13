'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MainNavbar from "@/components/MainNavbar";
import { usePathname } from "next/navigation";
import { UIProvider } from "@/contexts/UIContext";
import AIChatBot from "@/components/AIChatBot";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname() || "";
  const publicRoutes = ['/', '/about', '/contact', '/login', '/register'];
  const isFacultyRoute = pathname.startsWith('/faculty') || pathname.startsWith('/supervisors');
  const isPublicRoute = publicRoutes.includes(pathname) || isFacultyRoute;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReduxProvider>
            <SocketProvider>
              <AuthProvider>
                <UIProvider>
                  {isPublicRoute && <MainNavbar />}
                  <main className={`min-h-screen ${isPublicRoute ? "" : ""} transition-colors duration-300 dark:bg-slate-900 dark:text-white`}>
                    {children}
                  </main>
                  <Toaster position="top-right" />
                  <ToastContainer />
                  <AIChatBot />
                </UIProvider>
              </AuthProvider>
            </SocketProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
