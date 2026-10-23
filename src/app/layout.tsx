import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import FloatingWidgets from "@/components/FloatingWidgets";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { getChatFaqs, getSiteSettings } from "@/sanity/lib/fetch";

const gtUltra = localFont({
  src: [
    {
      path: "../../public/fonts/GTUltra-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/GTUltra-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GTUltra-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GTUltra-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GTUltra-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GTUltra-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/GTUltra-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gt-ultra",
});

const gtUltraUltra = localFont({
  src: "../../public/fonts/GTUltra-Ultra.otf",
  variable: "--font-gt-ultra-ultra",
});

const gtUltraFine = localFont({
  src: [
    {
      path: "../../public/fonts/GTUltraFine-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/GTUltraFine-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GTUltraFine-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GTUltraFine-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GTUltraFine-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GTUltraFine-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/GTUltraFine-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gt-ultra-fine",
});

const gtUltraFineUltra = localFont({
  src: "../../public/fonts/GTUltraFine-Ultra.otf",
  variable: "--font-gt-ultra-fine-ultra",
});

const optimaFont = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Optima Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Optima-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Optima-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-optima-medium",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zippyec.com"),
  title: "Zippy Equestrian Center | Real Riding. Real Feeling.",
  description: "Experience the thrill of riding in Bangalore.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [chatFaqs, siteSettings] = await Promise.all([
    getChatFaqs(),
    getSiteSettings(),
  ]);

  return (
    <html lang="en" className={`${gtUltra.variable} ${gtUltraUltra.variable} ${gtUltraFine.variable} ${gtUltraFineUltra.variable} ${optimaFont.variable} antialiased`}>
      <body className="font-sans">
        <SiteSettingsProvider settings={siteSettings}>
          <LoadingScreen />
          {children}
          <FloatingWidgets faqs={chatFaqs} />
        </SiteSettingsProvider>
      </body>
    </html>
  );
}

