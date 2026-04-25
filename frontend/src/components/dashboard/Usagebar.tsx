const UsageBar = ({
  postUsed,
  postLimit = 10,
}: {
  postUsed: number;
  postLimit: number;
}) => {
  const fillPercentage = Math.min((postUsed / postLimit) * 100, 100);

  let colorClass = "bg-green-500"; // Default Green
  if (fillPercentage >= 100) {
    colorClass = "bg-red-500"; // Red (Limit Reached)
  } else if (fillPercentage >= 80) {
    colorClass = "bg-orange-500"; // Orange (Warning)
  }
  
  return (
    <div className="w-full max-w-sm bg-transparent">
          <div className="flex justify-between mb-1 ">
            <span className="text-xs">Monthly Blog Posts</span>
            <span>{postUsed} / {postLimit}</span>
          </div>
          
          {/* The Outer Track */}
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            {/* The Inner Fill */}
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-in-out ${colorClass}`} 
              style={{ width: `${fillPercentage}%` }}
            ></div>
          </div>
          
          {fillPercentage >= 100 && (
            <p className="mt-2 text-sm text-red-500 text-right">
              You have reached your monthly limit.
            </p>
          )}
        </div>
  )
};


export default UsageBar;