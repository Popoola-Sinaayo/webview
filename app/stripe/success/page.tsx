"use client";
import React, { useEffect } from "react";
import styles from "./page.module.css";
import LoadingIcons from "react-loading-icons";

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}
function SuccessPage() {
  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: "success", message: "Login Successful" })
      );
    }
    
    
    window.close(); // Closes the WebView
  }, []);

  return (
    <div className={styles.main}>
      <LoadingIcons.TailSpin stroke="#7216F3" />
      <p>Please wait while we connect your account</p>
    </div>
  );
}

const PageWithSuspense = () => {
  return (
    <React.Suspense fallback={<LoadingIcons.TailSpin stroke="#7216F3" />}>
      <SuccessPage />
    </React.Suspense>
  )
}

export default PageWithSuspense;