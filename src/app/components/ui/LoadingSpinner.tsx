import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  title?: string;
  subtitle?: string;
  className?: string;
  showDots?: boolean;
}

export function LoadingSpinner({
  size = "md",
  title = "Loading...",
  subtitle,
  className = "",
  showDots = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const titleSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2
            className={`${sizeClasses[size]} animate-spin mx-auto text-blue-400`}
          />
          <div
            className={`absolute inset-0 ${sizeClasses[size]} mx-auto border-2 border-blue-500/20 rounded-full animate-pulse`}
          ></div>
        </div>
        <div className="space-y-2">
          <h2
            className={`${titleSizeClasses[size]} font-semibold text-blue-100`}
          >
            {title}
          </h2>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
        {showDots && (
          <div className="flex justify-center space-x-1 mt-4">
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
