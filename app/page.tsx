import { DealsTable } from '@/components/deals/DealsTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deals</h1>
          <p className="text-gray-600">Manage your sales pipeline and track deal progress</p>
        </div>
        <DealsTable />
      </div>
    </div>
  );
}