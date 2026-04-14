import { useState } from 'react';
import { buildWhatsAppLink } from '../utils/whatsapp';

function WhatsAppWidget() {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const whatsappMessage =
    'Halo, saya ingin mengetahui informasi lebih lanjut seputar acara seminar yang TRE Indonesia tawarkan.';
  const whatsappLink = buildWhatsAppLink(whatsappMessage);

  return (
    <div className="wa-widget">
      <div className={`wa-panel${isWhatsAppOpen ? ' open' : ''}`}>
        <div className="wa-panel-header">
          <div className="wa-title">
            <span className="wa-title-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" focusable="false">
                <path
                  fill="currentColor"
                  d="M16.04 0C7.17 0 .01 7.16.01 16c0 2.82.74 5.55 2.15 7.95L0 32l8.23-2.12c2.3 1.26 4.9 1.92 7.55 1.92h.01c8.86 0 16.04-7.16 16.04-16S24.9 0 16.04 0zm0 29.3c-2.34 0-4.64-.63-6.65-1.82l-.48-.29-4.9 1.27 1.3-4.77-.31-.49A13.23 13.23 0 0 1 2.8 16c0-7.29 5.94-13.22 13.24-13.22S29.28 8.71 29.28 16 23.34 29.3 16.04 29.3zm7.4-9.93c-.4-.2-2.36-1.16-2.72-1.29-.36-.13-.63-.2-.89.2-.26.4-1.03 1.29-1.26 1.56-.23.26-.46.3-.86.1-.4-.2-1.68-.62-3.2-1.98-1.18-1.05-1.98-2.36-2.2-2.76-.23-.4-.02-.62.18-.82.18-.18.4-.46.6-.69.2-.23.26-.4.4-.66.13-.26.06-.5-.03-.7-.1-.2-.89-2.15-1.22-2.94-.32-.77-.64-.66-.89-.66h-.76c-.26 0-.69.1-1.05.5-.36.4-1.38 1.35-1.38 3.29 0 1.94 1.41 3.82 1.61 4.09.2.26 2.77 4.23 6.7 5.93.94.4 1.67.64 2.24.82.94.3 1.8.26 2.48.16.76-.11 2.36-.96 2.69-1.89.33-.92.33-1.7.23-1.89-.1-.19-.36-.3-.76-.5z"
                />
              </svg>
            </span>
            WhatsApp
          </div>
          <button
            className="wa-close"
            type="button"
            aria-label="Tutup WhatsApp"
            onClick={() => setIsWhatsAppOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="wa-panel-body">
          <p>
            Jika Anda membutuhkan informasi lebih lanjut seputar acara seminar
            yang kami tawarkan, silahkan hubungi kami dengan klik tombol di
            bawah ini!
          </p>
          <a
            className="wa-cta"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            Open chat
          </a>
        </div>
      </div>
      <button
        className={isWhatsAppOpen ? 'wa-fab hidden' : 'wa-fab'}
        type="button"
        aria-label="Buka WhatsApp chat"
        aria-expanded={isWhatsAppOpen}
        onClick={(event) => {
          event.preventDefault();
          setIsWhatsAppOpen((prev) => !prev);
        }}
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M16.04 0C7.17 0 .01 7.16.01 16c0 2.82.74 5.55 2.15 7.95L0 32l8.23-2.12c2.3 1.26 4.9 1.92 7.55 1.92h.01c8.86 0 16.04-7.16 16.04-16S24.9 0 16.04 0zm0 29.3c-2.34 0-4.64-.63-6.65-1.82l-.48-.29-4.9 1.27 1.3-4.77-.31-.49A13.23 13.23 0 0 1 2.8 16c0-7.29 5.94-13.22 13.24-13.22S29.28 8.71 29.28 16 23.34 29.3 16.04 29.3zm7.4-9.93c-.4-.2-2.36-1.16-2.72-1.29-.36-.13-.63-.2-.89.2-.26.4-1.03 1.29-1.26 1.56-.23.26-.46.3-.86.1-.4-.2-1.68-.62-3.2-1.98-1.18-1.05-1.98-2.36-2.2-2.76-.23-.4-.02-.62.18-.82.18-.18.4-.46.6-.69.2-.23.26-.4.4-.66.13-.26.06-.5-.03-.7-.1-.2-.89-2.15-1.22-2.94-.32-.77-.64-.66-.89-.66h-.76c-.26 0-.69.1-1.05.5-.36.4-1.38 1.35-1.38 3.29 0 1.94 1.41 3.82 1.61 4.09.2.26 2.77 4.23 6.7 5.93.94.4 1.67.64 2.24.82.94.3 1.8.26 2.48.16.76-.11 2.36-.96 2.69-1.89.33-.92.33-1.7.23-1.89-.1-.19-.36-.3-.76-.5z"
          />
        </svg>
      </button>
    </div>
  );
}

export default WhatsAppWidget;
