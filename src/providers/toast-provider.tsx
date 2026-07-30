"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      gutter={12}
      containerStyle={{ bottom: 24, right: 24 }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1a1a2e",
          color: "#fff",
          borderRadius: "12px",
          padding: "14px 18px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
          border: "1px solid rgba(255,255,255,0.08)",
          maxWidth: "380px",
        },
        success: {
          iconTheme: { primary: "#4ade80", secondary: "#1a1a2e" },
          duration: 3000,
        },
        error: {
          iconTheme: { primary: "#f87171", secondary: "#1a1a2e" },
          duration: 5000,
        },
      }}
    />
  );
}
