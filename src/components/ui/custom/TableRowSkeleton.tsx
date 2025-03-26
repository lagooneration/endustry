interface TableRowSkeletonProps {
    columns: number
    className?: string
  }
  
  export function TableRowSkeleton({ columns, className = '' }: TableRowSkeletonProps) {
    return (
      <div className={`grid grid-cols-${columns} gap-4 py-4 ${className}`}>
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-200 rounded animate-pulse ${
              i === 0 ? 'w-24' : 'w-full'
            }`}
          />
        ))}
      </div>
    )
  }