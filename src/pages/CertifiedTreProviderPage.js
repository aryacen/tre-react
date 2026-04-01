import NavBar from '../components/NavBar';
import { certifiedTreProviders } from '../data/treProviderData';

function CertifiedTreProviderPage() {
  return (
    <div
      className="testimonial-page certified-provider-page"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/white-bg.jpg)`,
      }}
    >
      <header
        className="tre-about-hero testimonial-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/certified.jpg)`,
        }}
      >
        <NavBar />
        <div className="tre-about-hero-inner">
          <div className="tre-about-hero-copy">
            <h1 className="certified-hero-title">Certified TRE Provider</h1>
          </div>
        </div>
      </header>

      <section className="certified-provider-section">
        <div className="certified-provider-grid">
          {certifiedTreProviders.map((provider) => (
            <article className="certified-provider-card" key={provider.name}>
              <img
                src={`${process.env.PUBLIC_URL}/assets/home/${provider.image}`}
                alt={provider.name}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = `${process.env.PUBLIC_URL}/assets/home/${provider.fallbackImage}`;
                }}
              />
              <div className="certified-provider-card-body">
                <h3>{provider.name}</h3>
                <p className="certified-provider-role">{provider.role}</p>
                {provider.details.map((detail) => (
                  <p key={detail} className="certified-provider-detail">
                    {detail}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="cta-section cta-northlights"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/cityview.gif)`,
        }}
      >
        <div className="cta-content">
          <p>Temukan Layanan TRE yang Sesuai untuk Anda</p>
          <h>
            Jelajahi berbagai pilihan layanan yang dirancang untuk memenuhi
            kebutuhan dan kondisi Anda dengan fleksibel.
          </h>
          <a className="cta-button" href="/belajar-tre">
            Lihat layanan seminar
          </a>
        </div>
      </section>
    </div>
  );
}

export default CertifiedTreProviderPage;
