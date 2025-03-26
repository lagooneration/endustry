export function WeightTicketsSkeleton() {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
  
        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-9 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
  
              {/* Table Rows */}
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-9 gap-4 py-4 border-t border-gray-100">
                  {Array.from({ length: 9 }).map((_, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`h-4 bg-gray-200 rounded animate-pulse ${
                        colIndex === 0 ? 'w-24' : 'w-full'
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }