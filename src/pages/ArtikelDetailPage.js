import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { findArticleBySlug } from '../data/articleData';

const createAnchorId = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const buildHeadingAnchorMap = (content = []) => {
  const map = new Map();
  const used = new Map();

  content.forEach((block) => {
    if (!block || typeof block !== 'object' || block.type !== 'heading' || !block.text) {
      return;
    }

    const baseId = createAnchorId(block.text);
    if (!baseId) {
      return;
    }

    const nextCount = (used.get(baseId) || 0) + 1;
    used.set(baseId, nextCount);
    const finalId = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;

    map.set(baseId, finalId);
  });

  return map;
};

const handleTocClick = (event, targetId) => {
  event.preventDefault();
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
  window.history.replaceState(null, '', `#${targetId}`);
};

function ArtikelDetailPage() {
  const { slug } = useParams();
  const article = findArticleBySlug(slug);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = article ? article.title : 'Artikel TRE';
  const headingAnchorMap = article ? buildHeadingAnchorMap(article.content) : new Map();

  if (!article) {
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
          <NavBar />
          <div className="tre-about-hero-inner">
            <div className="tre-about-hero-copy">
              <h1>Artikel Tidak Ditemukan</h1>
            </div>
          </div>
        </header>

        <section className="artikel-detail-section">
          <div className="artikel-detail-layout">
            <p>Artikel yang Anda cari tidak tersedia.</p>
            <Link className="testimonial-library-card-action" to="/artikel">
              <span>Kembali ke halaman artikel</span>
            </Link>
          </div>
        </section>
      </div>
    );
  }

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
        <NavBar />
        <div className="tre-about-hero-inner">
          <div className="tre-about-hero-copy">
            <h1>Artikel</h1>
          </div>
        </div>
      </header>

      <section className="artikel-detail-section">
        <div className="artikel-detail-layout">
          <div className="artikel-detail-meta">
            <span className="artikel-card-topic">{article.topic}</span>
            <h2>{article.title}</h2>
            <div className="artikel-detail-meta-row">
              <span>
                Ditulis oleh : <strong>{article.author || 'treindonesia'}</strong>
              </span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="artikel-detail-media">
            <div className="artikel-image-frame artikel-detail-image-frame">
              <img
                src={`${process.env.PUBLIC_URL}/assets/home/${article.image}`}
                alt={article.title}
              />
            </div>
          </div>

          <article className="testimonial-detail-content artikel-detail-content">
            {Array.isArray(article.tableOfContents) && article.tableOfContents.length > 0 && (
              <div className="artikel-detail-toc">
                <h3>Daftar Isi</h3>
                <ol>
                  {article.tableOfContents.map((item) => (
                    <li key={item}>
                      <a
                        href={`#${headingAnchorMap.get(createAnchorId(item)) || createAnchorId(item)}`}
                        onClick={(event) =>
                          handleTocClick(
                            event,
                            headingAnchorMap.get(createAnchorId(item)) || createAnchorId(item)
                          )
                        }
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <p>{article.excerpt}</p>
            {article.content.map((block, index) => {
              if (typeof block === 'string') {
                return <p key={`${index}-${block.slice(0, 32)}`}>{block}</p>;
              }

              if (!block || typeof block !== 'object') {
                return null;
              }

              if (block.type === 'heading') {
                const headingId = headingAnchorMap.get(createAnchorId(block.text)) || createAnchorId(block.text);
                return (
                  <h3 id={headingId} key={`${index}-${block.text}`}>
                    {block.text}
                  </h3>
                );
              }

              if (block.type === 'quote') {
                if (block.html) {
                  return (
                    <blockquote
                      key={`${index}-${block.html.slice(0, 30)}`}
                      dangerouslySetInnerHTML={{ __html: block.html }}
                    />
                  );
                }
                return <blockquote key={`${index}-${block.text}`}>{block.text}</blockquote>;
              }

              if (block.type === 'list' && Array.isArray(block.items)) {
                return (
                  <ul className="artikel-detail-list" key={`${index}-list`}>
                    {block.items.map((item) => {
                      if (typeof item === 'string') {
                        return <li key={item}>{item}</li>;
                      }

                      if (item && typeof item === 'object' && item.html) {
                        return (
                          <li
                            key={item.html}
                            dangerouslySetInnerHTML={{ __html: item.html }}
                          />
                        );
                      }

                      return null;
                    })}
                  </ul>
                );
              }

              if (block.type === 'ordered-list' && Array.isArray(block.items)) {
                return (
                  <ol className="artikel-detail-ordered-list" key={`${index}-ordered-list`}>
                    {block.items.map((item) => {
                      if (typeof item === 'string') {
                        return <li key={item}>{item}</li>;
                      }

                      if (item && typeof item === 'object' && item.html) {
                        return (
                          <li
                            key={item.html}
                            dangerouslySetInnerHTML={{ __html: item.html }}
                          />
                        );
                      }

                      return null;
                    })}
                  </ol>
                );
              }

              if (block.html) {
                return (
                  <p
                    key={`${index}-${block.html.slice(0, 30)}`}
                    dangerouslySetInnerHTML={{ __html: block.html }}
                  />
                );
              }

              return <p key={`${index}-${block.text || 'paragraph'}`}>{block.text}</p>;
            })}
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

          <Link className="testimonial-library-card-action" to="/artikel">
            <span>Kembali ke daftar artikel</span>
          </Link>
        </div>
      </section>

      <section
        className="cta-section cta-northlights"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/TRE1.webp)`,
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

export default ArtikelDetailPage;
