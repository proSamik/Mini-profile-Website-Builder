import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Profile Website Builder",
  description: "Design and customize your personal profile website in real-time with live preview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme') || 'system';
                  const root = document.documentElement;
                  
                  // Remove any existing theme classes
                  root.classList.remove('dark', 'light');
                  
                  if (savedTheme === 'dark') {
                    root.classList.add('dark');
                  } else if (savedTheme === 'light') {
                    root.classList.add('light');
                  } else if (savedTheme === 'system') {
                    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    root.classList.add(systemPrefersDark ? 'dark' : 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        {children}
      </body>
    </html>
  );
}
