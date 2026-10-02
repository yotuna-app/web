import { useState } from "react";

interface StationImageProps {
  imageUrl?: string;
  name: string;
  size?: "md" | "lg" | "xl";
}

const sizeClasses: Record<string, string> = {
  md: "h-20 w-20",
  lg: "h-28 w-28",
  xl: "h-40 w-40",
};

const textSizeClasses: Record<string, string> = {
  md: "text-tv-lg",
  lg: "text-tv-2xl",
  xl: "text-tv-4xl",
};

export default function StationImage({ imageUrl, name, size = "md" }: StationImageProps) {
  const [hasError, setHasError] = useState(false);
  const dimension = sizeClasses[size];
  const textSize = textSizeClasses[size];
  const letter = name.charAt(0).toUpperCase();

  if (!imageUrl || hasError) {
    return (
      <div className={`${dimension} flex shrink-0 items-center justify-center rounded-tv-lg bg-gray-800`}>
        <span className={`${textSize} font-bold text-gray-500`}>{letter}</span>
      </div>
    );
  }

  return (
    <div className={`${dimension} shrink-0 overflow-hidden rounded-tv-lg`}>
      <img src={imageUrl} alt={name} className="h-full w-full object-cover" onError={() => setHasError(true)} />
    </div>
  );
}
