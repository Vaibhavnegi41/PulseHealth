import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine, RiLogoutCircleRLine } from 'react-icons/ri';

const Header = () => {

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('pulseToken');

  /* Header scroll shadow */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Logout */
  const handleLogout = () => {
    localStorage.removeItem('pulseToken');
    setMenuOpen(false);
    navigate('/');
    alert("Successfully logout!");
  };

  return (
    <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">

        {/* Logo */}
        <Link to="/" className="logo">
          <span className="footer-heart">❤️</span>
          <span className="logo-text">
            Pulse<span className="light">Health</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </button>

        {/* Navigation */}
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>

          {/* Links */}
          <div className="nav-links-group">

            <NavLink to="/" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Home
            </NavLink>

            <NavLink to="/prediction" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Prediction
            </NavLink>

            <NavLink to="/history" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              History
            </NavLink>

            <NavLink to="/contact" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Contact
            </NavLink>

            <NavLink to="/about" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              About
            </NavLink>

          </div>

          {/* Right Actions */}
          <div className="header-actions">

            {/* Auth Buttons */}
            <div className="auth-buttons">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="btn-logout">
                  <RiLogoutCircleRLine />
                </button>
              ) : (
                <>
                  <NavLink to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn-login-text">
                    Login
                  </NavLink>

                  <Link to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="btn-register">
                    Register
                  </Link>
                </>
              )}
            </div>

          </div>

        </nav>

      </div>
    </header>
  );
};

export default Header;
