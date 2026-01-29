

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../Api/api';

const HealthPrediction = () => {
  const [formData, setFormData] = useState({
    patientName:'',sex: '', age: '', height: '', weight: '',
    smoker: 'no', activity: '1', bp_systolic: '', cholesterol: '',
    genHlth: '3', stroke: 'no'
  });

  const [bmi, setBmi] = useState(null);
  const [bmiStatus, setBmiStatus] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Animation Variants for the results
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  useEffect(() => {
    if (formData.height && formData.weight) {
      const h = formData.height / 100;
      const val = (formData.weight / (h * h)).toFixed(1);
      setBmi(val);
      if (val < 18.5) setBmiStatus('Underweight');
      else if (val < 25) setBmiStatus('Healthy');
      else if (val < 30) setBmiStatus('Overweight');
      else setBmiStatus('Obese');
    }
  }, [formData.height, formData.weight]);

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
      // console.log(response)
      console.error("API Error:", error.response?.data?.detail || error.message);
      alert("Analysis failed: " + (error.response?.data?.detail || "Server unreachable"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app-viewport">
      <div className="sky-bg">
        <motion.div animate={{ x: [-100, 100], y: [-50, 50] }} transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }} className="cloud cloud-1" />
        <motion.div animate={{ x: [100, -100], y: [50, -50] }} transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }} className="cloud cloud-2" />
      </div>

      <motion.div className="glass-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <header className="card-header">
          <div className="logo-icon">❤️</div>
          <h1><span className='pulse-color'>Pulse</span><span className="bold">Health</span></h1>
          <p>AI-Powered Wellness Analysis</p>
        </header>

        <div className="card-body">
          <form className="prediction-form" onSubmit={handlePredict}>
            <div className="input-section">
              <label className="section-label">Personal Vitals</label>
              <div className="input-row">
                <select onChange={(e) => setFormData({...formData, sex: e.target.value})} required>
                  <option value="">Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input type="text" className="input-row-name" placeholder="Patient Name" onChange={(e) => setFormData({...formData, patientName: e.target.value})} required />
                <input type="number" placeholder="Age" onChange={(e) => setFormData({...formData, age: e.target.value})} required />
              </div>

              <div className="input-row">
                <input type="number" placeholder="Height (cm)" onChange={(e) => setFormData({...formData, height: e.target.value})} required />
                <input type="number" placeholder="Weight (kg)" onChange={(e) => setFormData({...formData, weight: e.target.value})} required />
              </div>

              <AnimatePresence>
                {bmi && (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`bmi-pill ${bmiStatus.toLowerCase()}`}>
                    {bmiStatus}: {bmi} BMI
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="input-section">
              <label className="section-label">Lifestyle & History</label>
              <select className="full-select" style={{marginBottom: '15px'}} onChange={(e) => setFormData({...formData, genHlth: e.target.value})} required>
                <option value="1">Excellent Health</option>
                <option value="2">Very Good Health</option>
                <option value="3">Good Health</option>
                <option value="4">Fair Health</option>
                <option value="5">Poor Health</option>
              </select>

              <select className="full-select" style={{marginBottom: '15px'}} onChange={(e) => setFormData({...formData, activity: e.target.value})}>
                <option value="1">Regular sports & fitness</option>
                <option value="2">Weekly / Occasional</option>
                <option value="3">No physical activity</option>
              </select>

              <div className="input-row">
                <div className="toggle-container" style={{flex: 1}}>
                  <span className="toggle-label">Smoker?</span>
                  <div className="toggle-group">
                    <button type="button" className={formData.smoker === 'yes' ? 'active' : ''} onClick={() => setFormData({...formData, smoker: 'yes'})}>Yes</button>
                    <button type="button" className={formData.smoker === 'no' ? 'active' : ''} onClick={() => setFormData({...formData, smoker: 'no'})}>No</button>
                  </div>
                </div>

                <div className="toggle-container" style={{flex: 1}}>
                  <span className="toggle-label">Prior Stroke?</span>
                  <div className="toggle-group">
                    <button type="button" className={formData.stroke === 'yes' ? 'active' : ''} onClick={() => setFormData({...formData, stroke: 'yes'})}>Yes</button>
                    <button type="button" className={formData.stroke === 'no' ? 'active' : ''} onClick={() => setFormData({...formData, stroke: 'no'})}>No</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="input-section">
              <label className="section-label">Clinical (Avg. Filled if Empty)</label>
              <div className="input-row">
                <input type="number" placeholder="BP (124)" onChange={(e) => setFormData({...formData, bp_systolic: e.target.value})} />
                <input type="number" placeholder="Chol (175)" onChange={(e) => setFormData({...formData, cholesterol: e.target.value})} />
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="analyze-btn" type="submit" disabled={isAnalyzing}>
              {isAnalyzing ? "AI Analyzing..." : "Analyze Now"}
            </motion.button>
          </form>

          <div className="result-panel">
            <AnimatePresence mode="wait">
              {!analysis ? (
                <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="wait-box">
                  <div className="pulse-loader" />
                  <h3>Ready to Scan</h3>
                  <p>Submit your details for a real-time health summary.</p>
                </motion.div>
              ) : (
                <motion.div 
                    key="res" 
                    variants={containerVars} 
                    initial="hidden" 
                    animate="visible" 
                    className="analysis-container"
                >
                  <motion.div variants={itemVars} className="score-viz">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <motion.path 
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: `${analysis.score}, 100` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`circle ${analysis.risk.toLowerCase()}`} 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      />
                    </svg>
                    <div className="score-text-overlay">
                      <span className="num">{analysis.score}</span>
                      <span className="unit">Health Score</span>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVars} className={`status-badge-new ${analysis.risk.toLowerCase()}`}>
                    {analysis.risk} Risk Level
                  </motion.div>

                  <motion.div variants={itemVars} className="advice-card">
                    <p>{analysis.advice}</p>
                  </motion.div>

                  <motion.div variants={itemVars} className="details-grid">
                    <div className="detail-item">
                      <div className="detail-info">
                        <span>Diabetes Risk</span>
                        <span>{analysis.details.diabetes_risk}</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div 
                            className="progress-fill diab" 
                            initial={{ width: 0 }} 
                            animate={{ width: analysis.details.diabetes_risk }} 
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-info">
                        <span>Heart Disease</span>
                        <span>{analysis.details.heart_risk}</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div 
                            className="progress-fill heart" 
                            initial={{ width: 0 }} 
                            animate={{ width: analysis.details.heart_risk }} 
                            transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthPrediction;