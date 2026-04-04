function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        <div className="bg-gray-200 h-4 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="bg-gray-200 h-6 rounded w-3/4 mb-3"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="bg-gray-200 h-6 rounded w-20"></div>
        <div className="bg-gray-200 h-6 rounded w-24"></div>
      </div>
      <div className="bg-gray-200 h-16 rounded mb-4"></div>
      <div className="flex gap-3">
        <div className="bg-gray-200 h-10 rounded w-28"></div>
        <div className="bg-gray-200 h-10 rounded w-28"></div>
      </div>
    </div>
  );
}

export function CareerCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="bg-gray-200 h-7 rounded w-3/4 mb-3"></div>
      <div className="bg-gray-200 h-4 rounded w-full mb-2"></div>
      <div className="bg-gray-200 h-4 rounded w-5/6 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="bg-gray-200 h-6 rounded w-16"></div>
        <div className="bg-gray-200 h-6 rounded w-20"></div>
      </div>
      <div className="bg-gray-200 h-4 rounded w-32"></div>
    </div>
  );
}

export default LoadingSkeleton;