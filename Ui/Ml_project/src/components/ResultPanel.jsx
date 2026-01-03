import { jsPDF } from "jspdf";
import styles from "./ResultPanel.module.css";

function ResultPanel({ result }) {
  const handleDownloadPdf = () => {
    if (!result) return;

    const { is_diabetic, prediction, details } = result;

    const doc = new jsPDF();

    let y = 15;

    doc.setFontSize(16);
    doc.text("Diabetes Prediction Result", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Prediction: ${is_diabetic ? "Likely Diabetic" : "Not Diabetic"}`, 10, y);
    y += 7;
    doc.text(`Model raw output: ${prediction}`, 10, y);
    y += 10;

    doc.setFontSize(13);
    doc.text("Input Details:", 10, y);
    y += 8;

    doc.setFontSize(11);

    Object.entries(details).forEach(([key, value]) => {
      const line = `${key}: ${String(value)}`;
      doc.text(line, 12, y);
      y += 6;

      // Simple page break if needed
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
    });

    doc.save("diabetes_prediction_result.pdf");
  };

  if (!result) {
    return (
      <div className={styles.card}>
        <h3>Prediction</h3>
        <p className={styles.placeholder}>
          Fill the form and click <strong>Predict</strong> to see the model
          output.
        </p>
      </div>
    );
  }

  const { is_diabetic, prediction, details } = result;

  return (
    <div className={styles.card}>
      <h3>Prediction</h3>

      <div
        className={`${styles.badge} ${
          is_diabetic ? styles.badgeDanger : styles.badgeSafe
        }`}
      >
        {is_diabetic ? "Likely Diabetic" : "Not Diabetic"}
      </div>

      <p className={styles.info}>
        Model raw output: <span>{prediction}</span>
      </p>

      <button
        type="button"
        className={styles.downloadButton}
        onClick={handleDownloadPdf}
      >
        Download PDF Result
      </button>

      <h4 className={styles.subTitle}>Input details</h4>
      <div className={styles.details}>
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className={styles.row}>
            <span className={styles.key}>{key}</span>
            <span className={styles.value}>{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultPanel;
