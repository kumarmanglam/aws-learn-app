import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAA Learning App — AWS Solutions Architect Associate",
  description:
    "Interactive learning app covering all topics for the AWS Certified Solutions Architect Associate (SAA-C03) exam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
