export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-lg ${className}`} />;
}

export function PropertyCardSkeleton() {
  return (
    <div className="glass-card p-0 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-14 w-14 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
