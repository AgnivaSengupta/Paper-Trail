const SkeletonLoader = () => {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col gap-4">
        {/* Title section */}
        <div className="min-h-[193px] mt-10 py-6 px-12 flex flex-col gap-6">
          <div className="h-12 bg-gray-200 rounded-md w-3/4" />

          <div className="flex gap-5 items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="flex gap-3 py-[3px] px-[4px] w-40 bg-gray-100 border-1 items-center rounded-sm">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />{" "}
                {/* Avatar */}
                <div className="h-4 bg-gray-200 rounded w-20" /> {/* Name */}
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-24" /> {/* Date */}
          </div>
        </div>

        {/*Place holder image*/}
        <div className="mb-12 rounded-lg overflow-hidden border border-border aspect-[21/9] bg-gray-200" />
      </div>

      <div className="flex gap-8 lg:gap-16">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </aside>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-6">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    </main>
  );
};

export default SkeletonLoader;
