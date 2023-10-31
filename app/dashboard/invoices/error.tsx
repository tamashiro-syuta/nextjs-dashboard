// NOTE エラーの状態を受け取って表示するコンポーネントのためクライアントコンポーネントである必要がある
'use client';

import { useEffect } from 'react';

export default function Error({
  // errorは、JavaScriptのネイティブErrorオブジェクトのインスタンス
  error,
  // resetは、エラーが発生したときに、エラーをリセットするために再レンダリングする関数
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
