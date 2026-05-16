import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../Api/api';
import { Activity, ShieldCheck, Stethoscope, HeartPulse } from 'lucide-react';

const HealthPrediction = () => {
  const [formData, setFormData] = useState({
    patientName:'', sex: '', age: '', height: '', weight: '',
    smoker: 'no', activity: '1', bp_systolic: '', cholesterol: '',
    genHlth: '3', stroke: 'no'
  });

  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);

    const payload = {
      patientName:formData.patientName,
      sex: formData.sex,
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      smoker: formData.smoker,
      activity: formData.activity,
      bp_systolic: formData.bp_systolic ? parseFloat(formData.bp_systolic) : 124.0,
      cholesterol: formData.cholesterol ? parseFloat(formData.cholesterol) : 175.0,
      genHlth: formData.genHlth,
      stroke: formData.stroke
    };

    try {
      const response = await api.post('/prediction', payload);
      setAnalysis(response.data);
    } catch (error) {
      alert("Analysis failed: " + (error.response?.data?.detail || "Server unreachable"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="prediction-dashboard">
      <div className="dashboard-left">
        <div className="dashboard-header">
          <h1>Health Risk Dashboard</h1>
          <p>Complete the fields below. No scrolling required.</p>
        </div>

        <form className="dashboard-form" onSubmit={handlePredict}>
          <div className="dense-grid">
            <div className="compact-input-wrapper">
              <label>Sex</label>
              <select className="compact-input" onChange={(e) => setFormData({...formData, sex: e.target.value})} required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="compact-input-wrapper">
              <label>Patient Name</label>
              <input type="text" className="compact-input" placeholder="Full Name" onChange={(e) => setFormData({...formData, patientName: e.target.value})} required />
            </div>
            <div className="compact-input-wrapper">
              <label>Age</label>
              <input type="number" className="compact-input" placeholder="Years" onChange={(e) => setFormData({...formData, age: e.target.value})} required />
            </div>
            
            <div className="compact-input-wrapper">
              <label>Height (cm)</label>
              <input type="number" className="compact-input" placeholder="e.g. 175" onChange={(e) => setFormData({...formData, height: e.target.value})} required />
            </div>
            <div className="compact-input-wrapper">
              <label>Weight (kg)</label>
              <input type="number" className="compact-input" placeholder="e.g. 70" onChange={(e) => setFormData({...formData, weight: e.target.value})} required />
            </div>
            <div className="compact-input-wrapper">
              <label>Gen Health</label>
              <select className="compact-input" onChange={(e) => setFormData({...formData, genHlth: e.target.value})} required defaultValue="3">
                <option value="1">Excellent</option>
                <option value="2">Very Good</option>
                <option value="3">Good</option>
                <option value="4">Fair</option>
                <option value="5">Poor</option>
              </select>
            </div>

            <div className="compact-input-wrapper">
              <label>Activity</label>
              <select className="compact-input" onChange={(e) => setFormData({...formData, activity: e.target.value})} defaultValue="1">
                <option value="1">Regular sports</option>
                <option value="2">Occasional</option>
                <option value="3">No activity</option>
              </select>
            </div>
            <div className="compact-input-wrapper">
              <label>Sys BP</label>
              <input type="number" className="compact-input" placeholder="Avg: 124" onChange={(e) => setFormData({...formData, bp_systolic: e.target.value})} />
            </div>
            <div className="compact-input-wrapper">
              <label>Cholesterol</label>
              <input type="number" className="compact-input" placeholder="Avg: 175" onChange={(e) => setFormData({...formData, cholesterol: e.target.value})} />
            </div>

            <div className="compact-input-wrapper">
              <label>Smoker?</label>
              <div className="compact-toggle">
                <button type="button" className={formData.smoker === 'yes' ? 'active yes' : ''} onClick={() => setFormData({...formData, smoker: 'yes'})}>Yes</button>
                <button type="button" className={formData.smoker === 'no' ? 'active no' : ''} onClick={() => setFormData({...formData, smoker: 'no'})}>No</button>
              </div>
            </div>
            <div className="compact-input-wrapper">
              <label>Prior Stroke?</label>
              <div className="compact-toggle">
                <button type="button" className={formData.stroke === 'yes' ? 'active yes' : ''} onClick={() => setFormData({...formData, stroke: 'yes'})}>Yes</button>
                <button type="button" className={formData.stroke === 'no' ? 'active no' : ''} onClick={() => setFormData({...formData, stroke: 'no'})}>No</button>
              </div>
            </div>
          </div>

          <button className="dashboard-btn" type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Generate Health Report"}
          </button>
        </form>
      </div>

      <div className="dashboard-right">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="result-box-compact empty-state">
              <Stethoscope size={48} color="#94a3b8" />
              <h3>Awaiting Data</h3>
              <p>Enter details on the left.</p>
            </motion.div>
          ) : (
            <motion.div key="res" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="result-box-compact">
              <div className="compact-score-viz">
                <svg viewBox="0 0 36 36" className="compact-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <motion.path 
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${analysis.score}, 100` }}
                    transition={{ duration: 1 }}
                    className={`circle ${analysis.risk.toLowerCase()}`} 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" strokeWidth="3" strokeLinecap="round"
                    stroke={analysis.risk === 'High' ? '#ef4444' : analysis.risk === 'Moderate' ? '#f59e0b' : '#10b981'}
                  />
                </svg>
                <div className="compact-score-text">
                  <span className="num">{analysis.score}</span>
                </div>
              </div>

              <div className={`compact-badge ${analysis.risk.toLowerCase()}`}>
                <ShieldCheck size={16} /> {analysis.risk} Risk
              </div>

              <p className="compact-advice">{analysis.advice}</p>

              <div className="compact-details">
                <div className="detail-row">
                  <span><Activity size={14} /> Diabetes Risk</span>
                  <strong>{analysis.details.diabetes_risk}</strong>
                </div>
                <div className="detail-row">
                  <span><HeartPulse size={14} /> Heart Disease</span>
                  <strong>{analysis.details.heart_risk}</strong>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HealthPrediction;