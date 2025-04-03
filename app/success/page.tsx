"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}
export default function SuccessPage() {
  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: "success", message: "Payment Successful!" })
      );
    }
    
    window.close(); // Closes the WebView
  }, []);

  return (
    <div>
      <h1>Success</h1>
      <p>Your transaction was successful.</p>
    </div>
  );
}
