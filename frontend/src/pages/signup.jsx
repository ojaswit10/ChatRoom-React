import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";
import axios from "axios";

function Signup({ setUser }) {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:7000/user/signup", formData);
      if (res.status === 201) {
        setUser(res.data.user); // ✅ update user state in App
        navigate("/chat");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Create Account</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit">Sign Up</button>
        {message && <p style={{ color: "red" }}>{message}</p>}
      </form>
    </div>
  );
}

export default Signup;
