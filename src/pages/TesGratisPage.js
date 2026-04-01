import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const tesGratisCards = [
  {
    title: 'Tes Kecemasan',
    image: '/assets/home/test.jpg',
    imageAlt: 'Tes Kecemasan',
    to: '/tes-kecemasan-berlebih-anxiety',
  },
  {
    title: 'Tes Kesehatan Mental',
    image: '/assets/home/self-healing.jpg',
    imageAlt: 'Tes Kesehatan Mental',
    to: '/tes-kesehatan-mental',
  },
];

function TesGratisPage() {
  return (
    <div className="belajar-tre-page tes-gratis-page">
      <header
        className="belajar-tre-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/tes.jpg)`,
        }}
      >
        <NavBar />
        <div className="belajar-tre-hero-inner">
          <h1>Tes Gratis</h1>
        </div>
      </header>

      <section className="belajar-tre-services tes-gratis-services">
        <div className="belajar-tre-container">
          <div className="belajar-tre-grid">
            {tesGratisCards.map((card) => (
              <Link className="tes-gratis-card-link-wrap" to={card.to} key={card.title}>
                <article className="belajar-tre-card">
                  <div
                    className="belajar-tre-card-media"
                    style={{
                      backgroundImage: `url(${process.env.PUBLIC_URL}${card.image})`,
                    }}
                    role="img"
                    aria-label={card.imageAlt}
                  />
                  <div className="belajar-tre-card-body">
                    <h3>{card.title}</h3>
                    <span>Ambil Tes</span>
                    <button type="button" aria-label={`Buka ${card.title}`}>
                      →
                    </button>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default TesGratisPage;
