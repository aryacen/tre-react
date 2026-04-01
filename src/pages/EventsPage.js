import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { pastEvents, upcomingEvent } from '../data/eventsData';

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

function EventCard({ event, featured = false, status, to }) {
  const cardContent = (
    <>
      <div
        className="events-card-media"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}${event.image})`,
          backgroundPosition: event.imagePosition || 'center',
          backgroundSize: event.imageSize || 'cover',
        }}
        aria-label={event.title}
        role="img"
      >
        <div className="events-card-badges">
          {status ? <span className="events-card-badge events-card-badge-muted">{status}</span> : null}
          <span className="events-card-badge">{event.attendees}</span>
        </div>
      </div>
      <div className="events-card-body">
        <h3>{event.title}</h3>
        <div className="events-card-meta">
          <div className="events-card-meta-item">
            <EventMetaIcon type="date" />
            <span>{event.date}</span>
          </div>
          <div className="events-card-meta-item">
            <EventMetaIcon type="time" />
            <span>{event.time}</span>
          </div>
          <div className="events-card-meta-item">
            <EventMetaIcon type="location" />
            <span>{event.location}</span>
          </div>
        </div>
        <p>{event.description}</p>
        <span className="events-card-action">
          Lihat detail
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </>
  );

  if (to) {
    return (
      <Link className={`events-card events-card-link${featured ? ' is-featured' : ''}`} to={to}>
        {cardContent}
      </Link>
    );
  }

  return (
    <article className={`events-card${featured ? ' is-featured' : ''}`}>
      {cardContent}
    </article>
  );
}

function EventsPage() {
  return (
    <div className="testimonial-page events-page">
      <div className="events-page-nav">
        <NavBar className="nav-surface-light" logoSrc="/assets/brand/tre-logo-red.png" />
      </div>

      <section className="tre-about-section events-section">
        <div className="tre-about-container">
          <div className="events-section-heading">
            <span className="events-section-bar" aria-hidden="true" />
            <h2>Acara Mendatang</h2>
          </div>
          <div className="events-featured-grid">
            <EventCard event={upcomingEvent} featured to={`/events/${upcomingEvent.slug}`} />
          </div>
        </div>
      </section>

      <section className="tre-about-section events-section events-section-past">
        <div className="tre-about-container">
          <div className="events-section-heading">
            <span className="events-section-bar is-soft" aria-hidden="true" />
            <h2>Acara Sebelumnya</h2>
          </div>
          <div className="events-grid">
            {pastEvents.map((event) => (
              <EventCard
                event={event}
                status="Acara selesai"
                key={event.slug}
                to={`/events/${event.slug}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventsPage;
