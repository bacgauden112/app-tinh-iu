import React from "react";
import LoveCounter from "./components/LoveCounter";

function App() {
  return (
    <div className="App">
      {/* LOVE COUNTER - Đếm ngày yêu với kỷ niệm */}
      <LoveCounter startDate={import.meta.env.VITE_LOVE_START_DATE} />

      {/* Các tính năng khác sẽ thêm ở đây... */}
      <p style={{ textAlign: "center", color: "#888", marginTop: "30px" }}>
        Vuốt xuống để xem thêm kỉ niệm
      </p>
    </div>
  );
}

export default App;
