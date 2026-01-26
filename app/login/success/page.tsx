"use client";
import React, { useEffect } from "react";
import styles from "./page.module.css";
import LoadingIcons from "react-loading-icons";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}
function SuccessPage() {
  const params = useSearchParams()
  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: "success", message: "Login Successful", token: params.get("token") })
      );
    }
    const token = params.get("token")
    console.log(token)
    window.close(); // Closes the WebView
  }, []);

  return (
    <div className={styles.main}>
      <LoadingIcons.TailSpin stroke="#7216F3" />
      <p>Please wait while we process your payout</p>
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