import type { Metadata } from "next";
import { Nunito, Gochi_Hand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Shell } from "@/components/shell";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-sans" });
const gochi = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brush",
});

export const metadata: Metadata = {
  title: "We Can — Personal Operating System",
  description:
    "AI-powered personal operating system: productivity, school, fitness, budget, habits, journaling and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${nunito.variable} ${gochi.variable}`}
    >
      <body>
        <ThemeProvider>
          <div className="app-bg" />
          <Shell>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
