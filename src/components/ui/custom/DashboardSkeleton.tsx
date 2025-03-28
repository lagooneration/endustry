"use client";

import { Card } from '@/components/ui/card';
import { DocumentTextIcon, ScaleIcon, CurrencyDollarIcon, TruckIcon } from '@heroicons/react/24/outline';

const DashboardSkeleton = () => {
  // Skeleton stats
  const stats = [
    { name: 'Total Invoices', icon: DocumentTextIcon },
    { name: 'Total Weight Tickets', icon: ScaleIcon },
    { name: 'Total Revenue', icon: CurrencyDollarIcon },
    { name: 'Active Trucks', icon: TruckIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="mt-1 h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-300" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-500 truncate">{stat.name}</div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Invoices Skeleton */}
        <Card className="p-6">
          <div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div>
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Weight Tickets Skeleton */}
        <Card className="p-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
