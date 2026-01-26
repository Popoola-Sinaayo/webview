"use client";
import React, { useEffect, useState } from "react";
import styles from "../../page.module.css";
import LoadingIcons from "react-loading-icons";
import { useParams } from "next/navigation";

// Store URLs - Update these with your actual app store URLs
const iosAppId = "6746817405"; // Placeholder - replace with actual App ID
const androidAppId = "com.babble.babble"; // From app.json
const STORE_URLS = {
  ios: `https://apps.apple.com/app/id${iosAppId}`, // Update with actual iOS App Store URL
  android: `https://play.google.com/store/apps/details?id=${androidAppId}`, // Update with actual Google Play URL
};

// Deep link scheme for user app
const USER_SCHEME = "babble://";

function ReferralPage() {
  const [status, setStatus] = useState<string>("Opening app...");
  const [showButton, setShowButton] = useState<boolean>(false);
  const [storeUrl, setStoreUrl] = useState<string>("");
  const [deepLinkUrl, setDeepLinkUrl] = useState<string>("");
  const params = useParams();

  const attemptDeepLink = (url: string) => {
    // Try to open the app using iframe method (works better on iOS)
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.src = url;
    document.body.appendChild(iframe);

    // Also try window.location (works better on Android)
    try {
      window.location.href = url;
    } catch (e) {
      console.error("Error opening deep link:", e);
    }

    // Clean up iframe after a short delay
    setTimeout(() => {
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    }, 100);
  };

  useEffect(() => {
    const initialAttempt = () => {
      // Get referral code from route params
      const code = params?.code as string;
      
      if (!code) {
        setStatus("Invalid referral code");
        setShowButton(true);
        return;
      }

      // Detect device type
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      const isAndroid = /android/i.test(userAgent);

      // Determine store URL based on device
      const url = isIOS ? STORE_URLS.ios : isAndroid ? STORE_URLS.android : STORE_URLS.ios;
      setStoreUrl(url);

      // Build deep link URL with referral code
      const linkUrl = `${USER_SCHEME}signup?referralCode=${encodeURIComponent(code)}`;
      setDeepLinkUrl(linkUrl);

      let appOpened = false;
      const timeout = 6000; // 6 seconds timeout

      // Listen for page visibility changes (app opened = page hidden)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          appOpened = true;
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("pagehide", () => {
        appOpened = true;
      });

      // Attempt to open the app
      attemptDeepLink(linkUrl);

      // Set timeout to check if app opened
      const timeoutId = setTimeout(() => {
        if (!appOpened) {
          setStatus("Link not opening");
          setShowButton(true);
        }
      }, timeout);

      // Clean up
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("pagehide", handleVisibilityChange);
        clearTimeout(timeoutId);
      };
    };

    initialAttempt();
  }, [params]);

  const handleLaunchApp = () => {
    setStatus("Opening app...");
    setShowButton(false);
    attemptDeepLink(deepLinkUrl);
    
    // Show buttons again after timeout if app doesn't open
    setTimeout(() => {
      setStatus("Link not opening");
      setShowButton(true);
    }, 2000);
  };

  const handleDownloadApp = () => {
    window.location.href = storeUrl;
  };

  return (
    <div className={styles.main}>
      {!showButton ? (
        <>
          <LoadingIcons.TailSpin stroke="#7216F3" />
          <p>{status}</p>
        </>
      ) : (
        <>
          <p className={styles.message}>{status}</p>
          <div className={styles.buttonContainer}>
            <button onClick={handleLaunchApp} className={styles.button}>
              Launch App
            </button>
            <button onClick={handleDownloadApp} className={styles.button}>
              Download App
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const PageWithSuspense = () => {
  return (
    <React.Suspense fallback={<LoadingIcons.TailSpin stroke="#7216F3" />}>
      <ReferralPage />
    </React.Suspense>
  );
};

export default PageWithSuspense;
