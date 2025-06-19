const FooterComponent = () => {
  return (
    <footer className="footer-modern">
      <div className="footer-modern-main">
        <div className="footer-modern-col brand-col">
          <h1 className="footer-brand"> NOVA WEAR</h1>
          <p className="footer-desc">
            NOVA WEAR is a factory brand producer that makes the world's highest quality knit fabrics and apparel.
          </p>
          <div className="footer-social">
            <span className="footer-social-title">Social</span>
            <a href="#">Instagram</a>
          </div>
        </div>
        <div className="footer-modern-col info-col">
          <span className="footer-info-title">Information</span>
          <a href="#">Size Guide</a>
          <a href="#">FAQ</a>
          <a href="#">Wholesale</a>
          <a href="#">Contact</a>
          <a href="#">Shipping & Returns</a>
        </div>
        <div className="footer-modern-col newsletter-col">
          <div className="footer-newsletter-title">
            Join our newsletter to stay up to date on features and releases.
          </div>
          <form className="footer-newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
          <div className="footer-newsletter-terms">
            <input type="checkbox" id="newsletter-terms" />
            <label htmlFor="newsletter-terms">
              I have read and accept the <a href="#">terms and conditions</a>.
            </label>
          </div>
        </div>
      </div>
      <hr className="footer-modern-divider" />
      <div className="footer-modern-bottom">
        <span className="footer-copyright">© 2025 House Of Blanks. All Rights Reserved</span>
        <div className="footer-bottom-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
