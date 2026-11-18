
import api from "./axios";

// Get store settings
export const getSiteSettings = async () => {
  const response = await api.get("/settings");
  return response.data.settings;
};

// Update store settings
export const updateSiteSettings = async (settingsData) => {
  const response = await api.put("/settings", settingsData);
  return response.data.settings;
};
