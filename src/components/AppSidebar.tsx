import React from "react";

interface Props {
  apps: { appId: string; appName: string }[];
  selectedAppId: string | null;
  onSelect: (appId: string) => void;
}

export default function AppSidebar({ apps, selectedAppId, onSelect }: Props) {
  return (
    <aside className="sidebar">
      <h3>Monitored Apps</h3>
      <ul>
        {apps.map((app) => (
          <li
            key={app.appId}
            className={app.appId === selectedAppId ? "active" : ""}
            onClick={() => onSelect(app.appId)}
          >
            {app.appName}
          </li>
        ))}
      </ul>
    </aside>
  );
}
