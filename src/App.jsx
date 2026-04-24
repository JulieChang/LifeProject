import React from "react";

export default function App() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>Financial Freedom Planner</h1>
        <p style={styles.subtitle}>
          一個簡潔版財務自由規劃工具，用來追蹤收入、支出、投資與旅遊預算。
        </p>

        <div style={styles.grid}>
          <div style={styles.box}>
            <div style={styles.label}>每月收入</div>
            <div style={styles.value}>NT$151,000</div>
          </div>

          <div style={styles.box}>
            <div style={styles.label}>每月生活費預算</div>
            <div style={styles.value}>NT$35,000</div>
          </div>

          <div style={styles.box}>
            <div style={styles.label}>每月 ETF 投資</div>
            <div style={styles.value}>NT$15,000</div>
          </div>

          <div style={styles.box}>
            <div style={styles.label}>年度旅遊預算</div>
            <div style={styles.value}>NT$300,000</div>
          </div>
        </div>

        <section style={styles.section}>
          <h2>目前配置</h2>
          <ul>
            <li>006208：NT$10,000 / 月</li>
            <li>00918：NT$3,000 / 月</li>
            <li>00982A：NT$2,000 / 月</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2>目標</h2>
          <p>
            逐步建立現金桶、旅遊桶與長期投資部位，讓每月現金流更穩定，
            並支援未來潛水、滑雪與高爾夫行程。
          </p>
        </section>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "32px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    maxWidth: "960px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "36px",
    margin: "0 0 12px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "32px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  box: {
    background: "#f0f4ff",
    borderRadius: "18px",
    padding: "20px",
  },
  label: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  value: {
    fontSize: "24px",
    fontWeight: "700",
  },
  section: {
    marginTop: "32px",
    lineHeight: "1.7",
  },
};
