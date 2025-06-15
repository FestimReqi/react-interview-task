const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Get all job sites
export const getJobSites = async () => {
  const res = await fetch(`${baseURL}/job-sites`);
  return await res.json();
};

// Create a new job site
export const createJobSite = async (data) => {
  const res = await fetch(`${baseURL}/job-sites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

// Get inventory for a specific job site
export const getJobSiteInventory = async (jobSiteId) => {
  const res = await fetch(`${baseURL}/job-sites/${jobSiteId}/inventory`);
  return await res.json();
};

// Add new inventory item
export const createInventoryItem = async (jobSiteId, data) => {
  const res = await fetch(`${baseURL}/job-sites/${jobSiteId}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

// Update inventory item
export const updateInventoryItem = async (jobSiteId, itemId, data) => {
  const res = await fetch(
    `${baseURL}/job-sites/${jobSiteId}/inventory/${itemId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return await res.json();
};

// Update job site
export const updateJobSite = async (jobSiteId, data) => {
  const res = await fetch(`${baseURL}/job-sites/${jobSiteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};
