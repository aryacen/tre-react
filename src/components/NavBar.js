import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `nav-link${isActive ? ' active' : ''}`;

const dropdownLinkClass = ({ isActive }) =>
  `dropdown-link${isActive ? ' active' : ''}`;

function NavBar({
  className = '',
  logoSrc = '/assets/brand/tre-logo-white.png',
}) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({
    belajar: false,
    tesGratis: false,
  });
  const navShellRef = useRef(null);
  const navToggleRef = useRef(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdowns({
      belajar: false,
      tesGratis: false,
    });
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', isMenuOpen);

    return () => {
      document.body.classList.remove('nav-menu-open');
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      const shell = navShellRef.current;
      const toggle = navToggleRef.current;
      const target = event.target;

      if (shell?.contains(target) || toggle?.contains(target)) {
        return;
      }

      setIsMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleToggleClick = () => {
    if (isMenuOpen) {
      closeMenu();
      return;
    }

    setIsMenuOpen(true);
  };

  const handleHomeClick = (event) => {
    if (location.pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    closeMenu();
  };

  const handleKontakClick = () => {
    const kontakSection = document.getElementById('footer-kontak');

    if (kontakSection) {
      kontakSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    closeMenu();
  };

  const handleDropdownTrigger = (event, key) => {
    if (window.innerWidth > 760) {
      return;
    }

    event.preventDefault();
    setOpenDropdowns((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <nav
      className={`nav${className ? ` ${className}` : ''}${isMenuOpen ? ' is-mobile-open' : ''}`}
    >
      <Link className="brand" to="/" onClick={handleHomeClick}>
        <img src={logoSrc} alt="TRE Indonesia" />
      </Link>
      <button
        className="nav-toggle"
        type="button"
        ref={navToggleRef}
        aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        aria-expanded={isMenuOpen}
        onClick={handleToggleClick}
      >
        <span />
        <span />
        <span />
      </button>
      <div
        className={`nav-mobile-backdrop${isMenuOpen ? ' is-open' : ''}`}
        aria-hidden="true"
        onClick={() => closeMenu()}
      />
      <div
        className={`nav-shell${isMenuOpen ? ' is-open' : ''}`}
        ref={navShellRef}
      >
        <div className="nav-drawer-brand">
          <Link className="brand" to="/" onClick={handleHomeClick}>
            <img src={logoSrc} alt="TRE Indonesia" />
          </Link>
        </div>
        <div className="nav-links">
          <div className="nav-item">
            <NavLink className={navLinkClass} to="/apa-itu-tre" onClick={() => closeMenu()}>
              Apa itu TRE
            </NavLink>
          </div>
          <div className={`nav-item dropdown${openDropdowns.belajar ? ' is-open' : ''}`}>
            <NavLink
              className={navLinkClass}
              to="/belajar-tre"
              aria-expanded={openDropdowns.belajar}
              onClick={(event) => handleDropdownTrigger(event, 'belajar')}
            >
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
              <NavLink className={dropdownLinkClass} to="/tre-individuals" onClick={() => closeMenu()}>
                TRE Individuals
              </NavLink>
              <NavLink className={dropdownLinkClass} to="/tre-online" onClick={() => closeMenu()}>
                TRE Online Di Rumah Aja
              </NavLink>
              <NavLink
                className={dropdownLinkClass}
                to="/kelas-sertifikasi-tre-provider"
                onClick={() => closeMenu()}
              >
                Kelas Sertifikasi TRE Provider
              </NavLink>
            </div>
          </div>
          <div className="nav-item">
            <NavLink className={navLinkClass} to="/faq" onClick={() => closeMenu()}>
              FAQ
            </NavLink>
          </div>
          <div className="nav-item">
            <NavLink className={navLinkClass} to="/testimonial" onClick={() => closeMenu()}>
              Testimonial
            </NavLink>
          </div>
          <div className="nav-item">
            <NavLink className={navLinkClass} to="/artikel" onClick={() => closeMenu()}>
              Artikel
            </NavLink>
          </div>
          <div className="nav-item">
            <NavLink className={navLinkClass} to="/events" onClick={() => closeMenu()}>
              Events
            </NavLink>
          </div>
          <div className={`nav-item dropdown${openDropdowns.tesGratis ? ' is-open' : ''}`}>
            <NavLink
              className={navLinkClass}
              to="/tes-gratis"
              aria-expanded={openDropdowns.tesGratis}
              onClick={(event) => handleDropdownTrigger(event, 'tesGratis')}
            >
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
            </NavLink>
            <div className="dropdown-menu">
              <NavLink className={dropdownLinkClass} to="/tes-kesehatan-mental" onClick={() => closeMenu()}>
                Tes Kesehatan Mental
              </NavLink>
              <NavLink
                className={dropdownLinkClass}
                to="/tes-kecemasan-berlebih-anxiety"
                onClick={() => closeMenu()}
              >
                Tes Kecemasan Berlebih (Anxiety)
              </NavLink>
            </div>
          </div>
          <div className="nav-item nav-contact-trigger">
            <button className="nav-link" type="button" onClick={handleKontakClick}>
              Kontak
            </button>
          </div>
        </div>
        <div className="nav-right">
          {isMenuOpen ? (
            <div className="nav-contact-block">
              <div className="nav-contact-group">
                <span className="nav-contact-label">Alamat TRE Indonesia</span>
                <a
                  className="nav-contact-link"
                  href="https://maps.app.goo.gl/HX3tVAp7z6Up8d8Q6"
                  target="_blank"
                  rel="noreferrer"
                >
                  Jl. Danau Sunter Utara No.2-3 Blok B1B, RT.1/RW.10, Sunter Agung,
                  Tanjung Priok, North Jakarta City, Jakarta 14350
                </a>
              </div>
              <div className="nav-contact-group">
                <span className="nav-contact-label">Nomor Telepon</span>
                <a className="nav-contact-link nav-contact-phone" href="tel:0818901789">
                  0818-901-789
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
