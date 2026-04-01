import { useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { findTestimonialBySlug, testimonialVideos } from '../data/testimonialData';

function TestimonialDetailPage() {
  const { slug } = useParams();
  const relatedTrackRef = useRef(null);
  const testimonial = findTestimonialBySlug(slug);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = testimonial
    ? `${testimonial.name} - ${testimonial.title}`
    : 'Testimonial TRE';

  const primaryCategory = testimonial?.categories?.[0];
  const relatedTestimonials = useMemo(() => {
    if (!testimonial || !primaryCategory) {
      return [];
    }
    return testimonialVideos.filter(
      (item) =>
        item.slug !== testimonial.slug &&
        item.categories.includes(primaryCategory)
    );
  }, [testimonial, primaryCategory]);

  const transcriptParagraphs =
    testimonial?.transcript?.length > 0
      ? testimonial.transcript
      : testimonial
        ? [testimonial.body]
        : [];

  const scrollRelated = (direction) => {
    const track = relatedTrackRef.current;
    if (!track) {
      return;
    }
    const firstCard = track.querySelector('.testimonial-related-card');
    if (!firstCard) {
      return;
    }
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || 0);
    const step = firstCard.getBoundingClientRect().width + gap;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  if (!testimonial) {
    return (
      <div className="testimonial-page">
        <header
          className="tre-about-hero testimonial-hero"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/testimony.jpg)`,
          }}
        >
          <NavBar />
          <div className="tre-about-hero-inner">
            <div className="tre-about-hero-copy">
              <h1>Testimonial Tidak Ditemukan</h1>
            </div>
          </div>
        </header>
        <section className="testimonial-detail-section">
          <div className="testimonial-detail-layout">
            <p>Testimonial yang Anda cari tidak tersedia.</p>
            <Link className="testimonial-library-card-action" to="/testimonial">
              <span>Kembali ke halaman testimonial</span>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="testimonial-page">
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

      <section className="testimonial-detail-section">
        <div className="testimonial-detail-layout">
          <div className="testimonial-detail-video">
            <YouTubeEmbed
              className="testimonial-detail-video-frame"
              videoId={testimonial.videoId}
              title={`Testimonial ${testimonial.name}`}
            />
          </div>

          <div className="testimonial-detail-meta">
            <h2>{testimonial.name}</h2>
            <p>{testimonial.occupation}</p>
            <div className="testimonial-library-card-tags">
              {testimonial.categories.map((category) => (
                <span className="testimonial-library-card-tag" key={category}>
                  {category}
                </span>
              ))}
            </div>
          </div>

          <article className="testimonial-detail-content">
            {transcriptParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <div className="testimonial-share-row">
            <span className="testimonial-share-label">Share</span>
            <a
              className="testimonial-share-icon"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                pageUrl
              )}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share ke Facebook"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              className="testimonial-share-icon"
              href={`https://wa.me/?text=${encodeURIComponent(
                `${shareText} ${pageUrl}`
              )}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share ke WhatsApp"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M20.5 11.8c0 4.7-3.8 8.5-8.5 8.5-1.5 0-2.8-.4-4-1l-4 1 1.1-3.8a8.4 8.4 0 0 1-1.4-4.7c0-4.7 3.8-8.5 8.5-8.5s8.3 3.8 8.3 8.5zm-8.5-7c-3.8 0-6.9 3.1-6.9 7 0 1.4.4 2.7 1.1 3.8l-.7 2.4 2.5-.7a6.9 6.9 0 0 0 3.9 1.2c3.8 0 6.9-3.1 6.9-7s-3.1-6.7-6.8-6.7zm3.8 9c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1-.1.2-.6.7-.7.8-.1.1-.2.2-.4.1-.2-.1-1-.4-1.8-1.1-.7-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3 0-.1 0-.2 0-.3s-.5-1.2-.7-1.6c-.2-.4-.3-.3-.5-.3h-.4c-.1 0-.3.1-.4.2-.1.2-.6.6-.6 1.5s.6 1.8.7 2c.1.1 1.3 2 3.2 2.8.4.2.8.3 1.1.4.5.2.9.2 1.2.1.4-.1 1.3-.5 1.4-1 .2-.4.2-.8.1-.9 0-.2-.2-.2-.4-.3z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              className="testimonial-share-icon"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                pageUrl
              )}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share ke LinkedIn"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M6.5 8.5a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6zM5 10h3v9H5v-9zm5 0h2.8v1.3h.1c.4-.7 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V19h-3v-3.9c0-.9 0-2.1-1.3-2.1-1.3 0-1.5 1-1.5 2V19h-3v-9z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="testimonial-related">
        <div className="testimonial-related-inner">
          <div className="testimonial-related-header">
            <h2>Topik terkait</h2>
            <p>{primaryCategory}</p>
          </div>

          <div className="testimonial-related-carousel">
            <button
              className="schedule-nav testimonial-related-nav"
              type="button"
              aria-label="Sebelumnya"
              onClick={() => scrollRelated(-1)}
            >
              &lt;
            </button>
            <div className="testimonial-related-track" ref={relatedTrackRef}>
              {relatedTestimonials.map((item) => (
                <article
                  className="testimonial-library-card testimonial-related-card"
                  key={item.slug}
                >
                  <div className="testimonial-library-card-video">
                    <YouTubeEmbed videoId={item.videoId} title={item.title} />
                  </div>
                  <div className="testimonial-library-card-body">
                    <div className="testimonial-library-card-meta">
                      <span className="testimonial-library-card-name">
                        {item.name}
                      </span>
                      <span className="testimonial-library-card-role">
                        {item.occupation}
                      </span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    <Link
                      className="testimonial-library-card-action"
                      to={`/testimonial/${item.slug}`}
                    >
                      <span>Baca Selengkapnya</span>
                    </Link>
                  </div>
                </article>
              ))}
              {relatedTestimonials.length === 0 && (
                <p className="testimonial-related-empty">
                  Belum ada testimonial lain di kategori ini.
                </p>
              )}
            </div>
            <button
              className="schedule-nav testimonial-related-nav"
              type="button"
              aria-label="Berikutnya"
              onClick={() => scrollRelated(1)}
            >
              &gt;
            </button>
          </div>

          <Link
            className="btn btn-accent btn-link testimonial-related-all-btn"
            to="/testimonial"
          >
            Semua testimonial
          </Link>
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

export default TestimonialDetailPage;
