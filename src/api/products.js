// src/api/products.js
import { apiRequest } from "./client";

export async function fetchVendorProducts() {
  return apiRequest("products");
}
