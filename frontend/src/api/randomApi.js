const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

async function fetchData(endpoint, size = 10) {
  const res = await fetch(`${API_BASE}/${endpoint}?size=${size}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data ? [data] : [];
}

async function patchData(endpoint, id, payload) {
  await fetch(`${API_BASE}/${endpoint}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function deleteData(endpoint, id) {
  await fetch(`${API_BASE}/${endpoint}/${id}`, { method: "DELETE" });
}

async function fetchRandom(endpoint, size = 10) {
  const res = await fetch(`${API_BASE}/random/${endpoint}?size=${size}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data ? [data] : [];
}

async function saveRandom(endpoint, payload) {
  const res = await fetch(`${API_BASE}/random/${endpoint}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export { fetchRandom, saveRandom, fetchData, patchData, deleteData };
