import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { sendFreeTestResults } from '../utils/formSubmission';
import {
  buildTestResultPayload,
  hasCompleteTestResults,
} from '../utils/testResults';

function HasilTestKecemasanPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const kecemasanParam = params.get('kecemasan');
  const depresiParam = params.get('depresi');
  const stressParam = params.get('stress');
  const hasResults = hasCompleteTestResults({
    kecemasan: kecemasanParam,
    depresi: depresiParam,
    stress: stressParam,
  });
  const resultSummary = buildTestResultPayload({
    kecemasan: kecemasanParam,
    depresi: depresiParam,
    stress: stressParam,
  });
  const { sourceLabel } = resultSummary;
  const [resultFormValues, setResultFormValues] = useState({
    name: '',
    email: '',
  });
  const [isSendingResult, setIsSendingResult] = useState(false);
  const [hasUnlockedResults, setHasUnlockedResults] = useState(false);
  const [resultFormStatus, setResultFormStatus] = useState({ type: '', message: '' });

  const handleResultFormChange = (event) => {
    const { name, value } = event.target;
    setResultFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleResultFormSubmit = async (event) => {
    event.preventDefault();
    setIsSendingResult(true);
    setResultFormStatus({ type: '', message: '' });

    try {
      const payload = await sendFreeTestResults({
        name: resultFormValues.name,
        email: resultFormValues.email,
        kecemasan: kecemasanParam,
        depresi: depresiParam,
        stress: stressParam,
      });

      setHasUnlockedResults(true);
      setResultFormStatus({
        type: 'success',
        message: payload.message || 'Hasil tes sudah dikirim ke email Anda.',
      });
    } catch (error) {
      setResultFormStatus({
        type: 'error',
        message: error.message || 'Terjadi kesalahan saat mengirim hasil tes.',
      });
    } finally {
      setIsSendingResult(false);
    }
  };

  return (
    <div className="simple-page hasil-test-page">
      <header
        className="tre-about-hero testimonial-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/tes.jpg)`,
        }}
      >
        <NavBar className="nav-mobile-surface-light" />
        <div className="tre-about-hero-inner">
          <div className="tre-about-hero-copy">
            <h1>{sourceLabel}</h1>
          </div>
        </div>
      </header>

      <section className="hasil-test-section">
        <div className="hasil-test-container">
          {!hasResults ? (
            <article className="hasil-summary-card hasil-result-gate">
              <h2>Hasil Tes Tidak Ditemukan</h2>
              <p className="hasil-summary-copy">
                Selesaikan tes terlebih dahulu agar kami bisa menampilkan dan
                mengirim hasilnya ke email Anda.
              </p>
              <div className="hasil-test-actions">
                <Link
                  className="hasil-test-btn primary"
                  to="/tes-kecemasan-berlebih-anxiety"
                >
                  Mulai Tes Kecemasan
                </Link>
                <Link className="hasil-test-btn secondary" to="/tes-kesehatan-mental">
                  Mulai Tes Kesehatan Mental
                </Link>
              </div>
            </article>
          ) : null}

          {hasResults && !hasUnlockedResults ? (
            <section className="hasil-form-wrap hasil-result-gate">
              <div className="hasil-result-gate-copy">
                <h2>Kirim Hasil Tes ke Email Anda</h2>
                <p>
                  Masukkan nama dan email Anda. Setelah itu, hasil {sourceLabel.toLowerCase()}
                  {' '}akan kami kirim ke inbox Anda dan detail hasilnya akan
                  tampil di halaman ini.
                </p>
              </div>
              <form className="hasil-form" onSubmit={handleResultFormSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Nama Lengkap"
                  value={resultFormValues.name}
                  onChange={handleResultFormChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Aktif"
                  value={resultFormValues.email}
                  onChange={handleResultFormChange}
                  required
                />
                {resultFormStatus.message ? (
                  <div
                    className={`form-status${resultFormStatus.type ? ` is-${resultFormStatus.type}` : ''}`}
                    role="status"
                  >
                    {resultFormStatus.message}
                  </div>
                ) : null}
                <button type="submit" disabled={isSendingResult}>
                  {isSendingResult ? 'Mengirim...' : 'Kirim Hasil Tes'}
                </button>
              </form>
            </section>
          ) : null}

          {hasResults && hasUnlockedResults ? (
            <>
              <article className="hasil-summary-card hasil-email-confirmation">
                <h2>Hasil Tes Sudah Dikirim</h2>
                <p className="hasil-summary-subtitle">
                  Cek email Anda untuk melihat hasil lengkap {sourceLabel.toLowerCase()}.
                </p>
                {resultFormStatus.message ? (
                  <div
                    className={`form-status hasil-result-status${resultFormStatus.type ? ` is-${resultFormStatus.type}` : ''}`}
                    role="status"
                  >
                    {resultFormStatus.message}
                  </div>
                ) : null}
                <div className="hasil-disclaimer">
                  <h3>Disclaimer:</h3>
                  <p>
                    Hasil tes ini bukan merupakan diagnosis medis. Jika Anda perlu
                    penilaian lebih dalam, silakan hubungi tenaga profesional
                    kesehatan mental.
                  </p>
                </div>
              </article>

              <div className="hasil-test-actions">
                <Link className="hasil-test-btn primary" to="/tes-kecemasan-berlebih-anxiety">
                  Ulangi Tes
                </Link>
                <Link className="hasil-test-btn secondary" to="/tes-gratis">
                  Kembali ke Tes Gratis
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section
        className="cta-section cta-northlights hasil-book-cta"
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

export default HasilTestKecemasanPage;
