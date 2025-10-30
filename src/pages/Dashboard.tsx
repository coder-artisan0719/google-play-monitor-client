import React, { useEffect, useState } from "react";
import { api } from "../api";
import AppSidebar from "../components/AppSidebar";
import AddAppForm from "../components/AddAppForm";
import ScreenshotTimeline from "../components/ScreenshotTimeline";

interface AppType {
  appId: string;
  appName: string;
  playStoreUrl?: string;
}

export default function Dashboard() {
  const [apps, setApps] = useState<AppType[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAddApp, setLoadingAddApp] = useState(false);

  // 1️⃣ Load all apps
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.getApps();
        const appList: AppType[] = res.data || [];
        setApps(appList);

        if (appList.length > 0) {
          const firstApp = appList[0];
          setSelectedAppId(firstApp.appId);
          await fetchScreenshots(firstApp.appId);
        }
      } catch (err) {
        console.error("❌ Failed to fetch app list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  // 2️⃣ Fetch screenshots for a specific app
  const fetchScreenshots = async (appId: string) => {
    try {
      const res = await api.getScreenshots(appId);
      setScreenshots(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch screenshots:", err);
    }
  };

  // 3️⃣ Listen for live updates
  useEffect(() => {
    const eventSource = new EventSource("http://13.60.6.96/api/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📥 New screenshot event:", data);

      setApps((prev) => {
        if (!prev.some((a) => a.appId === data.appId)) {
          return [...prev, { appId: data.appId, appName: data.appName }];
        }
        return prev;
      });

      if (data.appId === selectedAppId) {
        setScreenshots((prev) => [data, ...prev]);
      }
    };

    eventSource.onerror = (err) => {
      console.error("⚠️ SSE error:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [selectedAppId]);

  // 4️⃣ Add app manually
  const handleAddApp = async (appName: string, url: string) => {
    setLoadingAddApp(true);
    try {
      await api.captureScreenshot({ appName, url });
      const appId = url.match(/id=([a-zA-Z0-9._]+)/)?.[1] || appName;

      setApps((prev) => {
        if (!prev.some((a) => a.appId === appId)) {
          return [...prev, { appId, appName }];
        }
        return prev;
      });

      setSelectedAppId(appId);
      await fetchScreenshots(appId);
    } catch (err) {
      console.error("❌ Failed to add app:", err);
    } finally {
      setLoadingAddApp(false);
    }
  };

  // 5️⃣ Show pure CSS loader initially
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  // 6️⃣ Render main layout
  return (
    <div className="dashboard">
      <AppSidebar
        apps={apps}
        selectedAppId={selectedAppId}
        onSelect={(id) => {
          setSelectedAppId(id);
          fetchScreenshots(id);
        }}
      />

      <main className="main-content">
        <h2>Play Store Monitoring Dashboard</h2>

        <AddAppForm onSubmit={handleAddApp} loading={loadingAddApp} />

        {loadingAddApp && (
          <p className="loading-subtext">Capturing screenshot... please wait ⏳</p>
        )}

        {selectedAppId && screenshots.length > 0 ? (
          <ScreenshotTimeline screenshots={screenshots} />
        ) : (
          <p>No screenshots available.</p>
        )}
      </main>
    </div>
  );
}
