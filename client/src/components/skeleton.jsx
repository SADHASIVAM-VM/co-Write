import { Skeleton } from "./ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 p-5">
      <Skeleton className="h-[150px] w-full md:w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
