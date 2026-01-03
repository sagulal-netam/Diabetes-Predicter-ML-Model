import styles from "./ResultCard.module.css";

function ResultCard({ result }) {
  if (!result) {
    return (
      <div className={styles.card}>
        <h3>Prediction Result</h3>
        <p className={styles.placeholder}>Fill the form and click Predict.</p>
      </div>
    );
  }

  const { is_diabetic, details } = result;

  return (
    <div className={styles.card}>
      <h3>Prediction Result</h3>

      <div
        className={`${styles.badge} ${
          is_diabetic ? styles.badgeDanger : styles.badgeSafe
        }`}
      >
        {is_diabetic ? "Likely Diabetic" : "Not Diabetic"}
      </div>

      <p className={styles.subtitle}>Model prediction based on given details.</p>

      <div className={styles.details}>
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className={styles.detailRow}>
            <span className={styles.key}>{key}</span>
            <span className={styles.value}>{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultCard;
