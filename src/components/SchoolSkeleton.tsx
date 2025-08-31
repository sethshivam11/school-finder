import React from "react";
import { Skeleton } from "./ui/skeleton";

function SchoolSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-3 ring ring-input rounded-xl">
      <div className="rounded-t-xl overflow-hidden relative">
        <Skeleton className="rounded-b-none aspect-square w-full" />
      </div>
      <div className="flex flex-col justify-center gap-2 px-2 pb-2">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <div className="flex gap-1 items-center">
            <Skeleton className="w-5 h-6 rounded-md" />
            <Skeleton className="w-20 h-5 rounded-lg" />
          </div>
        </div>
        <Skeleton className="w-full h-9 rounded-lg" />
      </div>
    </div>
  );
}

export default SchoolSkeleton;
