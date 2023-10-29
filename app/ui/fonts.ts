import { Inter, Lusitana } from 'next/font/google';

// NOTE ロードしたいサブセットを指定
export const inter = Inter({ subsets: ['latin'] });

// NOTE 別のサブセットも用意してみた
export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});
