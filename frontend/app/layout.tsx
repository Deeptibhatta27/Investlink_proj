import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Chatbot from "./components/Chatbot";

export const metadata = {
  title: "InvestLink",
  description: "Where Investors and Startups Connect",
};

// Botpress configuration
declare global {
  interface Window {
    botpressWebChat: any;
  }
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  );
}

