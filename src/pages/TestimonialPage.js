import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { testimonialVideos } from '../data/testimonialData';

function TestimonialPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const categories = useMemo(() => {
    const unique = new Set();
    testimonialVideos.forEach((video) => {
      video.categories.forEach((category) => unique.add(category));
    });
    return ['Semua', ...Array.from(unique)];
  }, []);
  const filteredVideos = useMemo(() => {
    if (activeCategory === 'Semua') return testimonialVideos;
    return testimonialVideos.filter((video) =>
      video.categories.includes(activeCategory)
    );
  }, [activeCategory]);

  return (
    <div className="testimonial-page testimonial-list-page">
      <header
        className="tre-about-hero testimonial-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/testimony.jpg)`,
        }}
      >
        <NavBar />
        <div className="tre-about-hero-inner">
          <div className="tre-about-hero-copy">
            <h1>Testimonial</h1>
          </div>
        </div>
      </header>

      <section className="testimonial-content">
        <div className="testimonial-container">
          <div className="testimonial-text">
            <h1>Apa Kata Mereka Tentang TRE</h1>
          </div>
          <div className="testimonial-video">
            <YouTubeEmbed
              className="intro-video"
              videoId="YwmzcMNvLfI"
              title="Testimonial TRE"
            />
          </div>
        </div>
      </section>

      <section className="testimonial-library">
        <div className="testimonial-library-inner">
          <div className="testimonial-library-heading">
            <h2>Kisah Transformatif Peserta</h2>
          </div>
          <div className="testimonial-filters" role="tablist" aria-label="Filter kategori testimonial">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`testimonial-filter${
                  activeCategory === category ? ' is-active' : ''
                }`}
                onClick={() => setActiveCategory(category)}
                role="tab"
                aria-selected={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="testimonial-library-grid">
            {filteredVideos.map((video) => (
              <article className="testimonial-library-card" key={video.videoId}>
                <div className="testimonial-library-card-video">
                  <YouTubeEmbed
                    videoId={video.videoId}
                    title={video.title}
                  />
                </div>
                <div className="testimonial-library-card-body">
                  <div className="testimonial-library-card-meta">
                    <span className="testimonial-library-card-name">{video.name}</span>
                    <span className="testimonial-library-card-role">{video.occupation}</span>
                  </div>
                  <h3>{video.title}</h3>
                  <p>{video.body}</p>
                  <div className="testimonial-library-card-tags">
                    {video.categories.map((category) => (
                      <span className="testimonial-library-card-tag" key={category}>
                        {category}
                      </span>
                    ))}
                  </div>
                  <Link
                    className="testimonial-library-card-action"
                    to={`/testimonial/${video.slug}`}
                  >
                    <span>Baca Selengkapnya</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="cta-section cta-northlights"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/northlights.gif)`,
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

export default TestimonialPage;
