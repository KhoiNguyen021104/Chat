function LoadingOverlay({ isLoading }) {
  return (
    isLoading && (
      <div className='fixed inset-0 z-[999999999999999999999] flex items-center justify-center bg-graydark bg-opacity-50 gap-1'>
        <div className='w-16 h-16 border-4 border-t-4 border-t-primary border-gray rounded-full animate-spin'></div>
        <span className='text-white'>Loading...</span>
      </div>
    )
  );
}

export default LoadingOverlay;
