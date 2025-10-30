import axios from "axios";

const API_BASE = "http://localhost:4000/api";

export const api = {
  captureScreenshot: (data: { appName: string; url: string }) =>
    axios.post(`${API_BASE}/screenshot`, data),

  getScreenshots: (appId: string) =>
    axios.get(`${API_BASE}/screenshots/${appId}`),

  getApps: () => axios.get(`${API_BASE}/apps`), // optional route if you add it
};
