import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "VAULT",
  description: "Private digital archive",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden bg-vault-bgDark">
        {/* CRT overlay */}
        <div className="crt-overlay" aria-hidden="true">
          <div className="scanlines" />
        </div>
        {children}
      </body>
    </html>
  );
}
