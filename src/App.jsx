import React, { useEffect, useState } from "react";
import LoveCounter from "./components/LoveCounter";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstalledNotice, setShowInstalledNotice] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => checkStandalone();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleDisplayModeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleDisplayModeChange);
    }

    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
      setShowInstalledNotice(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleDisplayModeChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleDisplayModeChange);
      }
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  if (!isStandalone) {
    return (
      <div style={styles.installScreen}>
        {canInstall && (
          <div style={styles.installCard}>
            <div>
              <div style={styles.installTitle}>Cài App Tình Iu</div>
              <div style={styles.installSubtitle}></div>
            </div>
            <button style={styles.installButton} onClick={handleInstallClick}>
              Cài ngay
            </button>
          </div>
        )}
        {showInstalledNotice && (
          <div style={styles.installMessage}>
            Đã cài xong, mở App Tình Iu từ màn hình chính nhé.
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* LOVE COUNTER - Đếm ngày yêu với kỷ niệm */}
      <LoveCounter startDate={import.meta.env.VITE_LOVE_START_DATE} />

      {/* Các tính năng khác sẽ thêm ở đây... */}
      <p style={styles.footerHint}>Vuốt xuống để xem thêm kỉ niệm</p>
    </div>
  );
}

export default App;

const styles = {
  page: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  installScreen: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "24px 0",
  },
  installCard: {
    width: "calc(100% - 40px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    padding: "16px 18px",
    margin: "0 20px",
    borderRadius: "18px",
    color: "#5a1d2c",
    background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    boxShadow: "0 10px 26px rgba(255, 126, 179, 0.35)",
  },
  installTitle: {
    fontWeight: 700,
    fontSize: "1.1rem",
  },
  installSubtitle: {
    fontSize: "0.95rem",
    opacity: 0.8,
  },
  installButton: {
    background: "#ff7eb3",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    padding: "10px 18px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(255, 126, 179, 0.35)",
  },
  installMessage: {
    width: "calc(100% - 40px)",
    margin: "0 20px",
    textAlign: "center",
    color: "#5a1d2c",
    fontWeight: 600,
  },
  footerHint: {
    textAlign: "center",
    color: "#888",
    marginTop: "10px",
  },
};
