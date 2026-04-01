import { useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';
import YouTubeEmbed from '../components/YouTubeEmbed';

const founderParagraphs = [
  'David Berceli, Ph.D. adalah pakar internasional di bidang intervensi trauma dan resolusi konflik. Ia adalah pencipta Tension & Trauma Releasing Exercises (TRE). Teknik revolusioner ini dirancang untuk membantu melepaskan ketegangan mendalam yang tercipta di dalam tubuh selama pengalaman traumatis atau melalui stres kronis. Ia juga pendiri dan CEO Trauma Recovery Services yang energik dan kreatif.',
  'Dave telah menghabiskan dua dekade tinggal dan bekerja di sembilan negara, memberikan lokakarya pemulihan trauma dan merancang program pemulihan bagi organisasi internasional di seluruh dunia. Ia telah tinggal dan bekerja secara ekstensif di Israel/Palestina, Sudan, Uganda, Kenya, Yaman, Mesir, dan Lebanon. Ia fasih berbahasa Inggris dan Arab.',
  'David unik karena ia memiliki dasar akademis dan pengalaman yang kuat dalam psikoterapi dan terapi tubuh. Ia memadukannya dengan pemahaman yang tajam tentang dinamika yang saling terkait antara agama dan adat istiadat etnis. Kombinasi ini memungkinkannya untuk mengembangkan proses yang unik dan spesifik yang memungkinkan orang-orang dari seluruh belahan dunia mengelola dan mengatasi trauma pribadi serta membawa penyembuhan dan rekonsiliasi antara berbagai kelompok.',
];

const benefitColumns = [
  [
    'Kualitas Tidur yang lebih baik',
    'Berkurangnya rasa kekhawatiran dan kecemasan',
    'Hilangnya penyakit psikosomatis',
    'Mengurangi sakit otot dan nyeri punggung',
    'Mengurangi simpom PTSD (gangguan stress pasca trauma)',
    'Mengurangi gejala Vicarious Trauma',
    'Meningkatkan energi dan daya tahan tubuh',
  ],
  [
    'Hubungan keluarga yang lebih baik',
    'Berkurangnya Stres di tempat kerja',
    'Meningkatkan fleksibilitas',
    'Meningkatkan kreativitas',
    'Menjadi tidak emosional',
    'Lebih merasa hidup dan bahagia',
    'Meningkatkan energi dan daya tahan tubuh',
  ],
];

const mediaLogos = [
  { src: '/assets/media/koran-pelita.png', alt: 'Koran Pelita' },
  { src: '/assets/media/media-indonesia.png', alt: 'Media Indonesia' },
  { src: '/assets/media/sindo-news.png', alt: 'SINDOnews' },
  { src: '/assets/media/koran-jakarta.png', alt: 'Koran Jakarta' },
  { src: '/assets/media/jawa-pos.png', alt: 'Jawa Pos' },
];

const aboutUsCards = [
  {
    id: '01',
    icon: 'eye',
    title: 'Visi - TRE Indonesia',
    description:
      'Semua orang di Indonesia melakukan TRE dalam hidupnya.',
  },
  {
    id: '02',
    icon: 'target',
    title: 'Misi - TRE Indonesia',
    description:
      'Membawa kehidupan yang damai, bahagia dan sejahtera ke dalam setiap keluarga di Indonesia.',
  },
  {
    id: '03',
    icon: 'people',
    title: 'Siapa Kami?',
    description:
      'Kami adalah tim profesional yang berdedikasi, terdiri dari praktisi dan pelatih TRE bersertifikat internasional yang berkomitmen untuk membawa manfaat TRE kepada masyarakat Indonesia.',
  },
  {
    id: '04',
    icon: 'book',
    title: 'Bagaimana Kami Melakukannya',
    description:
      'Kami menawarkan berbagai program yang dirancang untuk memenuhi kebutuhan Anda:',
    points: [
      {
        title: 'Seminar TRE',
        description: 'Pengenalan TRE',
      },
      {
        title: 'TRE Workshop',
        description: 'Praktek TRE dengan TRE Indonesia',
      },
      {
        title: 'Support',
        description: 'Pendampingan seumur hidup kepada peserta untuk melewati proses pemulihan diri.',
      },
      {
        title: 'Sertifikasi',
        description: 'Menciptakan Pengajar TRE bersertifikat untuk ke seluruh pelosok Indonesia.',
      },
    ],
  },
];

function AboutUsIcon({ type }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.9',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };

  if (type === 'eye') {
    return (
      <svg {...commonProps}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    );
  }

  if (type === 'target') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.8" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === 'people') {
    return (
      <svg {...commonProps}>
        <path d="M16.5 19v-1.2a3.8 3.8 0 0 0-3.8-3.8h-1.4a3.8 3.8 0 0 0-3.8 3.8V19" />
        <circle cx="12" cy="8.5" r="3.2" />
        <path d="M6.8 10.2a3 3 0 0 0-2.8 3V14" />
        <path d="M20 14v-.8a3 3 0 0 0-2.8-3" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M4.5 5.5h5a2 2 0 0 1 2 2V20a2.5 2.5 0 0 0-2-1h-5a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2Z" />
      <path d="M19.5 5.5h-5a2 2 0 0 0-2 2V20a2.5 2.5 0 0 1 2-1h5a2 2 0 0 0 2-2v-9.5a2 2 0 0 0-2-2Z" />
    </svg>
  );
}

function ApaItuTrePage() {
  const journeyTimelineRef = useRef(null);

  useEffect(() => {
    const timeline = journeyTimelineRef.current;
    if (!timeline) {
      return undefined;
    }

    const containers = Array.from(
      timeline.querySelectorAll('.tre-journey-container')
    );

    const handleScroll = () => {
      const rect = timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;
      const progress = Math.min(
        Math.max((viewportHeight * 0.7 - rect.top) / rect.height, 0),
        1
      );
      timeline.style.setProperty('--journey-progress', progress.toString());

      containers.forEach((container) => {
        const itemRect = container.getBoundingClientRect();
        const isVisible = itemRect.top < viewportHeight * 0.85;
        container.classList.toggle('is-visible', isVisible);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="tre-about-page">
      <header
        className="tre-about-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/apaitutre.jpg)`,
        }}
      >
        <NavBar />
        <div className="tre-about-hero-inner">
          <div className="tre-about-hero-copy">
            <h1>Tentang TRE</h1>
          </div>
        </div>
      </header>

      <section className="tre-about-section tre-founder">
        <div className="tre-about-container tre-founder-grid">
          <div className="tre-founder-text">
            <p className="eyebrow">FOUNDER</p>
            <h2>Pakar Trauma Global dan Pencipta TRE</h2>
            {founderParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="tre-founder-card">
            <img
              className="tre-founder-photo"
              src={`${process.env.PUBLIC_URL}/assets/home/drdavid.jpeg`}
              alt="Dr. David Berceli, Ph.D"
            />
          </div>
        </div>
      </section>

      <section className="tre-about-section tre-journey">
        <div className="tre-about-container">
          <div className="tre-about-heading">
            <h2>Perjalanan TRE Indonesia</h2>
          </div>
          <div className="tre-journey-grid">
            <div className="tre-journey-profile">
              <div className="tre-journey-profile-card">
                <img
                  className="tre-journey-photo"
                  src={`${process.env.PUBLIC_URL}/assets/home/hindra.jpg`}
                  alt="Hindra Gunawan"
                />
                <div className="tre-journey-card">
                  <h3>HINDRA GUNAWAN</h3>
                  <p>Founder of TRE Indonesia.</p>
                  <p>1st Certified TRE Provider in Indonesia</p>
                  <p>The Only Certified TRE Trainer in Indonesia</p>
                </div>
              </div>
            </div>
            <div className="tre-journey-timeline" ref={journeyTimelineRef}>
              <div className="tre-journey-container left-container">
                <span className="tre-journey-dot" aria-hidden="true" />
                <div className="tre-journey-text">
                  <h2>Jejak Awal TRE di Indonesia</h2>
                  <p>TRE pertama kali diperkenalkan di Indonesia pada tahun 2013 oleh bapak Hindra Gunawan. Secara global, TRE telah berkembang dan digunakan di lebih dari 90 negara. Indonesia sendiri menjadi negara ke-36 yang mengadopsi dan menerapkan teknik TRE.</p>
                </div>
              </div>
              <div className="tre-journey-container right-container">
                <span className="tre-journey-dot" aria-hidden="true" />
                <div className="tre-journey-text">
                  <h2>Perjalanan Hindra Menemukan TRE</h2>
                  <p>Berawal dari pencarian Hindra untuk menemukan cara mengatasi trauma yang ia rasakan, ia akhirnya dipertemukan dengan TRE. Dampak latihannya terasa luar biasa-cepat, nyata, dan alami-hingga trauma yang ia bawa selama 8 tahun dapat terlepas dengan cara yang sangat sederhana.</p>
                  <p>Pengalaman ini membuat Hindra tercengang dan menumbuhkan tekad kuat untuk memperlajari TRE lebih dalam, baik dari sisi ilmiah (scientific) maupun sisi batin (soul) yang menyertainya. Untuk memperdalam pemahamannya secara langsung dari sumbernya, Hindra kemudian mengambil sertifikasi TRE bersama pencipta TRE Global, Dr. David Berceli, di Amerika Serikat.</p>
                </div>
              </div>
              <div className="tre-journey-container left-container">
                <span className="tre-journey-dot" aria-hidden="true" />
                <div className="tre-journey-text">
                  <h2>Panggilan untuk Membawa TRE ke Lebih Banyak Orang</h2>
                  <p>Dalam Perjalanan mengikuti kelas sertifikasi, Hindra semakin mendapatkan banyak insight. Di tengah proses itu, tiba-tiba terbersit sebuah panggilan yang sangat kuat: "Setiap orang Indonesia perlu belajar teknik ini."</p>
                  <p>Hindra meyakini bahwa TRE memiliki potensi besar untuk menghadirkan perubaha nyata dalam hidup banyak orang-membantu mereka melepaskan beban yang tersimpan di tubuh, kembali merasa aman, dan menjalani hidup dengan lebih ringan.</p>
                </div>
              </div>
              <div className="tre-journey-container right-container">
                <span className="tre-journey-dot" aria-hidden="true" />
                <div className="tre-journey-text">
                  <h2>Menjadi Trainer TRE Pertama di Indonesia</h2>
                  <p>Hindra terus meng-upgrade dirinya dengan mengikuti berbagai pelatihan TRE Advanced di berbagai negara. Dedikasi ini mengantarkannya meraih sertifikasi resmi sebagai Global Certification Trainer—yang pertama di Indonesia.</p>
                  <p>Sebagai Global Certification Trainer, Hindra memiliki kewenangan untuk membimbing dan mensertifikasi peserta agar dapat menjadi Pengajar TRE Bersertifikasi (Certified TRE Provider), sehingga semakin banyak fasilitator TRE berkualitas yang lahir dan dapat membawa manfaat TRE ke lebih luas lagi.</p>
                </div>
              </div>
              <div className="tre-journey-container left-container">
                <span className="tre-journey-dot" aria-hidden="true" />
                <div className="tre-journey-text">
                  <h2>Konsistensi TRE Indonesia dalam Menyebarkan TRE Sejak 2013</h2>
                  <p>Sejak tahun 2013 hingga saat ini, TRE Indonesia terus melangkah tanpa henti dalam perjalanan menyebarkan teknik TRE ke berbagai daerah di Indonesia. Komitmen ini hadir untuk mendukung terbentuknya masyarakat yang lebih kuat secara mental, sekaligus berkontribusi pada Indonesia yang semakin maju.</p>
                  <p>Per Juli 2024, TRE Indonesia telah menyelenggarakan lebih dari 900 angkatan pelatihan offline (dan terus berlanjut) serta lebih dari 500 angkatan pelatihan online (masih berlanjut). Hingga saat ini, lebih dari 30.000 orang telah mengikuti pelatihan dan merasakan manfaatnya.</p>
                  <p>Selain itu, Hindra Gunawan telah mensertifikasi lebih dari 40 Certified TRE Provider di Indonesia dan Malaysia, sehingga semakin banyak fasilitator berkualitas yang dapat membawa TRE menjangkau lebih luas lagi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tre-about-section tre-definition">
        <div className="tre-about-container tre-definition-grid">
          <div className="tre-definition-text">
            <p>
              Tension & Trauma Releasing Exercises (TRE) diperkenalkan oleh
              Doktor David Berceli (Creator of TRE Global) adalah serangkaian
              latihan sederhana namun inovatif yang membantu tubuh melepaskan
              pola otot dalam dari stres, ketegangan, dan trauma.
            </p>
            <div className="tre-definition-quote">
              TRE menggunakan mekanisme refleks alami berupa gemetar atau
              bergetar untuk melepaskan ketegangan otot dan menenangkan sistem
              saraf, membantu tubuh kembali ke keadaan seimbang.
            </div>
          </div>
          <div className="tre-definition-media">
            <YouTubeEmbed
              className="tre-definition-video"
              videoId="AKqPrZ6rhzg"
              title="Penjelasan TRE"
            />
          </div>
        </div>
      </section>

      <section className="tre-about-section tre-about-us">
        <div className="tre-about-container">
          <div className="tre-about-us-shell">
            <div className="tre-about-heading tre-about-us-intro">
              <h2>Tentang Kami</h2>
            </div>
            <div className="tre-about-us-grid">
              {aboutUsCards.map((card) => (
                <article
                  className="tre-about-us-panel"
                  key={card.id}
                >
                  <div className="tre-about-us-panel-top">
                    <span className="tre-about-us-index">{card.id}</span>
                    <div className="tre-about-us-icon">
                      <AboutUsIcon type={card.icon} />
                    </div>
                  </div>
                  <div className="tre-about-us-panel-body">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                  {card.points && (
                    <div className="tre-about-us-program-grid">
                      {card.points.map((point) => (
                        <div className="tre-about-us-program-card" key={point.title}>
                          <h4>{point.title}</h4>
                          {point.description ? <p>{point.description}</p> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="tre-about-section tre-benefits tre-benefits-modern">
        <div className="tre-about-container tre-benefits-layout">
          <div className="tre-benefits-intro">
            <p className="eyebrow">KUALITAS TRE</p>
            <h2>Manfaat yang Sering Dilaporkan</h2>
          </div>
          <div className="tre-benefits-panels">
            {benefitColumns.map((column, index) => (
              <div className="tre-benefits-panel" key={`benefits-${index}`}>
                <h3>{index === 0 ? 'Manfaat Fisik' : 'Manfaat Emosional & Sosial'}</h3>
                <ul>
                  {column.map((item) => (
                    <li key={item}>
                      <span className="tre-benefit-bullet" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tre-about-section tre-media">
        <div className="tre-about-container">
          <div className="tre-about-heading tre-media-heading">
            <h2>Media yang Meliput TRE</h2>
          </div>
          <div className="tre-media-marquee">
            <div className="tre-media-track">
              {mediaLogos.map((logo) => (
                <div className="tre-media-logo" key={`logo-${logo.src}`}>
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
              {mediaLogos.map((logo) => (
                <div className="tre-media-logo" key={`logo-dup-${logo.src}`}>
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="cta-section"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/forest.gif)`,
        }}
      >
        <div className="cta-content">
          <p>Temukan Layanan TRE yang Sesuai untuk Anda</p>
          <h>Jelajahi berbagai pilihan layanan yang dirancang untuk memenuhi kebutuhan dan kondisi Anda dengan fleksibel.</h>
          <a className="cta-button" href="/belajar-tre">
            Lihat Layanan Seminar
          </a>
        </div>
      </section>
    </div>
  );
}

export default ApaItuTrePage;
