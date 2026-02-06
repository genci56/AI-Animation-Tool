import "../../styles/global.css";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "IMSOLD ANIMATOR",
  description: "IMSOLD ANIMATOR - AI-powered video generation",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background">{children}</body>
    </html>
  );
}
