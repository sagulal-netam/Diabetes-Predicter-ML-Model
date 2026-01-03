import { useState } from "react";
import ResultPanel from "./ResultPanel";
import styles from "./DiabetesForm.module.css";

const initialState = {
  gender: "",
  age: 30,
  hypertension: "0",
  heart_disease: "0",
  smoking_history: "",
  bmi: 24.5,
  HbA1c_level: 5.9,
  blood_glucose_level: 110,
};

function DiabetesForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        gender: form.gender,
        age: Number(form.age),
        hypertension: Number(form.hypertension),
        heart_disease: Number(form.heart_disease),
        smoking_history: form.smoking_history,
        bmi: parseFloat(form.bmi),
        HbA1c_level: parseFloat(form.HbA1c_level),
        blood_glucose_level: parseFloat(form.blood_glucose_level),
      };

      const res = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResult({
        prediction: data.prediction,
        is_diabetic: data.is_diabetic,
        details: payload,
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setResult(null);
    setError("");
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Patient Details</h2>

        {/* Dropdown fields */}
        <div className={styles.grid}>
          {/* Gender */}
          <div className={styles.field}>
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleSelectChange}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Smoking history */}
          <div className={styles.field}>
            <label>Smoking History</label>
            <select
              name="smoking_history"
              value={form.smoking_history}
              onChange={handleSelectChange}
              required
            >
              <option value="">Select</option>
              <option value="never">Never</option>
              <option value="former">Former</option>
              <option value="current">Current</option>
              <option value="ever">Ever</option>
              <option value="not current">Not current</option>
            </select>
          </div>

          {/* Hypertension */}
          <div className={styles.field}>
            <label>Hypertension</label>
            <select
              name="hypertension"
              value={form.hypertension}
              onChange={handleSelectChange}
              required
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          {/* Heart disease */}
          <div className={styles.field}>
            <label>Heart Disease</label>
            <select
              name="heart_disease"
              value={form.heart_disease}
              onChange={handleSelectChange}
              required
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        </div>

        {/* Sliders */}
        <div className={styles.sliders}>
          {/* Age */}
          <div className={styles.sliderField}>
            <div className={styles.sliderHeader}>
              <label>Age</label>
              <span>{form.age} years</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={form.age}
              onChange={(e) => handleSliderChange("age", e.target.value)}
            />
          </div>

          {/* BMI with +/- 0.01 */}
          <div className={styles.sliderField}>
            <div className={styles.sliderHeader}>
              <label>BMI</label>
              <span>{form.bmi.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() => {
                  const newValue = Math.max(10, form.bmi - 0.01);
                  handleSliderChange("bmi", newValue.toFixed(2));
                }}
              >
                −
              </button>

              <input
                type="range"
                min="10"
                max="50"
                step="0.01"
                value={form.bmi}
                onChange={(e) => handleSliderChange("bmi", e.target.value)}
                style={{ flex: 1 }}
              />

              <button
                type="button"
                onClick={() => {
                  const newValue = Math.min(50, form.bmi + 0.01);
                  handleSliderChange("bmi", newValue.toFixed(2));
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* HbA1c – one decimal only */}
          <div className={styles.sliderField}>
            <div className={styles.sliderHeader}>
              <label>HbA1c Level</label>
              <span>{form.HbA1c_level.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="4"
              max="15"
              step="0.1"
              value={form.HbA1c_level}
              onChange={(e) =>
                handleSliderChange("HbA1c_level", e.target.value)
              }
            />
          </div>

          {/* Blood glucose */}
          <div className={styles.sliderField}>
            <div className={styles.sliderHeader}>
              <label>Blood Glucose Level</label>
              <span>{form.blood_glucose_level.toFixed(0)} mg/dL</span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="1"
              value={form.blood_glucose_level}
              onChange={(e) =>
                handleSliderChange("blood_glucose_level", e.target.value)
              }
            />
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" onClick={handleReset} disabled={loading}>
            Reset
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>
      </form>

      <ResultPanel result={result} />
    </div>
  );
}

export default DiabetesForm;
