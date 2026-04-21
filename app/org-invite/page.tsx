"use client";
import React, { useEffect, useState } from "react";
import styles from "../user/page.module.css";
import LoadingIcons from "react-loading-icons";
import { useSearchParams } from "next/navigation";

const iosAppId = "6746817405";
const androidAppId = "com.babble.babble";
const STORE_URLS = {
  ios: `https://apps.apple.com/app/id${iosAppId}`,
  android: `https://play.google.com/store/apps/details?id=${androidAppId}`,
};

const USER_SCHEME = "babble://";

function OrgInvitePage() {
  const [status, setStatus] = useState<string>("Opening app...");
  const [showButton, setShowButton] = useState<boolean>(false);
  const [storeUrl, setStoreUrl] = useState<string>("");
  const [deepLinkUrl, setDeepLinkUrl] = useState<string>("");
  const searchParams = useSearchParams();

  const attemptDeepLink = (url: string) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.src = url;
    document.body.appendChild(iframe);

    try {
      window.location.href = url;
    } catch (e) {
      console.error("Error opening deep link:", e);
    }

    setTimeout(() => {
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    }, 100);
  };

  useEffect(() => {
    const organisationId = searchParams.get("organisationId");
    const code = searchParams.get("code");

    if (!organisationId || !code) {
      setStatus("This invite link is missing organisation or code.");
      setShowButton(true);
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      const isAndroid = /android/i.test(userAgent);
      setStoreUrl(isIOS ? STORE_URLS.ios : isAndroid ? STORE_URLS.android : STORE_URLS.ios);
      setDeepLinkUrl("");
      return;
    }

    const query = new URLSearchParams({
      organisationId,
      code,
    }).toString();
    const linkUrl = `${USER_SCHEME}org-invite?${query}`;
    setDeepLinkUrl(linkUrl);

    const initialAttempt = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      const isAndroid = /android/i.test(userAgent);

      const url = isIOS ? STORE_URLS.ios : isAndroid ? STORE_URLS.android : STORE_URLS.ios;
      setStoreUrl(url);

      let appOpened = false;
      const timeout = 6000;

      const handleVisibilityChange = () => {
        if (document.hidden) {
          appOpened = true;
        }
      };

      const handlePageHide = () => {
        appOpened = true;
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("pagehide", handlePageHide);

      attemptDeepLink(linkUrl);

      const timeoutId = setTimeout(() => {
        if (!appOpened) {
          setStatus("Link not opening");
          setShowButton(true);
        }
      }, timeout);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("pagehide", handlePageHide);
        clearTimeout(timeoutId);
      };
    };

    return initialAttempt();
  }, [searchParams]);

  const handleLaunchApp = () => {
    if (!deepLinkUrl) return;
    setStatus("Opening app...");
    setShowButton(false);
    attemptDeepLink(deepLinkUrl);

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
            {deepLinkUrl ? (
              <button type="button" onClick={handleLaunchApp} className={styles.button}>
                Launch App
              </button>
            ) : null}
            <button type="button" onClick={handleDownloadApp} className={styles.button}>
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
      <OrgInvitePage />
    </React.Suspense>
  );
};

export default PageWithSuspense;
