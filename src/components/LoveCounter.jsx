import React, { useEffect, useState } from "react";

const MILESTONES = [
  { days: 7, name: "1 tuần đầu tiên", emoji: "💕" },
  { days: 30, name: "1 tháng bằng trái tim", emoji: "💖" },
  { days: 50, name: "50 ngày ngọt ngào", emoji: "🌹" },
  { days: 100, name: "100 ngày hạnh phúc", emoji: "🎉" },
  { days: 200, name: "200 ngày yêu thương", emoji: "💝" },
  { days: 365, name: "1 năm tuyệt vời", emoji: "🎊" },
  { days: 500, name: "500 ngày gắn bó", emoji: "💏" },
  { days: 730, name: "2 năm bên nhau", emoji: "💞" },
  { days: 1000, name: "1000 ngày tình yêu", emoji: "👑" },
  { days: 1095, name: "3 năm mật ngọt", emoji: "🎆" },
  { days: 1500, name: "1500 ngày đồng hành", emoji: "💫" },
  { days: 1825, name: "5 năm vàng son", emoji: "💍" },
  { days: 2555, name: "7 năm gắn bó", emoji: "🌟" },
  { days: 3650, name: "10 năm hoàn hảo", emoji: "👨‍❤️‍👩" },
];

const LoveCounter = ({ startDate }) => {
  // Get start date from prop, env, or use default with validation
  const getValidStartDate = () => {
    const date =
      startDate || import.meta.env.VITE_LOVE_START_DATE || "2026-01-16";
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date("2026-01-16") : parsed;
  };

  const resolvedStartDate = getValidStartDate();
  const [timeData, setTimeData] = useState({
    days: 0,
    weeks: 0,
    months: 0,
    years: 0,
  });
  const [nextMilestone, setNextMilestone] = useState(null);

  useEffect(() => {
    const calculateTime = () => {
      const start = resolvedStartDate;
      const today = new Date();
      const diffTime = Math.abs(today - start);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30.44);
      const diffYears = Math.floor(diffDays / 365.25);

      setTimeData({
        days: diffDays,
        weeks: diffWeeks,
        months: diffMonths,
        years: diffYears,
      });

      const upcoming = MILESTONES.find(
        (milestone) => milestone.days > diffDays,
      );
      if (upcoming) {
        const daysLeft = upcoming.days - diffDays;
        setNextMilestone({
          ...upcoming,
          daysLeft,
        });
      } else {
        setNextMilestone(null);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const todayMilestone = MILESTONES.find(
    (milestone) => milestone.days === timeData.days,
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>💕 LOVE COUNTER 💕</h2>
        <p style={styles.subtitle}>Đếm từng khoảnh khắc yêu thương</p>
      </div>

      <div style={styles.mainCounter}>
        <p style={styles.mainText}>Chúng mình đã yêu nhau được</p>
        <h1 style={styles.mainNumber}>{timeData.days}</h1>
        <p style={styles.dayText}>NGÀY</p>
      </div>

      <div style={styles.breakdown}>
        <div style={styles.timeBox}>
          <span style={styles.timeNumber}>{timeData.weeks}</span>
          <span style={styles.timeLabel}>tuần</span>
        </div>
        <div style={styles.timeBox}>
          <span style={styles.timeNumber}>{timeData.months}</span>
          <span style={styles.timeLabel}>tháng</span>
        </div>
        <div style={styles.timeBox}>
          <span style={styles.timeNumber}>{timeData.years}</span>
          <span style={styles.timeLabel}>năm</span>
        </div>
      </div>

      {todayMilestone && (
        <div style={styles.celebration}>
          <div style={styles.celebrationContent}>
            <span style={styles.celebrationEmoji}>{todayMilestone.emoji}</span>
            <h3 style={styles.celebrationTitle}>CHÚC MỪNG!</h3>
            <p style={styles.celebrationText}>{todayMilestone.name}</p>
          </div>
        </div>
      )}

      {nextMilestone && (
        <div style={styles.nextMilestone}>
          <p style={styles.nextTitle}>
            {nextMilestone.emoji} Kỷ niệm tiếp theo
          </p>
          <p style={styles.nextName}>{nextMilestone.name}</p>
          <p style={styles.countdown}>
            Còn <strong>{nextMilestone.daysLeft}</strong> ngày nữa thôi!
          </p>
        </div>
      )}

      <div style={styles.loveMessage}>
        <p style={styles.message}>❤️ Mỗi ngày trôi qua là một kỷ niệm đẹp ❤️</p>
        <p style={styles.subMessage}>Love you more every single day! 💖</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background:
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff7eb3 100%)",
    padding: "25px",
    borderRadius: "25px",
    textAlign: "center",
    margin: "20px",
    boxShadow: "0 15px 35px rgba(255, 105, 180, 0.3)",
    color: "white",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  subtitle: {
    fontSize: "0.95rem",
    margin: 0,
    opacity: 0.9,
    fontStyle: "italic",
  },
  mainCounter: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "20px",
    margin: "20px 0",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  mainText: {
    fontSize: "1.1rem",
    margin: "0 0 10px 0",
    fontWeight: "500",
  },
  mainNumber: {
    fontSize: "4.5rem",
    fontWeight: "bold",
    margin: "10px 0",
    textShadow: "0 3px 6px rgba(0,0,0,0.4)",
    background: "linear-gradient(45deg, #fff, #f8f8f8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  dayText: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    letterSpacing: "3px",
    margin: 0,
  },
  breakdown: {
    display: "flex",
    justifyContent: "space-around",
    margin: "25px 0",
    gap: "10px",
  },
  timeBox: {
    background: "rgba(255,255,255,0.2)",
    borderRadius: "15px",
    padding: "15px 8px",
    flex: 1,
    backdropFilter: "blur(5px)",
  },
  timeNumber: {
    display: "block",
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  timeLabel: {
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
    opacity: 0.9,
  },
  celebration: {
    background: "linear-gradient(45deg, #ff6b9d, #ff8fab)",
    borderRadius: "20px",
    padding: "20px",
    margin: "20px 0",
    border: "3px solid rgba(255,255,255,0.6)",
  },
  celebrationContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  celebrationEmoji: {
    fontSize: "3rem",
    marginBottom: "10px",
  },
  celebrationTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  celebrationText: {
    fontSize: "1.1rem",
    margin: 0,
    fontWeight: "500",
  },
  nextMilestone: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "15px",
    padding: "18px",
    margin: "20px 0",
    border: "1px dashed rgba(255,255,255,0.4)",
  },
  nextTitle: {
    fontSize: "1rem",
    margin: "0 0 8px 0",
    fontWeight: "500",
    opacity: 0.9,
  },
  nextName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: "0 0 8px 0",
  },
  countdown: {
    fontSize: "1rem",
    margin: 0,
    opacity: 0.9,
  },
  loveMessage: {
    marginTop: "25px",
    padding: "20px 0",
    borderTop: "1px solid rgba(255,255,255,0.3)",
  },
  message: {
    fontSize: "1rem",
    margin: "0 0 8px 0",
    fontWeight: "500",
  },
  subMessage: {
    fontSize: "0.9rem",
    margin: 0,
    fontStyle: "italic",
    opacity: 0.9,
  },
};

export default LoveCounter;
