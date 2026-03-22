import { useState } from "react";

interface StationImageProps {
  imageUrl?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<string, string> = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  xl: "h-28 w-28",
};

const textSizeClasses: Record<string, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-4xl",
};

const radiusClasses: Record<string, string> = {
  sm: "rounded-lg",
  md: "rounded-lg",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

export default function StationImage({ imageUrl, name, size = "md" }: StationImageProps) {
  const [hasError, setHasError] = useState(false);
  const dimension = sizeClasses[size];
  const textSize = textSizeClasses[size];
  const radius = radiusClasses[size];
  const letter = name.charAt(0).toUpperCase();

  if (!imageUrl || hasError) {
    return (
      <div className={`${dimension} flex shrink-0 items-center justify-center ${radius} bg-gray-200 dark:bg-gray-700`}>
        <span className={`${textSize} font-semibold text-gray-500 dark:text-gray-400`}>{letter}</span>
      </div>
    );
  }

  return (
    <div className={`${dimension} shrink-0 overflow-hidden ${radius}`}>
      <img src={imageUrl} alt={name} className="h-full w-full object-cover" onError={() => setHasError(true)} />
    </div>
  );
}
