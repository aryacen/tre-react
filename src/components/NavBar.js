import { NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `nav-link${isActive ? ' active' : ''}`;

const dropdownLinkClass = ({ isActive }) =>
  `dropdown-link${isActive ? ' active' : ''}`;

function NavBar() {
  return (
    <nav className="nav">
      <NavLink className="brand" to="/">
        <img src="/assets/brand/tre-logo-white.png" alt="TRE Indonesia" />
      </NavLink>
      <div className="nav-links">
        <div className="nav-item">
          <NavLink className={navLinkClass} to="/">
            Beranda
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink className={navLinkClass} to="/apa-itu-tre">
            Apa itu TRE
          </NavLink>
        </div>
        <div className="nav-item dropdown">
          <NavLink className={navLinkClass} to="/belajar-tre">
            Belajar TRE
            <span className="caret" aria-hidden="true">
              <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
                <path
                  d="M5 7.5l5 5 5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </NavLink>
          <div className="dropdown-menu">
            <NavLink className={dropdownLinkClass} to="/tre-individuals">
              TRE Individuals
            </NavLink>
            <NavLink className={dropdownLinkClass} to="/tre-online">
              TRE Online Di Rumah Aja
            </NavLink>
          </div>
        </div>
        <div className="nav-item">
          <NavLink className={navLinkClass} to="/faq">
            FAQ
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink className={navLinkClass} to="/testimonial">
            Testimonial
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink className={navLinkClass} to="/artikel">
            Artikel
          </NavLink>
        </div>
        <div className="nav-item dropdown">
          <button className="nav-link dropdown-trigger" type="button">
            Tes Gratis
            <span className="caret" aria-hidden="true">
              <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
                <path
                  d="M5 7.5l5 5 5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <div className="dropdown-menu">
            <NavLink className={dropdownLinkClass} to="/tes-kesehatan-mental">
              Tes Kesehatan Mental
            </NavLink>
            <NavLink
              className={dropdownLinkClass}
              to="/tes-kecemasan-berlebih-anxiety"
            >
              Tes Kecemasan Berlebih (Anxiety)
            </NavLink>
          </div>
        </div>
        <div className="nav-item">
          <NavLink className={navLinkClass} to="/kontak">
            Kontak
          </NavLink>
        </div>
      </div>
      <div className="nav-right">
        <div className="lang-toggle">
          <button
            className="nav-link lang-flag"
            type="button"
            aria-label="Bahasa Indonesia"
            title="Bahasa Indonesia"
          >
            <svg viewBox="0 0 24 16" aria-hidden="true" focusable="false">
              <rect width="24" height="8" fill="#e31d1c" />
              <rect y="8" width="24" height="8" fill="#ffffff" />
            </svg>
          </button>
          <button
            className="nav-link lang-flag"
            type="button"
            aria-label="English"
            title="English"
          >
            <svg viewBox="0 0 24 16" aria-hidden="true" focusable="false">
              <rect width="24" height="16" fill="#0a2e73" />
              <path
                d="M0 0h3l21 12v4h-3L0 4zM24 0h-3L0 12v4h3l21-12z"
                fill="#ffffff"
                opacity="0.9"
              />
              <path
                d="M0 0h2l22 12v4h-2L0 4zM24 0h-2L0 12v4h2l22-12z"
                fill="#c8102e"
              />
              <rect x="10" width="4" height="16" fill="#ffffff" />
              <rect y="6" width="24" height="4" fill="#ffffff" />
              <rect x="10.7" width="2.6" height="16" fill="#c8102e" />
              <rect y="6.7" width="24" height="2.6" fill="#c8102e" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
