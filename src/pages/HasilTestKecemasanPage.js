import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import {
  sendFreeTestResults,
  submitSupportForm,
} from '../utils/formSubmission';
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
  const { sourceLabel, kecemasanData, depresiData, stressData } = resultSummary;
  const [resultFormValues, setResultFormValues] = useState({
    name: '',
    email: '',
  });
  const [isSendingResult, setIsSendingResult] = useState(false);
  const [hasUnlockedResults, setHasUnlockedResults] = useState(false);
  const [resultFormStatus, setResultFormStatus] = useState({ type: '', message: '' });
  const [formValues, setFormValues] = useState({
    name: '',
    whatsapp: '',
    email: '',
    domicile: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  const handleResultFormChange = (event) => {
    const { name, value } = event.target;
    setResultFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      await submitSupportForm({
        formType: 'waiting-list-hasil-test',
        subject: 'Waiting List Seminar dari Hasil Tes Gratis TRE Indonesia',
        replyTo: formValues.email,
        fields: [
          { label: 'Nama Lengkap', value: formValues.name },
          { label: 'Whatsapp', value: formValues.whatsapp },
          { label: 'Email Aktif', value: formValues.email },
          { label: 'Kota Domisili', value: formValues.domicile },
          {
            label: 'Sumber Form',
            value: `Hasil ${sourceLabel}`,
          },
          {
            label: 'Hasil Kecemasan',
            value: kecemasanData.level,
          },
          ...(depresiData
            ? [{ label: 'Hasil Depresi', value: depresiData.level }]
            : []),
          ...(stressData
            ? [{ label: 'Hasil Stres', value: stressData.level }]
            : []),
        ],
      });

      setFormValues({
        name: '',
        whatsapp: '',
        email: '',
        domicile: '',
      });
      setFormStatus({
        type: 'success',
        message: 'Data Anda sudah terkirim. Tim TRE Indonesia akan menghubungi Anda segera.',
      });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Terjadi kesalahan saat mengirim form.',
      });
    } finally {
      setIsSubmitting(false);
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

              <section className="hasil-good-news">
                <div className="hasil-good-news-copy">
                  <h3>Kabar Baiknya..</h3>
                  <h4>
                    TRE Hadir Sebagai <span className="text-red">Solusi</span>
                  </h4>
                  <p>
                    Sebuah teknik pemulihan Stress dan Trauma yang ditemukan oleh
                    Dr. David Berceli, seorang ahli Psychotherapy dan Therapeutic
                    dari Amerika Serikat dan dibawa <strong>pertama kali ke Indonesia oleh
                    Hindra Gunawan sejak tahun 2013.</strong>
                  </p>
                  <p>
                    Teknik yang telah tersebar di 90+ negara ini terbukti sangat
                    efektif, mudah diaplikasikan dan bisa dilakukan kapan saja,
                    sambil nonton, baca buku bahkan sambil bekerja.
                  </p>
                </div>
                <figure className="hasil-good-news-figure">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/home/hindradavid.png`}
                    alt="Hindra Gunawan dan Dr. David Berceli"
                  />
                  <figcaption>Hindra Gunawan &amp; Dr. David Berceli</figcaption>
                </figure>
              </section>

              <section className="hasil-stats">
                <p className="hasil-stats-intro">
                  Selama lebih dari 12 tahun menyebarkan teknik TRE di Indonesia,
                  kami telah
                </p>
                <div className="hasil-stats-grid">
                  <div>
                    <p>mengadakan</p>
                    <strong>1,500+</strong>
                    <span>Pelatihan Online &amp; Offline</span>
                  </div>
                  <div>
                    <p>Kepada lebih dari</p>
                    <strong>30,000+</strong>
                    <span>Orang di Indonesia</span>
                  </div>
                  <div>
                    <p>di</p>
                    <strong>42</strong>
                    <span>Kota</span>
                  </div>
                </div>
                <p className="hasil-stats-intro">
                  Jika Anda tertarik untuk ikut mempelajari teknik TRE bersama TRE
                  Indonesia, dan agar bisa dapat promo spesialnya: segera daftarkan
                  data diri Anda di form waiting list di bawah ini
                </p>
                <div className="hasil-double-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M6 7l6 6 6-6" />
                    <path d="M6 13l6 6 6-6" />
                  </svg>
                </div>
              </section>

              <section className="hasil-form-wrap">
                <form className="hasil-form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama Lengkap"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="whatsapp"
                    placeholder="Whatsapp"
                    value={formValues.whatsapp}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Aktif"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="domicile"
                    placeholder="Kota Domisili"
                    value={formValues.domicile}
                    onChange={handleChange}
                    required
                  />
                  {formStatus.message ? (
                    <div
                      className={`form-status${formStatus.type ? ` is-${formStatus.type}` : ''}`}
                      role="status"
                    >
                      {formStatus.message}
                    </div>
                  ) : null}
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Mengirim...' : 'Saya Daftar Waiting List Seminar'}
                  </button>
                </form>
              </section>

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
