import React, { useEffect, useState } from "react";
import LoveCounter from "./components/LoveCounter";
import Wishlist from "./components/Wishlist";

const TABS = [
  { id: "counter", label: "Love Counter", emoji: "💕" },
  { id: "wishlist", label: "Wishlist", emoji: "🎁" },
  { id: "memories", label: "Our Memories", emoji: "📸" },
  { id: "voucher", label: "Love Voucher", emoji: "🎟️" },
];

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstalledNotice, setShowInstalledNotice] = useState(false);
  const [showManualInstallHint, setShowManualInstallHint] = useState(false);
  const [installHintText, setInstallHintText] = useState("");
  const [activeTab, setActiveTab] = useState("counter");

  useEffect(() => {
    const userAgent = window.navigator.userAgent || "";
    const isIos = /iphone|ipad|ipod/i.test(userAgent);
    const isAndroid = /android/i.test(userAgent);
    const hintText = isIos
      ? 'Nếu không thấy nút Cài ngay, hãy nhấn Chia sẻ và chọn "Add to Home Screen".'
      : isAndroid
        ? 'Nếu không thấy nút Cài ngay, hãy mở menu trình duyệt và chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".'
        : 'Nếu không thấy nút Cài ngay, hãy mở menu trình duyệt và chọn "Cài đặt ứng dụng".';
    setInstallHintText(hintText);

    const hintTimer = window.setTimeout(() => {
      setShowManualInstallHint(true);
    }, 1200);

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
      setShowManualInstallHint(false);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
      setShowInstalledNotice(true);
      setShowManualInstallHint(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.clearTimeout(hintTimer);
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
        {showManualInstallHint && !canInstall && !showInstalledNotice && (
          <div style={styles.installHint}>{installHintText}</div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* TAB CONTENT */}
      <div style={styles.contentArea}>
        {/* Love Counter */}
        {activeTab === "counter" && (
          <div style={styles.tabContent}>
            <LoveCounter startDate={import.meta.env.VITE_LOVE_START_DATE} />
          </div>
        )}

        {/* Wishlist */}
        {activeTab === "wishlist" && (
          <div style={styles.tabContent}>
            <Wishlist />
          </div>
        )}

        {/* Our Memories - Placeholder */}
        {activeTab === "memories" && (
          <div style={styles.tabContent}>
            <div style={styles.placeholderCard}>
              <h2 style={styles.placeholderEmoji}>📸</h2>
              <h3 style={styles.placeholderTitle}>Our Memories</h3>
              <p style={styles.placeholderText}>
                Kho ảnh chung và check-in hàng ngày
              </p>
              <p style={styles.placeholderSoon}>Tính năng sắp có...</p>
            </div>
          </div>
        )}

        {/* Love Voucher - Placeholder */}
        {activeTab === "voucher" && (
          <div style={styles.tabContent}>
            <div style={styles.placeholderCard}>
              <h2 style={styles.placeholderEmoji}>🎟️</h2>
              <h3 style={styles.placeholderTitle}>Love Voucher</h3>
              <p style={styles.placeholderText}>
                Voucher thưởng phạt tùy chỉnh
              </p>
              <p style={styles.placeholderSoon}>Tính năng sắp có...</p>
            </div>
          </div>
        )}
      </div>

      {/* TAB NAVIGATION BAR - Fixed at bottom */}
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.id
                ? styles.tabButtonActive
                : styles.tabButtonInactive),
            }}
          >
            <span style={styles.tabEmoji}>{tab.emoji}</span>
            <span style={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>
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
    minHeight: "100vh",
    paddingBottom: "80px",
  },
  contentArea: {
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  tabContent: {
    width: "100%",
    paddingTop: "20px",
  },
  tabBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    boxShadow: "0 -4px 16px rgba(255, 126, 179, 0.25)",
    height: "70px",
    zIndex: 100,
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  },
  tabButton: {
    flex: 1,
    height: "100%",
    border: "none",
    background: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    transition: "all 0.3s",
  },
  tabButtonActive: {
    background: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
  },
  tabButtonInactive: {
    opacity: 0.7,
    color: "rgba(255, 255, 255, 0.8)",
  },
  tabEmoji: {
    fontSize: "1.3rem",
  },
  tabLabel: {
    fontSize: "0.7rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  placeholderCard: {
    margin: "40px 20px",
    padding: "40px 24px",
    background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    borderRadius: "25px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 8px 24px rgba(255, 105, 180, 0.25)",
  },
  placeholderEmoji: {
    fontSize: "3rem",
    margin: "0 0 16px 0",
  },
  placeholderTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "0 0 8px 0",
  },
  placeholderText: {
    fontSize: "0.95rem",
    opacity: 0.9,
    margin: "0 0 16px 0",
  },
  placeholderSoon: {
    fontSize: "0.85rem",
    opacity: 0.7,
    fontStyle: "italic",
    margin: 0,
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
  installHint: {
    width: "calc(100% - 40px)",
    margin: "0 20px",
    padding: "12px 16px",
    textAlign: "center",
    color: "#fff",
    background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    borderRadius: "14px",
    boxShadow: "0 8px 18px rgba(255, 126, 179, 0.4)",
  },
  footerHint: {
    textAlign: "center",
    color: "#888",
    marginTop: "10px",
  },
};
