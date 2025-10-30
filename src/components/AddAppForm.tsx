import React, { useState } from "react";

interface Props {
  onSubmit: (appName: string, url: string) => void;
  loading?: boolean;
}

export default function AddAppForm({ onSubmit, loading = false }: Props) {
  const [appName, setAppName] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !url) return;
    onSubmit(appName, url);
    setAppName("");
    setUrl("");
  };

  return (
    <form className="add-app-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-app name"
        placeholder="App Name"
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
        disabled={loading}
      />
      <input
        type="text"
        className="form-app url"
        placeholder="Play Store URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
      />
      <button type="submit" className="add-btn" disabled={loading}>
        {loading ? (
        <>
            Capturing <span className="loading-spinner"></span>
        </>
        ) : (
        "Add App"
        )}
    </button>
      
    </form>
  );
}
