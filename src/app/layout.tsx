import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "♻️ 무인회수기 관리",
  description: "무인회수기 관리 MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body className="antialiased">{children}</body></html>;
}
