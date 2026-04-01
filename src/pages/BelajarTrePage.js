import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

function BelajarTrePage() {
  return (
    <div className="belajar-tre-page belajar-tre-landing-page">
      <header
        className="belajar-tre-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/belajartre.jpg)`,
        }}
      >
        <NavBar className="nav-mobile-surface-light" />
        <div className="belajar-tre-hero-inner">
          <h1>Belajar TRE</h1>
        </div>
      </header>

      <section className="belajar-tre-services">
        <div className="belajar-tre-container">
          <p className="belajar-tre-intro">
            Pendekatan berbasis tubuh (somatik) yang dapat dipelajari dan
            digunakan kapan pun Anda butuhkan sepanjang hidup. Dengan TRE, Anda
            memiliki alat yang kuat untuk terus mendukung kesehatan mental dan
            fisik Anda secara berkelanjutan.
          </p>
          <div className="belajar-tre-grid">
            <Link className="belajar-tre-card-link" to="/tre-individuals" aria-label="Buka TRE For Individuals">
              <article className="belajar-tre-card">
                <div
                  className="belajar-tre-card-media"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/TRE.jpg)`,
                  }}
                  role="img"
                  aria-label="TRE For Individuals"
                />
                <div className="belajar-tre-card-body">
                  <h3>TRE For Individuals</h3>
                  <span>Selengkapnya</span>
                </div>
              </article>
            </Link>
            <Link className="belajar-tre-card-link" to="/tre-online" aria-label="Buka TRE Online di Rumah Aja">
              <article className="belajar-tre-card">
                <div
                  className="belajar-tre-card-media"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/online.jpg)`,
                  }}
                  role="img"
                  aria-label="TRE Online di Rumah Aja"
                />
                <div className="belajar-tre-card-body">
                  <h3>TRE Online di Rumah Aja</h3>
                  <span>Selengkapnya</span>
                </div>
              </article>
            </Link>
            <Link
              className="belajar-tre-card-link"
              to="/kelas-sertifikasi-tre-provider"
              aria-label="Buka Kelas Sertifikasi TRE Provider"
            >
              <article className="belajar-tre-card">
                <div
                  className="belajar-tre-card-media"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/certificate.png)`,
                  }}
                  role="img"
                  aria-label="Kelas Sertifikasi TRE Provider"
                />
                <div className="belajar-tre-card-body">
                  <h3>Kelas Sertifikasi TRE Provider</h3>
                  <span>Selengkapnya</span>
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BelajarTrePage;
