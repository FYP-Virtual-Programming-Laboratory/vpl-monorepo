import { LandingContent } from "@/components/landing/landing-content";
import { RainAnimation } from "@/components/landing/rain-animation";
import type { Metadata } from "next";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeLab",
  description: "Manage your coding sessions and students",
};

import ClientLayout from "./ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 relative overflow-hidden">
        <RainAnimation />
        <LandingContent />
      </div>
      {children}
    </ClientLayout>
  );
}
