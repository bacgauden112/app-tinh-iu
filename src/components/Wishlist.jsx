import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Đảm bảo bạn đã setup firebase.js như bước trước
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [randomItem, setRandomItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // 1. Lấy dữ liệu từ Firebase theo thời gian thực
  useEffect(() => {
    const q = query(collection(db, "wishlist"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setItems(list);
    });
    return () => unsubscribe();
  }, []);

  // 2. Thêm món mới
  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem) return;
    await addDoc(collection(db, "wishlist"), {
      name: newItem,
      status: "pending",
      createdAt: new Date(),
    });
    setNewItem("");
  };

  // 3. Logic Pick Random (Xoay vòng quay may mắn)
  const pickRandom = () => {
    if (items.length === 0) return alert("Danh sách trống trơn à!");

    setIsSpinning(true);
    setRandomItem(null);

    // Hiệu ứng giả lập đang chọn trong 1.5 giây
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      setRandomItem(items[randomIndex]);
      setIsSpinning(false);
    }, 1500);
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🍱 Hôm nay ăn gì?</h3>

      {/* Ô nhập món mới */}
      <form onSubmit={addItem} style={styles.inputGroup}>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Nhập món mới vào đây..."
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>
          +
        </button>
      </form>

      {/* Kết quả Random */}
      <div style={styles.randomZone}>
        <button
          onClick={pickRandom}
          disabled={isSpinning}
          style={isSpinning ? styles.btnDisabled : styles.randomButton}
        >
          {isSpinning ? "Đang chọn..." : "Chọn ngẫu nhiên ✨"}
        </button>

        {randomItem && (
          <div style={styles.resultCloud}>
            <p>
              Chốt: <strong>{randomItem.name}</strong> thui!
            </p>
          </div>
        )}
      </div>

      {/* Danh sách các món (Dạng list đơn giản) */}
      <div style={styles.list}>
        {items.map((item) => (
          <div key={item.id} style={styles.listItem}>
            ☁️ {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    margin: "20px",
    padding: "20px",
    borderRadius: "25px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
    fontFamily: "sans-serif",
  },
  title: { color: "#ff7eb3", textAlign: "center" },
  inputGroup: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "15px",
    border: "1px solid #eee",
  },
  addButton: {
    background: "#ff7eb3",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    cursor: "pointer",
  },
  randomZone: { textAlign: "center", margin: "20px 0" },
  randomButton: {
    background: "linear-gradient(to right, #ff7eb3, #ff758c)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    fontWeight: "bold",
  },
  btnDisabled: {
    background: "#ccc",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
  },
  resultCloud: {
    marginTop: "15px",
    padding: "10px",
    background: "#f0f8ff",
    borderRadius: "15px",
    border: "2px dashed #ff7eb3",
    animation: "bounce 0.5s",
  },
  list: { maxHeight: "200px", overflowY: "auto" },
  listItem: {
    padding: "8px 0",
    borderBottom: "1px solid #f9f9f9",
    color: "#666",
  },
};

export default Wishlist;
