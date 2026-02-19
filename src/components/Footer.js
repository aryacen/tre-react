import { NavLink } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Akses Cepat</h3>
            <ul className="footer-links">
              <li>
                <NavLink to="/apa-itu-tre">Tentang TRE Indonesia</NavLink>
              </li>
              <li>
                <NavLink to="/certified-tre-provider">Certified TRE Provider</NavLink>
              </li>
              <li>
                <span>FAQs</span>
              </li>
              <li>
                <span>Kelas Sertifikasi TRE Provider</span>
              </li>
              <li>
                <span>Shaka Foundation</span>
              </li>
              <li>
                <NavLink to="/artikel">Artikel</NavLink>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Belajar TRE</h3>
            <ul className="footer-links">
              <li>
                <NavLink to="/tre-individuals">TRE For Individuals</NavLink>
              </li>
              <li>
                <NavLink to="/tre-online">TRE Online di Rumah Aja</NavLink>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Kontak</h3>
            <div className="footer-contact">
              <p>
                Jl. Danau Sunter Utara No.2-3 Blok B1B, RT.1/RW.10, Sunter
                Agung, Tanjung Priok, North Jakarta City, Jakarta 14350
              </p>
              <p>0818-901-789</p>
            </div>
          </div>
          <div className="footer-col">
            <h3>Temukan Kami</h3>
            <div className="footer-social">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    ry="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect
                    x="3"
                    y="6"
                    width="18"
                    height="12"
                    rx="3"
                    ry="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M11 10l4 2-4 2z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>
          <div className="footer-bottom">
          <div className="footer-legal">
            <NavLink to="/kebijakan-privasi">Kebijakan Privasi</NavLink>
            <NavLink to="/ketentuan-layanan">Ketentuan Layanan</NavLink>
          </div>
          <div className="footer-copy">© 2026 TRE Indonesia</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
