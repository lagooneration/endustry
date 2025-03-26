interface BaseSkeletonProps {
    className?: string
    width?: string | number
    height?: string | number
  }
  
  export function BaseSkeleton({ className = '', width = 'full', height = '4' }: BaseSkeletonProps) {
    return (
      <div
        className={`animate-pulse bg-gray-200 rounded ${className}`}
        style={{
          width: typeof width === 'number' ? `${width}px` : `${width}`,
          height: typeof height === 'number' ? `${height}px` : `${height}`,
        }}
      />
    )
  }