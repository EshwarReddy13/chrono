import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TimerProvider } from "@/contexts/TimerContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Chrono - Time Tracking Application",
  description: "Cross-platform time tracking application with AI-driven productivity insights",
  icons: {
    icon: '/icon.ico',
    shortcut: '/icon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        <AuthProvider>
          <TimerProvider>
            {children}
          </TimerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
