import { BaseSkeleton } from "./BaseSkeleton"
export function CardSkeleton() {
    return (
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <BaseSkeleton height={8} width={200} />
        <BaseSkeleton height={4} width="75%" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <BaseSkeleton key={i} height={4} />
          ))}
        </div>
      </div>
    )
  }