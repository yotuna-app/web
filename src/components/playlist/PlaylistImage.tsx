import { useState } from "react";
import { Music } from "lucide-react";

interface PlaylistImageProps {
  imageUrl?: string;
  title: string;
}

export default function PlaylistImage({ imageUrl, title }: PlaylistImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!imageUrl || hasError) {
    return (
      <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
        <Music className="h-6 w-6 text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  return (
    <div className="h-15 w-15 shrink-0 overflow-hidden rounded-md">
      <img src={imageUrl} alt={title} className="h-full w-full object-cover" onError={() => setHasError(true)} />
    </div>
  );
}
