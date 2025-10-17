import Skeleton from "@/components/Skeleton";
export default function Loading() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}