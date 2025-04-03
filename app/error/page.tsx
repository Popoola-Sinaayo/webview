"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import LoadingIcons from "react-loading-icons";

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
    <div className={styles.main}>
      <LoadingIcons.TailSpin stroke="#7216F3" />
    </div>
  );
}
