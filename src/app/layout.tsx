import type { Metadata } from "next";
import "./globals.css";
import { display, sans } from "./fonts";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StoreProvider from "@/components/StoreProvider";

const readThemeScript = `
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (matchMedia('(prefers-color-scheme: dark)').matches && !theme)) {
      document.documentElement.classList.add('dark');
    }
  }catch {
    console.error('error in loading theme');
  }
`

export const metadata: Metadata = {
  title: "FootStats - Live football stats",
  description: "FootStats, Live FootBall stats, Teams/Leagues/Matches stats.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: readThemeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Header />
          <div className="flex">
            <Sidebar />
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
