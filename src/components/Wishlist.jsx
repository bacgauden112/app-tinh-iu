import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

const CATEGORIES = [
  {
    id: "restaurants",
    name: "Quán ăn",
    emoji: "🍱",
    placeholder: "Thêm quán ăn...",
  },
  {
    id: "activities",
    name: "Việc muốn làm",
    emoji: "🎯",
    placeholder: "Thêm hoạt động...",
  },
  {
    id: "places",
    name: "Địa điểm",
    emoji: "📍",
    placeholder: "Thêm địa điểm...",
  },
];

const Wishlist = () => {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [items, setItems] = useState({});
  const [newItem, setNewItem] = useState("");
  const [randomItem, setRandomItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Khởi tạo danh mục
  useEffect(() => {
    CATEGORIES.forEach(({ id }) => {
      const q = query(collection(db, "wishlist"), where("category", "==", id));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setItems((prev) => ({ ...prev, [id]: list }));
      });
      return () => unsubscribe();
    });
  }, []);

  // Thêm item mới
  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    await addDoc(collection(db, "wishlist"), {
      name: newItem,
      category: activeTab,
      createdAt: new Date(),
    });
    setNewItem("");
  };

  // Xóa item
  const deleteItem = async (itemId) => {
    await deleteDoc(doc(db, "wishlist", itemId));
  };

  // Pick random
  const pickRandom = () => {
    const currentItems = items[activeTab] || [];
    if (currentItems.length === 0) return alert("Danh sách trống!");

    setIsSpinning(true);
    setRandomItem(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * currentItems.length);
      setRandomItem(currentItems[randomIndex]);
      setIsSpinning(false);
    }, 1500);
  };

  const currentCategory = CATEGORIES.find((c) => c.id === activeTab);
  const currentItems = items[activeTab] || [];

  return (
    <div style={styles.container}>
      <h2 style={styles.mainTitle}>💝 WISHLIST 💝</h2>

      {/* Tab Navigation */}
      <div style={styles.tabsContainer}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            style={{
              ...styles.tab,
              ...(activeTab === cat.id ? styles.tabActive : styles.tabInactive),
            }}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Card nội dung */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          {currentCategory?.emoji} {currentCategory?.name}
        </h3>

        {/* Form thêm */}
        <form onSubmit={addItem} style={styles.inputGroup}>
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={currentCategory?.placeholder}
            style={styles.input}
          />
          <button type="submit" style={styles.addBtn}>
            +
          </button>
        </form>

        {/* Random picker */}
        <div style={styles.randomZone}>
          <button
            onClick={pickRandom}
            disabled={isSpinning || currentItems.length === 0}
            style={isSpinning ? styles.btnDisabled : styles.randomBtn}
          >
            {isSpinning ? "Đang chọn..." : "Chọn ngẫu nhiên ✨"}
          </button>

          {randomItem && (
            <div style={styles.resultBox}>
              <p style={styles.resultText}>
                Chốt: <strong>{randomItem.name}</strong> thui!
              </p>
            </div>
          )}
        </div>

        {/* Danh sách items */}
        <div style={styles.itemsList}>
          {currentItems.length === 0 ? (
            <p style={styles.emptyText}>Danh sách trống</p>
          ) : (
            currentItems.map((item) => (
              <div key={item.id} style={styles.itemRow}>
                <span>{item.name}</span>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={styles.deleteBtn}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "720px",
    margin: "20px auto",
    padding: "0 20px",
  },
  mainTitle: {
    textAlign: "center",
    color: "#ff7eb3",
    fontSize: "1.6rem",
    marginBottom: "15px",
  },
  tabsContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  tab: {
    padding: "10px 16px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s",
  },
  tabActive: {
    background: "linear-gradient(135deg, #ff9a9e, #fecfef)",
    color: "#fff",
    boxShadow: "0 6px 16px rgba(255, 105, 180, 0.3)",
  },
  tabInactive: {
    background: "#f0f0f0",
    color: "#666",
  },
  card: {
    background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    padding: "24px",
    borderRadius: "25px",
    boxShadow: "0 12px 28px rgba(255, 105, 180, 0.25)",
    color: "white",
  },
  cardTitle: {
    textAlign: "center",
    fontSize: "1.3rem",
    marginBottom: "16px",
    fontWeight: "bold",
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "15px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(255, 255, 255, 0.95)",
    fontSize: "1rem",
    color: "#333",
    outline: "none",
  },
  addBtn: {
    background: "rgba(255, 255, 255, 0.95)",
    color: "#ff7eb3",
    border: "none",
    borderRadius: "50%",
    width: "42px",
    height: "42px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  randomZone: {
    textAlign: "center",
    margin: "20px 0",
  },
  randomBtn: {
    background: "rgba(255, 255, 255, 0.9)",
    color: "#ff7eb3",
    border: "none",
    padding: "12px 24px",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  btnDisabled: {
    background: "rgba(255, 255, 255, 0.5)",
    color: "#ccc",
    border: "none",
    padding: "12px 24px",
    borderRadius: "20px",
    cursor: "not-allowed",
  },
  resultBox: {
    marginTop: "15px",
    padding: "14px",
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "15px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
  },
  resultText: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  itemsList: {
    maxHeight: "280px",
    overflowY: "auto",
    marginTop: "20px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    marginBottom: "8px",
    fontSize: "0.95rem",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
  },
};

export default Wishlist;
