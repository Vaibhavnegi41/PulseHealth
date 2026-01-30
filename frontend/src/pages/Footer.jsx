import React from 'react';

const Footer = () => {
  return (
    <footer className="simple-footer">
      <div className="footer-content">
        <p>
          Designed & Built by 
          <a 
            href="https://github.com/your-username" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
          >
            @Vaibhav_Negi
          </a> 
          with <span className="footer-heart">❤️</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;