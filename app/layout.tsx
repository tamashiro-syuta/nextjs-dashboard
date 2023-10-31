import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

// NOTE メタデータを設定(`app/layout.tsx`を使う全ページでこのメタデータの設定が継承される)
// NOTE テンプレート内の　”%s"　は特定のページタイトルに置き換えられる
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* NOTE <body>要素にInterを追加することで、アプリケーション全体にフォントが適用される */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
