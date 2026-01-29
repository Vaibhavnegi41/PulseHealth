
import { motion } from 'framer-motion';
import { Activity, Brain, ShieldCheck, Heart, Thermometer } from 'lucide-react';
import { NavLink } from 'react-router-dom';
// import './HealthHome.css';

export const Home = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const cards = [
    {
      title: "Heart Disease Analysis",
      icon: <Heart className="icon-heart" />,
      description: "Using SVM and Random Forest to detect cardiovascular risks with up to 88% accuracy.",
      tags: ["89.61% Reliability", "RandomForestClassifier"]
    },
    {
      title: "Diabetes Prediction",
      icon: <Activity className="icon-diabetes" />,
      description: "Analyzing vital patterns and BMI metrics via Random Forest for early-stage health risk detection.",
      tags: ["80.5% Accuracy", "RandomForestClassifier"]
    },
    {
      title: "AI Methodology",
      icon: <Brain className="icon-ai" />,
      description: "PulseHealth leverages a Dual-Random Forest AI Ensemble to evaluate 15 clinical vitals, providing real-time probabilistic risk assessments and personalized wellness scores..",
      tags: ["Predictive Analytics", "Real-time"]
    }
  ];

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <motion.span className="badge" {...fadeIn}>Next-Gen AI Healthcare</motion.span>
          <motion.h1 {...fadeIn} transition={{ delay: 0.2 }}>
            Predicting Health with <span className="gradient-text">AI Intelligence</span>
          </motion.h1>
          <motion.p {...fadeIn} className="empowering" transition={{ delay: 0.4 }}>
            Empowering early detection of Heart Disease and Diabetes through advanced Machine Learning techniques.
          </motion.p>
          <motion.p {...fadeIn} className="empowering" transition={{ delay: 0.4 }}>
            Predicting tomorrow’s health risks today using advanced Machine Learning models.
          </motion.p>
          <motion.div className="cta-group" {...fadeIn} transition={{ delay: 0.6 }}>
            <NavLink to="/prediction"><button className="btn-primary">Start Prediction</button></NavLink>
            <NavLink to="https://www.kaggle.com/learn"><button className="btn-secondary">Learn AI Models</button></NavLink>
          </motion.div>
        </div>
      </motion.section>

      {/* Bento Grid Section */}
      <section className="features-grid">
        {cards.map((card, index) => (
          <motion.div 
            key={index}
            className="feature-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="card-header">
              {card.icon}
              <h3>{card.title}</h3>
            </div>
            <p>{card.description}</p>
            <div className="card-tags">
              {card.tags.map(tag => <span key={tag}>{tag}</span>)}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <motion.section 
        className="stats-banner"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="stat-item">
          <h2>89.61%</h2>
          <p>Heart Disease Accuracy</p>
        </div>
        <div className="stat-item">
          <h2>80.5%</h2>
          <p>Diabetes Accuracy</p>
        </div>
        <div className="stat-item">
          <h2>1k+</h2>
          <p>Data Records</p>
        </div>
        <div className="stat-item">
          <h2>Real-time</h2>
          <p>Cloud Processing</p>
        </div>
      </motion.section>
    </div>
  );
};
