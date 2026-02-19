import { useEffect, useState } from 'react';

function YouTubeEmbed({ videoId, title, className }) {
  const [isActive, setIsActive] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  );
  const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  useEffect(() => {
    const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const img = new Image();
    img.onload = () => setThumbnailUrl(maxResUrl);
    img.onerror = () => setThumbnailUrl(fallbackUrl);
    img.src = maxResUrl;
  }, [videoId]);

  return (
    <div className={`video-embed ${className || ''}`}>
      {isActive ? (
        <iframe
          src={iframeSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className="video-poster"
          type="button"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
          aria-label={`Putar video: ${title}`}
          onClick={() => setIsActive(true)}
        >
          <span className="video-play" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default YouTubeEmbed;
