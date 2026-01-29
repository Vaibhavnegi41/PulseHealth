import React from 'react';
import { motion } from 'framer-motion';

export const About = () => {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVars = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="about-viewport">
      <motion.div 
        className="about-container"
        variants={containerVars}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.section variants={itemVars} className="about-header">
          <span className="tech-badge">Medical Intelligence</span>
          <h1>Behind the <span className="blue-gradient">PulseHealth</span></h1>
          <p>
            PulseHealth is an advanced diagnostic auxiliary system. We bridge the gap between raw clinical data and actionable health insights using state-of-the-art machine learning. By leveraging a dual-ensemble architecture of 400 optimized decision trees, our platform meticulously parses 15 key physiological markers to identify early warning signs of chronic conditions.

Unlike traditional static assessments, PulseHealth utilizes probabilistic modeling to quantify health risks on a dynamic spectrum, providing users with a comprehensive wellness narrative rather than a simple diagnosis. Our mission is to democratize preventive healthcare, empowering individuals with the clinical-grade foresight needed to make proactive lifestyle adjustments and lead healthier, longer lives.
          </p>
        </motion.section>

        {/* Accuracy Section */}
        <motion.section variants={itemVars} className="specs-grid">
          <div className="spec-card">
            <h3>80.15%</h3>
            <p>Diabetes Detection Accuracy</p>
            <div className="mini-progress"><motion.div initial={{width:0}} animate={{width:'80.15%'}} transition={{duration:1.5}} className="bar"/></div>
          </div>
          <div className="spec-card">
            <h3>89.61%</h3>
            <p>Heart Disease Precision</p>
            <div className="mini-progress"><motion.div initial={{width:0}} animate={{width:'89.61%'}} transition={{duration:1.5}} className="bar heart"/></div>
          </div>
        </motion.section>

        {/* Methodology Section */}
        <motion.section variants={itemVars} className="methodology-box">
          <h2>Our Methodology</h2>
          <div className="method-steps">
            <div className="step">
              <div className="step-num">01</div>
              <h4>Dual-Random Forest Ensemble</h4>
              <p>We utilize an ensemble of 200 Decision Trees to process 15 unique clinical markers, ensuring robust predictions that outperform single-model architectures.</p>
            </div>
             

{/* [Image of Random Forest architecture] */}

            <div className="step">
              <div className="step-num">02</div>
              <h4>Z-Score Standardization</h4>
              <p>Patient vitals are normalized using standard scaling to ensure features like BMI and Blood Pressure are weighted with scientific precision.</p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h4>Probabilistic Inference</h4>
              <p>Unlike binary systems, Pulse calculates a 0-100% risk spectrum, providing a nuanced view of patient wellness rather than a simple yes/no.</p>
            </div>
          </div>
        </motion.section>

        {/* Technical Footer */}
        
      </motion.div>
    </div>
  );
};

