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
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-tv-md bg-gray-800">
        <Music className="h-8 w-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-tv-md">
      <img src={imageUrl} alt={title} className="h-full w-full object-cover" onError={() => setHasError(true)} />
    </div>
  );
}
