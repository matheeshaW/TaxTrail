export default function LoadingSpinner({
  size = "md",
  message = "Loading...",
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Spinner */}
      <div
        className={`${sizeClasses[size]}
                border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      />
      {/* Message */}
      {message && (
        <p className="mt-4 text-gray-600 font-medium text-sm">{message}</p>
      )}
    </div>
  );
}
