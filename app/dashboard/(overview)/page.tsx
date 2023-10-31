// import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';
import Cards from '@/app/ui/dashboard/cards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

// NOTE (overview)配下に配置することで、overviewというルートグループを作成して、/dashboard/overviewにアクセスしたときに表示
// NOTE (/dashboard/customersや/dashboard/invoicesなどのページではスケルトンは表示されない)
export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <Cards />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* NOTE データfetchに時間がかかるコンポーネントをSuspenseで一部のみストリーミングして対応 */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart/>
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
