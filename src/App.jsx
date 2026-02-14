import React, { useEffect, useState } from "react";
import LoveCounter from "./components/LoveCounter";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
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

  return (
    <div style={styles.page}>
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
  footerHint: {
    textAlign: "center",
    color: "#888",
    marginTop: "10px",
  },
};
