import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { findEventBySlug } from '../data/eventsData';

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

  if (type === 'attendees') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M8.5 11.5a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm7 0a2.5 2.5 0 1 0-2.5-2.5 2.5 2.5 0 0 0 2.5 2.5ZM3.5 19a5 5 0 0 1 10 0M13.5 19a4 4 0 0 1 7 0"
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
  const [copyLabel, setCopyLabel] = useState('Copy Link');
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const galleryImages =
    event?.gallery?.length > 0 ? event.gallery : event?.image ? [event.image] : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [slug]);

  useEffect(() => {
    if (galleryImages.length <= 1) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) =>
          current === 0 ? galleryImages.length - 1 : current - 1
        );
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) =>
          current === galleryImages.length - 1 ? 0 : current + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [galleryImages.length]);

  const showPrevImage = () => {
    setActiveIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1
    );
  };

  const showNextImage = () => {
    setActiveIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1
    );
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

  const handleCopyLink = async () => {
    if (!pageUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopyLabel('Link Disalin');
      window.setTimeout(() => setCopyLabel('Copy Link'), 1800);
    } catch {
      setCopyLabel('Gagal Menyalin');
      window.setTimeout(() => setCopyLabel('Copy Link'), 1800);
    }
  };

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
              <div className="events-detail-meta-chip">
                <EventMetaIcon type="attendees" />
                <span>{event.attendeesDetail}</span>
              </div>
            </div>
          </div>

          <a
            className="events-detail-register"
            href={`${process.env.PUBLIC_URL}${event.registerUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            {event.ctaLabel || 'Register Now'}
          </a>
        </div>

        <div className="events-detail-hero-image">
          {galleryImages.length > 1 ? (
            <button
              className="events-detail-nav-button is-prev"
              type="button"
              aria-label="Gambar sebelumnya"
              onClick={showPrevImage}
            >
              <span aria-hidden="true">&lt;</span>
            </button>
          ) : null}
          <img
            src={`${process.env.PUBLIC_URL}${galleryImages[activeIndex]}`}
            alt={event.title}
          />
          {galleryImages.length > 1 ? (
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
          {galleryImages.map((image, index) => (
            <button
              className={`events-detail-thumb${activeIndex === index ? ' is-active' : ''}`}
              type="button"
              key={image}
              onClick={() => setActiveIndex(index)}
            >
              <img src={`${process.env.PUBLIC_URL}${image}`} alt={event.title} />
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
                <div>
                  <dt>Attendees</dt>
                  <dd>{event.attendeesDetail}</dd>
                </div>
              </dl>
              <a
                className="events-detail-cta"
                href={`${process.env.PUBLIC_URL}${event.registerUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                {event.ctaLabel || 'Register Now'}
              </a>
            </div>

            <div className="events-detail-panel">
              <h3>Share Event</h3>
              <button className="events-detail-copy-btn" type="button" onClick={handleCopyLink}>
                {copyLabel}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default EventDetailPage;
