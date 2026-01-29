import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios'; // Ensure axios is installed: npm install axios
import { api } from '../Api/api';
import { useNavigate } from 'react-router-dom';

export const Contact = () => {
  const [ratings, setRatings] = useState({ accuracy: 0, easeOfUse: 0, design: 0 });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()

  const isLoggedIn = !!localStorage.getItem('pulseToken');

  const handleStarClick = (question, value) => {
    setRatings({ ...ratings, [question]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!isLoggedIn){
      alert("Firstly please login in with your credentials !")
      navigate("/login")
    }
    else{
          setLoading(true);

          const payload = {
            accuracy: ratings.accuracy,
            easyToUse: ratings.easeOfUse,
            rating: ratings.design, 
            suggestions: feedback,
          };

          try {
            const response = await api.post('/feedback', payload);
            
            if (response.status === 200 || response.status === 201) {
              alert("Thank you for your valuable feedback!");
              // Reset form after successful save
              setRatings({ accuracy: 0, easeOfUse: 0, design: 0 });
              setFeedback("");
            }
          } 
          catch (error) {
            console.error("Error saving feedback:", error);
            alert("Something went wrong. Please try again later.");
          } 
          finally {
            setLoading(false);
          }
    }
  };

  const StarRating = ({ label, category }) => (
    <div className="star-field">
      <label>{label}</label>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={ratings[category] >= star ? "star active" : "star"}
            onClick={() => handleStarClick(category, star)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="app-viewport-feedback">
      <div className="sky-bg">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
      </div>

      <motion.div 
        className="glass-card contact-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <header className="card-header">
          <h1>User <span className="bold">Feedback</span></h1>
          <p>Help us improve our AI Health Prediction system</p>
        </header>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="rating-section">
            <StarRating label="How accurate were the AI predictions?" category="accuracy" />
            <StarRating label="How easy was it to use the dashboard?" category="easeOfUse" />
            <StarRating label="How would you rate the overall design?" category="design" />
          </div>

          <div className="form-group">
            <label className="section-label">Your Message & Suggestions</label>
            <textarea 
              rows="4" 
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="analyze-btn" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};