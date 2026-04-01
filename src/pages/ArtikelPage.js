import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { articleItems, articleTopics } from '../data/articleData';

function ArtikelPage() {
  const [activeTopic, setActiveTopic] = useState('Semua');

  const filteredArticles = useMemo(() => {
    if (activeTopic === 'Semua') {
      return articleItems;
    }
    return articleItems.filter((item) => item.topic === activeTopic);
  }, [activeTopic]);

  return (
    <div
      className="testimonial-page artikel-page"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/artikel2.jpg)`,
      }}
    >
      <header
        className="tre-about-hero testimonial-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/artikel.jpg)`,
        }}
      >
        <NavBar className="nav-mobile-surface-light" />
        <div className="tre-about-hero-inner">
          <div className="tre-about-hero-copy">
            <h1>Artikel</h1>
          </div>
        </div>
      </header>

      <section className="artikel-library">
        <div className="artikel-library-inner">
          <div className="testimonial-library-heading">
            <h2>Wawasan dan Tips Seputar Kesehatan Mental</h2>
          </div>

          <div className="testimonial-filters" role="tablist" aria-label="Filter topik artikel">
            {articleTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                className={`testimonial-filter${
                  activeTopic === topic ? ' is-active' : ''
                }`}
                onClick={() => setActiveTopic(topic)}
                role="tab"
                aria-selected={activeTopic === topic}
              >
                {topic}
              </button>
            ))}
          </div>

          <div className="testimonial-library-grid">
            {filteredArticles.map((article) => (
              <Link
                className="testimonial-library-card artikel-library-card-link"
                key={article.id}
                to={`/artikel/${article.slug}`}
                aria-label={`Baca artikel ${article.title}`}
              >
                <div className="testimonial-library-card-video">
                  <div className="artikel-image-frame">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/home/${article.image}`}
                      alt={article.title}
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="testimonial-library-card-body">
                  <span className="artikel-card-topic">{article.topic}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <span className="testimonial-library-card-action">
                    <span>Baca Selengkapnya</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="cta-section cta-northlights"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/artikel.gif)`,
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

export default ArtikelPage;
