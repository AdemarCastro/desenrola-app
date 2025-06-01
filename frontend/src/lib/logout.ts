// src/lib/logout.ts
"use client";

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
