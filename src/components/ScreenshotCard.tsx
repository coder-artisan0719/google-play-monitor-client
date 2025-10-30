import React from "react";

interface Screenshot {
  imageUrl: string;
  capturedAt: string;
}

export default function ScreenshotCard({ screenshot }: { screenshot: Screenshot }) {
  const date = new Date(screenshot.capturedAt).toLocaleString();
  const fullImageUrl = `http://56.228.15.190${screenshot.imageUrl}`;

  return (
    <div className="screenshot-card">
      <p>Screenshot time: {date}</p>
      <img src={fullImageUrl} alt="app screenshot" style={{width: '100%'}} />
    </div>
  );
}
