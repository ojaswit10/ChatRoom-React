import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";
import axios from "axios";

function Signin({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const res = await axios.post("http://localhost:7000/user/signin", formData, { withCredentials: true });
    console.log("✅ Signin response:", res.data); // ADD THIS
    console.log("✅ User data:", res.data.user); // ADD THIS
    if (res.status === 200) {
      setUser(res.data.user);
      console.log("✅ Called setUser with:", res.data.user); // ADD THIS
      navigate("/chat");
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.error || "Signin failed");
  }
};

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Signin;
