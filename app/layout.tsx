import type { Metadata } from "next";
import "./globals.css";

const baseUrl = "https://typing-speed-test.vercel.app";

export const metadata: Metadata = {
  title: "Free Typing Speed Test — Check Your WPM Online | TypeRush",
  description: "Test your typing speed and accuracy for free. Measure WPM, accuracy, and see your results in real-time. No signup required. Multiple difficulty modes available.",
  keywords: ["typing test", "typing speed test", "wpm test", "words per minute", "typing practice", "free typing test", "keyboard speed test", "typing accuracy test"],
  openGraph: {
    title: "TypeRush — Free Typing Speed Test Online",
    description: "How fast can you type? Test your WPM, accuracy, and typing speed for free. Real-time feedback, multiple modes, shareable results.",
    url: baseUrl,
    siteName: "TypeRush",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TypeRush — Free Typing Speed Test",
    description: "Test your typing speed and accuracy. How fast can you type?",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TypeRush — Free Typing Speed Test",
              "description": "Test your typing speed (WPM) and accuracy for free. Real-time feedback, multiple difficulty modes.",
              "url": baseUrl,
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
