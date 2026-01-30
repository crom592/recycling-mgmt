import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "재활용 관리 - 포인트 적립 & 환경 기여",
  description: "재활용 배출을 기록하고 포인트를 모아보세요. 내가 지킨 환경, 숫자로 확인할 수 있어요.",
  keywords: ["재활용", "환경", "포인트", "CO2", "에코", "그린"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko" className="dark"><body className="antialiased bg-gray-950 text-white">{children}</body></html>;
}
