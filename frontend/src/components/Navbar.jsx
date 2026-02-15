import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/navbar.css";

function Navbar({ user, setUser }) {  // ✅ Accept props from App.js
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  console.log("🔍 Navbar received user prop:", user); // ADD THIS

  // ✅ Fetch logged-in user on mount (in case of page refresh)
  useEffect(() => {
    // Only fetch if we don't already have user data
    if (!user) {
      axios
        .get("http://localhost:7000/user/me", { withCredentials: true })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  },); // Keep empty dependency array - only run on mount


  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await axios.get("http://localhost:7000/user/logout", {
      withCredentials: true,
    });
    setUser(null);  // ✅ Update App.js state
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Chatroom</h1>
      <div className="navbar-links">
        {!user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <div className="user-dropdown" ref={dropdownRef}>
            <span
              className="user-name"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {user.fullName} ⬇
            </span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Sign Out</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;