import React from "react";
import ScreenshotCard from "./ScreenshotCard";

interface Screenshot {
  id?: number;
  imageUrl: string;
  capturedAt: string;
}

export default function ScreenshotTimeline({ screenshots }: { screenshots: Screenshot[] }) {
  if (!screenshots.length)
    return <p style={{ textAlign: "center" }}>No screenshots yet.</p>;

  return (
    <div className="timeline">
      {screenshots.map((shot, i) => (
        <ScreenshotCard key={i} screenshot={shot} />
      ))}
    </div>
  );
}
