import { useState } from 'react';
import NavBar from '../components/NavBar';
import { submitSupportForm } from '../utils/formSubmission';

const stages = [
  {
    number: 'Modul 1',
    title: 'Personal TRE® Process',
    subtitle: null,
    description:
      'Di Modul 1 Anda akan memiliki pemahaman mendalam tentang manfaat TRE® bagi diri Anda sendiri. Prinsip-prinsip inti dari grounding, pengaturan diri dan pencegahan freezing, flooding dan disosiasi akan diajarkan.',
    itemsLabel: 'Tugas:',
    items: [
      '12 jam kelas online.',
      'Melakukan jurnal shaking pribadi.',
      '4 kali supervisi pribadi secara online via zoom oleh trainer/mentor.',
    ],
  },
  {
    number: 'Modul 2',
    title: 'Teaching TRE® to Individuals',
    subtitle: null,
    description:
      'Mulai mempelajari cara mengajarkan TRE® kepada orang lain, cara memanfaatkan intervensi sentuh dan non-sentuh, dan memperdalam pemahaman lebih lanjut tentang landasan biologis dan teoritis TRE®.',
    itemsLabel: 'Tugas:',
    items: [
      '12 jam kelas online.',
      'Melakukan jurnal shaking pribadi.',
      '4 kali sesi supervisi mengajar one on one, disupervisi secara online oleh trainer/mentor.',
      'Membaca literatur yang diperlukan dan menulis laporan singkat. Ada Buku & Video yang perlu dienroll atau beli.',
    ],
  },
  {
    number: 'Modul 3',
    title: 'Teaching TRE® to Group',
    subtitle: 'Teaching TRE® to Individuals',
    description:
      'Pelajari cara memfasilitasi proses shaking dalam kelompok kecil. Kembangkan keterampilan untuk menjelaskan TRE dan grounding serta mengatur kelompok yang beragam.',
    itemsLabel: 'Tugas:',
    items: [
      '15 jam kelas online.',
      'Melakukan jurnal shaking pribadi.',
      '4 kali sesi supervisi mengajar group, disupervisi secara online oleh trainer/mentor (biaya tambahan supervisi bisa terjadi jika Anda belum memenuhi kualifikasi).',
      '1 kali sesi supervisi akhir dengan Certification Trainer untuk menentukan kelulusan Anda.',
      'Membaca literatur yang diperlukan dan menulis laporan singkat. Ada Buku & Video yang perlu dienroll atau beli.',
    ],
  },
];

const requirements = [
  'Usia minimal 30 tahun ke atas.',
  'Sudah mengikuti One Day Workshop TRE Indonesia.',
  'Rutin melakukan latihan TRE pribadi.',
  'Komitmen hadir penuh dan menyalakan kamera saat online.',
];

const faqItems = [
  {
    question:
      'Apa kelebihan Sertifikasi TRE® bagi seorang psikoterapis atau konselor kesehatan mental, massage terapis atau bodyworker?',
    answer: (
      <>
        <p>
          Banyak psikoterapis dan konselor kesehatan mental menyebut TRE
          sebagai "the missing piece". TRE akan memberikan Anda teknik somatik
          yang efektif untuk bekerja dengan individu yang pulih dari stres
          kronis, kecemasan, atau trauma (baik masa lalu maupun baru).
        </p>
        <p>
          Sertifikasi TRE akan memperdalam pengetahuan dan kemampuan Anda dalam
          bekerja dengan respons tremor. Menggunakannya sebagai komponen
          penyembuhan yang efektif bagi klien Anda.
        </p>
        <ul>
          <li>
            TRE mengajarkan konsep tentang bagaimana <strong>'follow the body'</strong>.
            {' '}TRE adalah teknik yang berbasis pada kecerdasan tubuh.
          </li>
          <li>
            TRE adalah teknik yang akan diapresiasi oleh klien Anda sebagai
            teknik Self-help yang dapat mereka <strong>gunakan sendiri secara mandiri</strong>{' '}
            untuk mendukung kesehatan dan penyembuhan dalam dirinya.
          </li>
          <li>
            TRE adalah <strong>pendekatan holistik</strong> untuk penyembuhan yang
            melibatkan tubuh, pikiran, dan emosi.
          </li>
          <li>
            TRE dapat mengurangi kebutuhan klien untuk <strong>"bercerita"</strong>.
          </li>
          <li>
            TRE telah menjadi praktik pelengkap yang sangat berharga untuk
            modalitas terapi kesehatan mental tradisional "terapi bicara"
            karena mendukung penyembuhan pada tingkat{' '}
            <strong>fisiologi yang paling dalam</strong>, di mana respons
            traumatis berasal.
          </li>
          <li>
            Anda <strong>tidak perlu</strong> menggunakan/melibatkan{' '}
            <strong>sentuhan fisik</strong> saat bekerja dengan klien.
          </li>
          <li>
            TRE mengajarkan bagaimana <strong>regulasi diri</strong> adalah alat
            yang paling berharga untuk penyembuhan emosional dan fisik.
          </li>
          <li>
            TRE dapat mengubah tubuh fisik dengan cara yang halus dan mendalam;
            seringkali meringankan atau sepenuhnya mengatasi gejala emosional
            dan/atau fisik dari stres kronis dan trauma.
          </li>
          <li>
            TRE adalah <strong>alat berharga</strong> yang dapat Anda berikan
            kepada klien Anda yang akan memungkinkan mereka untuk membawa
            perubahan positif dan permanen pada pola ketegangan yang tertanam
            di tubuh.
          </li>
        </ul>
      </>
    ),
  },
  {
    question:
      'Saya bukan profesional kesehatan mental atau profesional kesehatan medis. Apa Saya bisa belajar?',
    answer: (
      <>
        <p>
          Selama bertahun-tahun, kami telah meng sertifikasi banyak orang dari
          berbagai latar belakang, yang ingin mengajar TRE dengan kompeten dan
          aman kepada teman, keluarga, rekan kerja, dan/atau klien.
        </p>
        <p>
          Program Pelatihan Sertifikasi TRE dirancang untuk mempersiapkan Anda
          untuk mengajar TRE dengan kompeten dan aman sebagai teknik pelepasan
          stres.
        </p>
      </>
    ),
  },
  {
    question:
      'Mengapa saya tidak bisa mulai mengajar TRE® setelah membaca bukunya atau mengikuti salah satu pelatihan?',
    answer: (
      <>
        <p>
          Dr. Berceli memiliki hak cipta dan merek dagang atas semua hal yang
          berhubungan dengan TRE.
        </p>
        <p>
          Mengajar TRE tanpa sertifikasi berarti Anda melakukan pelanggaran
          hukum terhadap merek dagang dan hak cipta.
        </p>
        <p>
          Mengajar TRE tanpa sertifikasi penuh berarti Anda melakukan kelalaian
          profesional karena Anda tidak memiliki keterampilan, pengetahuan, dan
          pengalaman untuk membimbing orang lain dengan kompeten dan aman
          melalui proses TRE.
        </p>
      </>
    ),
  },
  {
    question: 'Apakah saya mendapatkan manfaat lain selain sertifikasi?',
    answer: (
      <>
        <p>
          Setelah bersertifikasi, Anda akan menerima beberapa manfaat:
        </p>
        <p>
          Anda akan memenuhi syarat untuk terdaftar di Website TRE Provider
          Global. Situs web yang dikunjungi oleh ribuan orang setiap bulannya!
          Dengan reputasi TRE yang semakin berkembang, ini adalah sumber daya
          yang sangat mendukung.
        </p>
        <p>
          Anda juga akan memiliki akses ke artikel dan video yang mendukung
          pertumbuhan Anda dalam bekerja dengan pemulihan stres dan trauma.
        </p>
        <p>
          Anda akan memenuhi syarat untuk mengikuti workshop TRE Advanced (dari
          TRE Pusat di dunia) yang akan sangat meningkatkan keterampilan dan
          pengetahuan TRE Anda.
        </p>
        <p>
          Anda bisa berkontribusi di kegiatan yang diselenggarakan oleh{' '}
          <strong>Shaka Foundation</strong>, Yayasan sosial yang dibangun oleh{' '}
          <strong>Dr David Berceli</strong> dan <strong>Hindra Gunawan</strong>{' '}
          sejak 1 September 2019, dengan fokus untuk membantu setiap individu
          atau komunitas untuk menjadi versi terbaiknya melalui pengelolaan
          kecerdasan tubuh dalam merilis emosi, stress dan tekanan yang dialami
          selama hidup akibat berbagai peristiwa seperti bencana alam,
          kehilangan, intimidasi, kerusuhan, perang dan lain-lain.
        </p>
      </>
    ),
  },
];

function StageMetaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="4"
        y="5"
        width="16"
        height="11"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 19h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RequirementCheck() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M6 12.5l4 4 8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KelasSertifikasiTreProviderPage() {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    motivation: '',
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
        formType: 'kelas-sertifikasi',
        subject: 'Pendaftaran Kelas Sertifikasi TRE Provider',
        replyTo: formValues.email,
        fields: [
          { label: 'Nama Depan', value: formValues.firstName },
          { label: 'Nama Belakang', value: formValues.lastName },
          { label: 'Email Aktif', value: formValues.email },
          { label: 'Nomor Telepon (WA)', value: formValues.phone },
          {
            label: 'Pengalaman Kerja / Motivasi Ikut Serta',
            value: formValues.motivation,
          },
        ],
      });

      setFormValues({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        motivation: '',
      });
      setFormStatus({
        type: 'success',
        message: 'Pendaftaran Anda sudah terkirim. Tim TRE Indonesia akan segera menghubungi Anda.',
      });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Terjadi kesalahan saat mengirim data diri.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="certification-page">
      <header className="certification-hero">
        <NavBar
          className="nav-surface-light"
          logoSrc="/assets/brand/tre-logo-red.png"
        />
        <div className="certification-hero-inner">
          <div className="certification-hero-copy">
            <p className="certification-pill">Global Certification</p>
            <h1>
              Jadilah Praktisi <span>TRE Provider</span> Bersertifikat Dunia.
            </h1>
            <p className="certification-hero-lead">
              TRE Global Certification Training Program mempersiapkan peserta untuk mengajar TRE sebagai teknik pelepasan ketegangan yang aman dan efektif.
            </p>
            <p className="certification-hero-lead">
              Karena fokus somatik (tubuh) yang unik dan pendekatan baru yang revolusioner terhadap kesehatan dan kesejahteraan, Anda harus sepenuhnya bersertifikasi melalui program ini, untuk dapat mengajar TRE kepada orang lain.
            </p>
            <div className="certification-hero-actions">
              <a className="certification-primary-btn" href="#certification-form">
                Daftar Sertifikasi
                <span aria-hidden="true">→</span>
              </a>
              <a className="certification-secondary-btn" href="#alur-sertifikasi">
                Pelajari Detail
              </a>
            </div>
          </div>

          <div className="certification-hero-media">
            <div className="certification-hero-frame">
              <img
                src={`${process.env.PUBLIC_URL}/assets/home/image-4.jpg`}
                alt="Kelas sertifikasi TRE Provider"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="certification-trainer">
        <div className="certification-container">
          <div className="certification-trainer-card">
            <img
              src={`${process.env.PUBLIC_URL}/assets/home/pakhindra.jpg`}
              alt="Hindra Gunawan"
            />
            <div className="certification-trainer-copy">
              <p className="certification-section-kicker">Lead Trainer</p>
              <h2>Hindra Gunawan</h2>
              <p className="certification-trainer-quote">
                "1st Certification Trainer & Provider di Indonesia"
              </p>
              <div className="certification-trainer-line" />
              <p className="certification-trainer-role">
                Founder of TRE Indonesia
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="certification-stages" id="alur-sertifikasi">
        <div className="certification-container">
          <div className="certification-heading">
            <h2>Alur Pelatihan Sertifikasi</h2>
            <p>
              Perjalanan transformatif menuju praktisi profesional selama 10-24
              bulan.
            </p>
          </div>

          <div className="certification-stage-grid">
            {stages.map((stage) => (
              <article className="certification-stage-card" key={stage.number}>
                <span className="certification-stage-number">{stage.number}</span>
                <h3>{stage.title}</h3>
                {stage.subtitle ? (
                  <p className="certification-stage-subtitle">{stage.subtitle}</p>
                ) : null}
                <p className="certification-stage-description">{stage.description}</p>
                <div className="certification-stage-divider" />
                {stage.itemsLabel ? (
                  <p className="certification-stage-items-label">{stage.itemsLabel}</p>
                ) : null}
                <ul className="certification-stage-list">
                  {stage.items.map((item) => (
                    <li key={item}>
                      <StageMetaIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="certification-investment">
        <div className="certification-container">
          <h2>Investasi Masa Depan Anda</h2>
          <div className="certification-investment-grid">
            <div className="certification-pricing-column">
              <article className="certification-price-card highlight">
                <p className="certification-price-label">Early Bird</p>
                <h3>Rp 47.500.000</h3>
                <p>Pendaftaran awal sebelum kuota penuh</p>
              </article>
              <article className="certification-price-card">
                <p className="certification-price-label muted">Harga Normal</p>
                <h3>Rp 52.500.000</h3>
              </article>
              <div className="certification-payment-meta">
                <div>
                  <p>Pendaftaran Awal</p>
                  <strong>Rp 5.000.000</strong>
                  <span>(DP)</span>
                </div>
                <div>
                  <p>Pembayaran</p>
                  <strong>3 Tahap</strong>
                  <span>Angsuran</span>
                </div>
              </div>
            </div>

            <article className="certification-requirements-card">
              <h3>Syarat Keikutsertaan:</h3>
              <ul>
                {requirements.map((item) => (
                  <li key={item}>
                    <span className="certification-check">
                      <RequirementCheck />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="certification-faq">
        <div className="certification-container certification-faq-inner">
          <div className="certification-heading">
            <h2>Pertanyaan Umum</h2>
          </div>
          <div className="certification-faq-list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <div className="certification-faq-answer">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="certification-form-section" id="certification-form">
        <div className="certification-form-shell">
          <div className="certification-form-card">
            <div className="certification-heading left">
              <h2>Dapatkan Sertifikasi Anda</h2>
              <p>
                Isi data diri Anda dengan lengkap untuk memulai perjalanan karir
                baru.
              </p>
            </div>
            <form className="certification-form" onSubmit={handleSubmit}>
              <label>
                <span>Nama Depan *</span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formValues.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Nama Belakang *</span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formValues.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Email Aktif *</span>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Nomor Telepon (WA) *</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0812..."
                  value={formValues.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="certification-form-message">
                <span>Pengalaman Kerja / Motivasi Ikut Serta *</span>
                <textarea
                  name="motivation"
                  rows="5"
                  placeholder="Ceritakan singkat latar belakang Anda..."
                  value={formValues.motivation}
                  onChange={handleChange}
                  required
                />
              </label>
              {formStatus.message ? (
                <div
                  className={`form-status${formStatus.type ? ` is-${formStatus.type}` : ''} certification-form-status`}
                  role="status"
                >
                  {formStatus.message}
                </div>
              ) : null}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Data Diri Sekarang'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KelasSertifikasiTreProviderPage;
