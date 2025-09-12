import React from "react";
import { Skeleton } from "./ui/skeleton";

function SchoolSkeleton({
  columns = 1,
  buttons = 1,
}: {
  columns?: number;
  buttons?: number;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 ring ring-input rounded-xl">
      <div className="rounded-t-xl overflow-hidden relative">
        <Skeleton className="rounded-b-none aspect-square w-full" />
      </div>
      <div className="flex flex-col justify-center gap-2 px-2 pb-2">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          {Array.from({ length: columns }).map((_, index) => (
            <div className="flex gap-1 items-center" key={index}>
              <Skeleton className="w-5 h-6 rounded-md" />
              <Skeleton
                className="h-5 rounded-lg"
                style={{ width: `${5 + index}rem` }}
              />
            </div>
          ))}
        </div>
        {Array.from({ length: buttons }).map((_, index) => (
          <Skeleton className="w-full h-8 rounded-md" key={index} />
        ))}
      </div>
    </div>
  );
}

export default SchoolSkeleton;
