// src/api/orders.js
import { apiRequest } from "./client";

export async function createOrder(orderData) {
  // ✅ No need to extract vendor_token - it's already in the Authorization header
  // Just remove vendor_token from the payload before sending
  const { vendor_token, cart_token, ...orderPayload } = orderData;
  
  return apiRequest("orders", {
    method: "POST",
    body: JSON.stringify(orderPayload),
  });
}