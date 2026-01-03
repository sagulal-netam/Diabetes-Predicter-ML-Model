import DiabetesForm from "./components/DiabetesForm";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <div className="logo-glow">
            <span className="logo-icon">🧬</span>
          </div>

          <div className="brand-text">
            <h1>Diabetes Prediction System</h1>
            <p>Machine Learning Powered Healthcare Demo</p>
          </div>
        </div>

        <div className="model-meta">
          <div className="meta-item">
            <span className="meta-label">Model Used</span>
            <span className="meta-value">
              Gradient Boosting Classifier
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">ROC-AUC Score</span>
            <span className="meta-value">0.9794</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Accuracy (CV)</span>
            <span className="meta-value">0.9721 ± 0.0011</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <DiabetesForm />
      </main>

      <section className="model-report">
        <h3>📊 Cross-Validation Performance Report</h3>
        <ul>
          <li>Accuracy: <strong>0.9721 ± 0.0011</strong></li>
          <li>Precision: <strong>0.9851 ± 0.0047</strong></li>
          <li>Recall: <strong>0.6821 ± 0.0108</strong></li>
          <li>F1-Score: <strong>0.8060 ± 0.0084</strong></li>
          <li>ROC-AUC: <strong>0.9790 ± 0.0012</strong></li>
        </ul>
      </section>

      <section className="disclaimer">
        <strong>⚠️ Important Notice:</strong>{" "}
        This application is created strictly for{" "}
        <strong>educational and learning purposes only</strong>. It is{" "}
        <u>not a medical device</u>, does not provide medical advice, and must{" "}
        <strong>not</strong> be used for real-world diagnosis or treatment.
        Always consult a certified healthcare professional for medical decisions.
      </section>

      <footer className="app-footer">
        <span>
          Flask API + React UI · Gradient Boosting ML Model · Demo Project
        </span>
      </footer>
    </div>
  );
}

export default App;
