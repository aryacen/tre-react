import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { findEventBySlug } from '../data/eventsData';
import { buildWhatsAppLink } from '../utils/whatsapp';

const normalizeEventMedia = (event) => {
  if (event?.media?.length) {
    return event.media.map((item) =>
      typeof item === 'string' ? { type: 'image', src: item } : item
    );
  }

  if (event?.gallery?.length) {
    return event.gallery.map((src) => ({ type: 'image', src }));
  }

  if (event?.image) {
    return [{ type: 'image', src: event.image }];
  }

  return [];
};

function EventMetaIcon({ type }) {
  if (type === 'date') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="3"
          ry="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 3.5v4M16 3.5v4M3 9.5h18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === 'time') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 7.5v5l3.5 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 21s6-5.5 6-10.2A6 6 0 0 0 6 10.8C6 15.5 12 21 12 21Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.5" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EventDetailPage() {
  const { slug } = useParams();
  const event = findEventBySlug(slug);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryMedia = normalizeEventMedia(event);
  const activeMedia = galleryMedia[activeIndex];
  const showCta = event?.showCta !== false;
  const shareText = event?.title || 'Event TRE';
  const registerLink = event?.whatsappMessage
    ? buildWhatsAppLink(event.whatsappMessage)
    : `${process.env.PUBLIC_URL}${event?.registerUrl || ''}`;

  useEffect(() => {
    setActiveIndex(0);
    setIsViewerOpen(false);
  }, [slug]);

  useEffect(() => {
    if (galleryMedia.length <= 1 && !isViewerOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsViewerOpen(false);
        return;
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) =>
          current === 0 ? galleryMedia.length - 1 : current - 1
        );
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) =>
          current === galleryMedia.length - 1 ? 0 : current + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [galleryMedia.length, isViewerOpen]);

  useEffect(() => {
    document.body.classList.toggle('events-lightbox-open', isViewerOpen);

    return () => {
      document.body.classList.remove('events-lightbox-open');
    };
  }, [isViewerOpen]);

  const showPrevImage = () => {
    setActiveIndex((current) =>
      current === 0 ? galleryMedia.length - 1 : current - 1
    );
  };

  const showNextImage = () => {
    setActiveIndex((current) =>
      current === galleryMedia.length - 1 ? 0 : current + 1
    );
  };

  const openViewerAt = (index) => {
    setActiveIndex(index);
    setIsViewerOpen(true);
  };

  if (!event) {
    return (
      <div className="events-detail-page">
        <div className="events-detail-nav-wrap">
          <NavBar className="nav-surface-light" logoSrc="/assets/brand/tre-logo-red.png" />
        </div>
        <section className="events-detail-shell">
          <div className="events-detail-topbar">
            <Link className="events-back-link" to="/events">
              Kembali ke Events
            </Link>
          </div>
          <div className="events-detail-missing">
            <h1>Event tidak ditemukan</h1>
            <p>Halaman event yang Anda cari belum tersedia.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="events-detail-page">
      <div className="events-detail-nav-wrap">
        <NavBar className="nav-surface-light" logoSrc="/assets/brand/tre-logo-red.png" />
      </div>

      <section className="events-detail-shell">
        <div className="events-detail-topbar">
          <Link className="events-back-link" to="/events">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M14.5 5.5 8 12l6.5 6.5M8.5 12H20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back to Events</span>
          </Link>
        </div>

        <div className="events-detail-header">
          <div className="events-detail-header-copy">
            <h1>{event.title}</h1>
            <div className="events-detail-meta-row">
              <div className="events-detail-meta-chip">
                <EventMetaIcon type="date" />
                <span>{event.date}</span>
              </div>
              <div className="events-detail-meta-chip">
                <EventMetaIcon type="time" />
                <span>{event.time}</span>
              </div>
              <div className="events-detail-meta-chip">
                <EventMetaIcon type="location" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {showCta ? (
            <a
              className="events-detail-register"
              href={registerLink}
              target="_blank"
              rel="noreferrer"
            >
              {event.ctaLabel || 'Register Now'}
            </a>
          ) : null}
        </div>

        <div className="events-detail-hero-image">
          {galleryMedia.length > 1 ? (
            <button
              className="events-detail-nav-button is-prev"
              type="button"
              aria-label="Gambar sebelumnya"
              onClick={showPrevImage}
            >
              <span aria-hidden="true">&lt;</span>
            </button>
          ) : null}
          {activeMedia?.type === 'video' ? (
            <div className="events-detail-image-stage is-static">
              <video
                src={`${process.env.PUBLIC_URL}${activeMedia.src}`}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${event.title} video ${activeIndex + 1} dari ${galleryMedia.length}`}
              />
            </div>
          ) : (
            <button
              className="events-detail-image-stage"
              type="button"
              aria-label={`Perbesar gambar ${activeIndex + 1} dari ${galleryMedia.length}`}
              onClick={() => openViewerAt(activeIndex)}
            >
              <img
                src={`${process.env.PUBLIC_URL}${activeMedia?.src}`}
                alt={event.title}
              />
            </button>
          )}
          {galleryMedia.length > 1 ? (
            <button
              className="events-detail-nav-button is-next"
              type="button"
              aria-label="Gambar berikutnya"
              onClick={showNextImage}
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          ) : null}
        </div>

        <div className="events-detail-gallery">
          {galleryMedia.map((media, index) => (
            <button
              className={`events-detail-thumb${activeIndex === index ? ' is-active' : ''}`}
              type="button"
              key={`${media.type}-${media.src}`}
              onClick={() => setActiveIndex(index)}
              aria-label={
                media.type === 'video'
                  ? `Pilih video ${index + 1}`
                  : `Pilih gambar ${index + 1}`
              }
            >
              {media.type === 'video' ? (
                <video
                  src={`${process.env.PUBLIC_URL}${media.src}`}
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              ) : (
                <img src={`${process.env.PUBLIC_URL}${media.src}`} alt={event.title} />
              )}
            </button>
          ))}
        </div>

        <div className="events-detail-layout">
          <article className="events-detail-copy">
            <h2>About This Event</h2>
            {event.about.map((paragraph) => (
              <p
                key={paragraph}
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </article>

          <aside className="events-detail-sidebar">
            <div className="events-detail-panel">
              <h3>Event Details</h3>
              <dl className="events-detail-list">
                <div>
                  <dt>Date</dt>
                  <dd>{event.date}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{event.time}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{event.location}</dd>
                </div>
              </dl>
              {showCta ? (
                <a
                  className="events-detail-cta"
                  href={registerLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {event.ctaLabel || 'Register Now'}
                </a>
              ) : null}
            </div>

            <div className="events-detail-panel">
              <h3>Share Event</h3>
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
          </aside>
        </div>
      </section>

      {isViewerOpen ? (
        <div
          className="events-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri ${event.title}`}
          onClick={() => setIsViewerOpen(false)}
        >
          <button
            className="events-lightbox-close"
            type="button"
            aria-label="Tutup galeri"
            onClick={() => setIsViewerOpen(false)}
          >
            ×
          </button>
          {galleryMedia.length > 1 ? (
            <button
              className="events-lightbox-nav is-prev"
              type="button"
              aria-label="Gambar sebelumnya"
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
                showPrevImage();
              }}
            >
              <span aria-hidden="true">&lt;</span>
            </button>
          ) : null}
          <div
            className="events-lightbox-frame"
            onClick={(clickEvent) => clickEvent.stopPropagation()}
          >
            {activeMedia?.type === 'video' ? (
              <video
                src={`${process.env.PUBLIC_URL}${activeMedia.src}`}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={`${process.env.PUBLIC_URL}${activeMedia?.src}`}
                alt={`${event.title} ${activeIndex + 1}`}
              />
            )}
          </div>
          {galleryMedia.length > 1 ? (
            <button
              className="events-lightbox-nav is-next"
              type="button"
              aria-label="Gambar berikutnya"
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
                showNextImage();
              }}
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          ) : null}
          <div className="events-lightbox-counter" aria-live="polite">
            {activeIndex + 1} / {galleryMedia.length}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default EventDetailPage;
