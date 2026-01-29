// import React, { useState } from "react";

// import { api } from '../Api/api'; // adjust path if needed
// import { useNavigate } from "react-router-dom";

// const Register = () => {

//     const navigate=useNavigate()
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [status, setStatus] = useState({
//     message: "",
//     type: "", // success | error
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus({ message: "", type: "" });

//     // 🔍 Frontend validation
//     if (!formData.email.includes("@")) {
//       setStatus({
//         message: "Please enter a valid email address.",
//         type: "error",
//       });
//       return;
//     }

//     if (formData.password.length < 6) {
//       setStatus({
//         message: "Password must be at least 6 characters long.",
//         type: "error",
//       });
//       return;
//     }

//     try {
//       const response = await api.post("/register", formData);
//       console.log(response)

//       setStatus({
//         message: "Registration successful! You can now log in.",
//         type: "success",
//       });

//       setFormData({ email: "", password: "" });

//       setTimeout(()=>{
//         navigate("/")
//       },2000)

//     } catch (error) {
//       let errorMessage = "Registration failed. Try again.";

//       if (error.response?.data?.detail) {
//         errorMessage = error.response.data.detail;
//       }

//       setStatus({
//         message: errorMessage,
//         type: "error",
//       });
//     }
//   };

//   return (
//     <div className="register-container">
//       <div className="register-card">
//         <h2>PulseHealth<div className="logo-icon">♥</div> Registration</h2>
//         <p className="subtitle">
//           Create your account to access AI-based health predictions
//         </p>

//         {/* 🔔 Status Message */}
//         {status.message && (
//           <div className={`status-box ${status.type}`}>
//             {status.message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="example@email.com"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Minimum 6 characters"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="register-btn">
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import { api } from '../Api/api'; 
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  
  // 1. Added confirmPassword to state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "", 
  });

  const [status, setStatus] = useState({
    message: "",
    type: "", 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    // 🔍 Frontend validation
    if (!formData.email.includes("@")) {
      setStatus({ message: "Please enter a valid email address.", type: "error" });
      return;
    }

    if (formData.password.length < 6) {
      setStatus({ message: "Password must be at least 6 characters long.", type: "error" });
      return;
    }

    // 2. Added Matching Logic
    if (formData.password !== formData.confirmPassword) {
      setStatus({ message: "Passwords do not match!", type: "error" });
      return;
    }

    try {
      // We send only email and password to the backend
      const response = await api.post("/register", {
        email: formData.email,
        password: formData.password
      });
      
      console.log(response);

      setStatus({
        message: "Registration successful! You can now log in.",
        type: "success",
      });

      setFormData({ email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      let errorMessage = "Registration failed. Try again.";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      setStatus({ message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2><span className="footer-heart">❤️</span><span className="pulse-color">Pulse</span>Health  Registration</h2>
        <p className="subtitle">
          Create your account to access AI-based health predictions
        </p>

        {status.message && (
          <div className={`status-box ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* 3. New Confirm Password Input Field */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
