"use client";
import { useEffect } from "react";

export default function ErrorPage() {
  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: "error", message: "Transaction Failed." })
      );
    }
    window.close(); // Closes the WebView
  }, []);

  return (
    <div>
      <h1>Error</h1>
      <p>Something went wrong with your transaction.</p>
    </div>
  );
}
