import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '비즈엠 알림톡 코드 생성기',
  description:
    'BizM 알림톡 템플릿을 입력하면 sendAlimtalk 코드와 카카오톡 미리보기를 생성합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
