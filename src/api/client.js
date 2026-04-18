// src/api/client.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
const VENDOR_TOKEN = import.meta.env.VITE_VENDOR_TOKEN || "2|Nf6K62d8BXW8mAJhhMywJXJZSzW5u2aC4yA6s8OC2dd77204";

export async function apiRequest(endpoint, options = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${VENDOR_TOKEN}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`API error [${response.status}]:`, error);
    throw new Error(`API error: ${error}`);
  }

  return response.json();
}
