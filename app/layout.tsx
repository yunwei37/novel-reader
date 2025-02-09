import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CONFIG } from "@/config/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "WebNR - Web Novel Reader",
  description: "A platform to read and manage your web novels.",
  manifest: '/manifest.json',
  themeColor: CONFIG.PWA.THEME_COLOR,
  metadataBase: new URL(CONFIG.CANONICAL_DOMAIN),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'WebNR - Web Novel Reader',
    description: 'A platform to read and manage your web novels.',
    url: CONFIG.CANONICAL_DOMAIN,
    siteName: 'WebNR',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={CONFIG.PWA.THEME_COLOR} />
        <link rel="apple-touch-icon" href={CONFIG.PWA.ICON_192} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        
        {/* Google Analytics */}
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ANALYTICS_ID}`} />
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${CONFIG.GOOGLE_ANALYTICS_ID}');
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider initialLang="en">
          {children}
        </LanguageProvider>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(error) {
                    console.error('Service worker registration failed:', error);
                    window.alert('Service Worker Error: ' + error.message);
                  });
                });
              }

              // Global error handling
              window.onerror = function(message, source, lineno, colno, error) {
                console.error('Global error:', { message, source, lineno, colno, error });
                const errorDetails = error ? 
                  \`Error: \${error.message}\\nLocation: \${source}:\${lineno}:\${colno}\` :
                  String(message);
                window.alert('An error occurred:\\n' + errorDetails);
                return false;
              };

              // Handle unhandled promise rejections
              window.addEventListener('unhandledrejection', function(event) {
                console.error('Unhandled promise rejection:', event.reason);
                window.alert('Unhandled Promise Error:\\n' + event.reason);
              });

              // Handle TTS specific errors
              window.addEventListener('error', function(event) {
                if (event.target && 'speechSynthesis' in window && 
                    (event.target === window.speechSynthesis || 
                     event.target instanceof SpeechSynthesisUtterance)) {
                  console.error('Speech synthesis error:', event);
                  window.alert('Text-to-Speech Error:\\n' + event.message);
                }
              }, true);
            `,
          }}
        />
      </body>
    </html>
  );
}
