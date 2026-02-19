import NavBar from '../components/NavBar';

function BelajarTrePage() {
  return (
    <div className="belajar-tre-page">
      <header
        className="belajar-tre-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/belajartre.jpg)`,
        }}
      >
        <NavBar />
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
                <button type="button" aria-label="Buka TRE For Individuals">
                  →
                </button>
              </div>
            </article>
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
                <button type="button" aria-label="Buka TRE Online di Rumah Aja">
                  →
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BelajarTrePage;
