# 🧩 PlayStore Monitoring Dashboard (Frontend)

A **real-time web dashboard** that monitors Google Play Store app listings by displaying periodically captured screenshots from the backend service.  
It automatically updates live via **Server-Sent Events (SSE)** whenever the backend captures a new screenshot — no refresh or polling required.

---

## 🚀 Features

✅ **Real-time updates** using Server-Sent Events (SSE)  
✅ **Automatic refresh** of app screenshots when backend updates the database  
✅ **Add new app** via Play Store URL — triggers backend screenshot capture  
✅ **Sidebar with monitored apps**  
✅ **Screenshot timeline** with newest first  
✅ **Loading indicators** for better UX  
✅ Built with **React + TypeScript + Vite**

---

## 🧱 Tech Stack

| Layer | Tech |
|--------|------|
| Framework | [React 18](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vitejs.dev/) |
| API client | [Axios](https://axios-http.com/) |
| Real-time updates | [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) |
| Styling | Simple CSS |

---

## 📂 Project Structure
```
frontend/
├── src/
│ ├── api/
│ │ └── api.ts # Axios API client
│ ├── components/
│ │ ├── AddAppForm.tsx # Add new Play Store app
│ │ ├── AppSidebar.tsx # Sidebar with app list
│ │ ├── ScreenshotTimeline.tsx # Displays screenshots chronologically
│ │ └── ScreenshotCard.tsx # Individual screenshot UI
│ ├── pages/
│ │ └── Dashboard.tsx # Main dashboard logic
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
├── package.json
└── vite.config.ts
```

## ⚙️ Environment Setup

### 1️⃣ Prerequisites
Make sure you have:
- Node.js ≥ 18  
- npm ≥ 9  
- The backend service running at `http://56.228.15.190`

---

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Prerequisites
Configure environment variables
```
VITE_API_URL=http://56.228.15.190/api/
```
---

### 4️⃣ Start the development server
```
npm run dev
```
Then open your browser at:
👉 http://localhost:5173

---

## ⚙️ Usage
### ▶️ Add a new app
1. Paste a Play Store URL (e.g. https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter)

2. Enter an app name

3. Click “Add App”

The backend captures a screenshot, saves metadata to the database, and streams the new image to the dashboard.

### 📸 View screenshots

- The first app in the sidebar loads automatically on page load.
- Screenshots are displayed in descending order (newest first).
- When the backend captures new screenshots (cron job), the timeline updates instantly via SSE.

### 🟢 Live updates

No polling or manual refresh — the frontend subscribes to the backend’s SSE stream:
```
GET /api/events
```
Whenever a new screenshot is saved, the backend broadcasts a JSON event like:
```
{
  "appId": "com.activision.callofduty.shooter",
  "appName": "Call of Duty Mobile",
  "imageUrl": "/public/screenshots/com.activision.callofduty.shooter/...png",
  "capturedAt": "2025-10-29T12:50:32.345Z"
}
```
The frontend receives and renders it immediately.

### 🧠 Key Logic Summary
| Task              | File                                            | Description                                        |
| ----------------- | ----------------------------------------------- | -------------------------------------------------- |
| Fetch apps        | `Dashboard.tsx`                                 | Loads `/api/apps` on mount                         |
| Select first app  | `Dashboard.tsx`                                 | Auto-selects first app and fetches its screenshots |
| Add new app       | `AddAppForm.tsx`                                | Calls `/api/screenshot`                            |
| Fetch screenshots | `Dashboard.tsx`                                 | Calls `/api/screenshots/:appId`                    |
| Live updates      | `EventSource` in `Dashboard.tsx`                | Listens for `/api/events`                          |
| Render UI         | `ScreenshotTimeline.tsx` + `ScreenshotCard.tsx` | Displays screenshots visually                      |

### 🧰 Example API Flow
| Action          | Backend Endpoint          | Method    | Description                         |
| --------------- | ------------------------- | --------- | ----------------------------------- |
| Add new app     | `/api/screenshot`         | POST      | Triggers capture and saves metadata |
| Get apps        | `/api/apps`               | GET       | Returns all monitored apps          |
| Get screenshots | `/api/screenshots/:appId` | GET       | Returns all screenshots for one app |
| Live updates    | `/api/events`             | GET (SSE) | Pushes new screenshot events        |

### 🧩 Example Screenshots
Dashboard UI
```
+-----------------------------------------------------+
| Monitored Apps       | Play Store Monitoring        |
|-----------------------|------------------------------|
| Call of Duty Mobile   | [Add App Form]              |
| Clash of Clans        | [Screenshot Timeline]       |
| ...                   |  [Latest Screenshot ↓]      |
+-----------------------------------------------------+
```
### 🧠 Developer Notes

- The first app in the list automatically loads on page initialization.
- The system uses Server-Sent Events (not WebSockets) for simplicity and efficiency.
- No setInterval or polling is used anywhere — updates are push-based.
- When the backend cron captures new screenshots, the dashboard reflects them in real time.
- You can extend this UI with Material UI, Tailwind, or Recharts for analytics.

### 🧩 Future Enhancements (optional ideas)

- 🕓 “Last updated” indicator for each app
- 📊 Diff-viewer (highlight what changed between screenshots)
- 🗑 Screenshot cleanup / retention control
- 🧭 Filter and search apps
- 🧱 Authentication & user management