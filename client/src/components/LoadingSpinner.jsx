function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 border-b-2 border-blue-400 opacity-20"></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;