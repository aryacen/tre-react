import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { submitSupportForm } from '../utils/formSubmission';

const kategoriKecemasan = (nilai) => {
  if (nilai === 'Severe Anxiety') {
    return {
      level: 'Sangat Tinggi',
      color: '#d32f2f',
      desc: 'Hasil ini menunjukkan kecemasan yang sudah berdampak luas pada fungsi harian Anda. Gejalanya kuat, berulang, konstan dan menguras energi. Konsultasi segera sangat dianjurkan',
    };
  }
  if (nilai === 'Moderate Anxiety') {
    return {
      level: 'Berat',
      color: '#ff7043',
      desc: 'Temuan ini menunjukkan kecemasan Anda mulai berdampak pada fokus, aktivitas, atau emosi harian. Gejalanya signifikan, meski belum konstan. Mulailah cari bantuan untuk mencegah kondisi memburuk.',
    };
  }
  if (nilai === 'Mild Anxiety') {
    return {
      level: 'Sedang',
      color: '#ffca28',
      desc: 'Hasil ini menunjukkan kecemasan mulai mengganggu kenyamanan. Gejalanya kadang muncul, tapi masih mudah dikelola. Mempelajari kesehatan mental diri bisa jadi cara untuk pengelolaan emosi lebih baik.',
    };
  }
  return {
    level: 'Rendah',
    color: '#4db6ac',
    desc: 'Hasil ini menunjukkan tingkat kecemasan Anda rendah dan tidak berdampak signifikan pada aktivitas sehari-hari. Tetap perhatikan perubahan emosional untuk menjaga keseimbangan mental Anda.',
  };
};

const skalaDASS = (nilai) => {
  const angka = parseInt(nilai, 10);
  if (Number.isNaN(angka)) {
    return {
      level: 'Rendah',
      color: '#4db6ac',
      desc: 'Data tidak tersedia, tetapi kecemasan berada dalam batas normal.',
    };
  }
  if (angka <= 9) {
    return {
      level: 'Rendah',
      color: '#4db6ac',
      desc: 'Anda berada dalam batas normal. Tidak ada indikasi signifikan, namun tetap penting untuk menjaga keseimbangan emosional dan mental.',
    };
  }
  if (angka <= 13) {
    return {
      level: 'Sedang',
      color: '#ffca28',
      desc: 'Anda berada dalam tingkat wajar. Mungkin ada sesekali perasaan tidak nyaman atau cemas, tetapi masih dalam kendali. Mengembangkan kebiasaan sehat dapat membantu menjaga keseimbangan.',
    };
  }
  if (angka <= 20) {
    return {
      level: 'Tinggi',
      color: '#ff7043',
      desc: 'Cukup tinggi dan dapat berdampak pada keseharian. Bisa jadi ada kesulitan dalam mengelola pikiran dan emosi. Latihan relaksasi atau bantuan profesional dapat membantu.',
    };
  }
  return {
    level: 'Sangat Tinggi',
    color: '#d32f2f',
    desc: 'Anda berada dalam tingkat yang signifikan dan bisa mengganggu aktivitas serta kesejahteraan. Sebaiknya segera mencari dukungan profesional untuk mendapatkan strategi yang sesuai.',
  };
};

function HasilTestKecemasanPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const kecemasanParam = params.get('kecemasan');
  const depresiParam = params.get('depresi');
  const stressParam = params.get('stress');
  const isDASS = depresiParam !== null || stressParam !== null;

  const kecemasanData = isDASS
    ? skalaDASS(kecemasanParam)
    : kategoriKecemasan(kecemasanParam);
  const depresiData = isDASS && depresiParam ? skalaDASS(depresiParam) : null;
  const stressData = isDASS && stressParam ? skalaDASS(stressParam) : null;
  const [formValues, setFormValues] = useState({
    name: '',
    whatsapp: '',
    email: '',
    domicile: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
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
            value: isDASS ? 'Hasil Tes Kesehatan Mental' : 'Hasil Tes Kecemasan',
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
            <h1>Tes Kecemasan</h1>
          </div>
        </div>
      </header>

      <section className="hasil-test-section">
        <div className="hasil-test-container">
          <article className="hasil-summary-card">
            <h2>Hasil Tes Sudah Keluar</h2>
            <p className="hasil-summary-subtitle">Berikut adalah tingkat kondisi Anda:</p>
            <p
              className="hasil-level-badge"
              style={{ background: kecemasanData.color }}
            >
              <strong>Kecemasan:</strong> {kecemasanData.level}
            </p>
            <p className="hasil-summary-copy">{kecemasanData.desc}</p>
            {depresiData ? (
              <>
                <p
                  className="hasil-level-badge"
                  style={{ background: depresiData.color }}
                >
                  <strong>Depresi:</strong> {depresiData.level}
                </p>
                <p className="hasil-summary-copy">{depresiData.desc}</p>
              </>
            ) : null}
            {stressData ? (
              <>
                <p
                  className="hasil-level-badge"
                  style={{ background: stressData.color }}
                >
                  <strong>Stres:</strong> {stressData.level}
                </p>
                <p className="hasil-summary-copy">{stressData.desc}</p>
              </>
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

          <section className="hasil-info-block">
            <div className="hasil-info-icon">?</div>
            <div className="hasil-info-content">
              <h3>Tahukah Anda?</h3>
              <p>
                <span className="text-red">Setiap 40 detik</span> terjadi{' '}
                <span className="text-red">kasus bunuh diri</span> di seluruh
                dunia yang diakibatkan oleh <span className="text-red">depresi</span>.
              </p>
              <p className="hasil-source">Sumber : WHO</p>
              <p>
                Dan di Indonesia, sekitar{' '}
                <span className="text-red">15,6 juta penduduk</span> yang
                mengalami <span className="text-red">depresi</span>. Sayangnya{' '}
                <span className="text-red">hanya 8%</span> yang mencari{' '}
                <span className="text-red">pengobatan</span> ke profesional
              </p>
              <p className="hasil-source">
                Sumber : Dr. Eka Viora, SpKJ, Ketua Perhimpunan Dokter Spesial
                Kesehatan Jiwa Indonesia (PDSKJI)
              </p>
            </div>
          </section>

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
        </div>
      </section>

      <section
        className="cta-section cta-northlights hasil-book-cta"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/book.gif)`,
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
