function ProfileInfoSkeleton() {
  return (
    <div className="bg-secondary-light px-5 py-10 shadow-sm mb-5">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar Skeleton */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-gray-300 rounded-full w-28 h-28"></div>
        </div>

        {/* User Info Skeleton */}
        <div className="flex-1 flex flex-col gap-4 text-center sm:text-left">
          <div className="w-fit text-start">
            <div className="bg-gray-300 h-6 w-32 mb-2 rounded"></div>
            <div className="bg-gray-300 h-4 w-24 rounded"></div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <div className="bg-gray-300 h-8 w-20 rounded"></div>
            <div className="bg-gray-300 h-8 w-20 rounded"></div>
            <div className="bg-gray-300 h-8 w-20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfoSkeleton;
