"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import LoadingIcons from "react-loading-icons";

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
    <div className={styles.main}>
      <LoadingIcons.TailSpin stroke="#7216F3" />
    </div>
  );
}
