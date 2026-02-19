import { useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import NavBar from '../components/NavBar';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { testimonialVideos } from '../data/testimonialData';

const benefits = [
  {
    title: 'Mengurangi Stres',
    image: '/assets/home/benefit-5.png',
    description:
      'Membantu tubuh dan pikiran kembali ke kondisi yang lebih rileks, sehingga Anda lebih mudah menjalani aktivitas sehari-hari dengan tenang dan jernih.',
  },
  {
    title: 'Memperbaiki Kehidupan & Cinta',
    image: '/assets/home/benefit-3.png',
    description:
      'Mendukung keseimbangan emosi dan kesadaran diri, yang berdampak pada kualitas interaksi, hubungan, dan cara Anda merespons orang terdekat.',
  },
  {
    title: 'Meningkatkan Kualitas Tidur',
    image: '/assets/home/benefit-2.png',
    description:
      'Membantu tubuh mencapai kondisi istirahat yang lebih optimal, sehingga Anda bangun dengan rasa lebih segar dan siap beraktivitas.',
  },
  {
    title: 'Meningkatkan Produktivitas',
    image: '/assets/home/benefit-1.png',
    description:
      'Mendukung fokus, konsentrasi, dan ketahanan mental agar Anda dapat menjalani proses kerja dan belajar dengan lebih efektif.',
  },
  {
    title: 'Bergerak Lebih Bebas',
    image: '/assets/home/benefit-4.png',
    description:
      'Membantu tubuh merasa lebih ringan dan responsif dalam bergerak, sehingga aktivitas fisik terasa lebih nyaman dan natural.',
  },
];

const trustedLogos = [
  { src: '/assets/trusted/pertamina-patra-niaga.png', alt: 'Pertamina Patra Niaga' },
  { src: '/assets/trusted/brimob.png', alt: 'Brimob' },
  { src: '/assets/trusted/bca.png', alt: 'BCA' },
  { src: '/assets/trusted/bnpt.png', alt: 'BNPT' },
  { src: '/assets/trusted/polri.png', alt: 'Polri' },
  { src: '/assets/trusted/st-louis.png', alt: 'St Louis Surabaya' },
  { src: '/assets/trusted/himpsi.png', alt: 'HIMPSI' },
  { src: '/assets/trusted/pt-cendana.png', alt: 'Perguruan Tinggi Cendana' },
  { src: '/assets/trusted/maitreyawira.png', alt: 'Sekolah Maitreyawira Batam' },
  { src: '/assets/trusted/krisna.png', alt: 'Krisna Oleh-Oleh Khas Bali' },
  { src: '/assets/trusted/kinderfield.png', alt: 'Kinderfield Depok' },
  { src: '/assets/trusted/dua-kelinci.png', alt: 'Dua Kelinci' },
  { src: '/assets/trusted/gunung-rizki.png', alt: 'Gunung Rizki' },
  { src: '/assets/trusted/bareskrim.png', alt: 'Bareskrim PPA' },
  { src: '/assets/trusted/duta-bakti.png', alt: 'Duta Bakti School Yogyakarta' },
  { src: '/assets/trusted/sanata-darma.png', alt: 'Universitas Sanata Dharma' },
  { src: '/assets/trusted/yos-sudarso.png', alt: 'Yos Sudarso School Batam' },
  { src: '/assets/trusted/bpr-gr.png', alt: 'BPR GR' },
];

const homeTestimonials = testimonialVideos.slice(0, 3).map((item) => ({
  ...item,
  role: item.occupation,
  category: item.categories[0],
  date: 'September 7, 2024',
  excerpt: item.body,
}));

const scheduleItems = [
  {
    title: 'Seminar TRE Jakarta',
    image: '/assets/home/jakarta.jpg',
  },
  {
    title: 'Seminar TRE Bali',
    image: '/assets/home/bali.jpg',
  },
  {
    title: 'Seminar TRE Balikpapan',
    image: '/assets/home/balikpapan.jpg',
  },
  {
    title: 'Seminar TRE Bandung',
    image: '/assets/home/bandung.png',
  },
  {
    title: 'Seminar TRE Banjarmasin',
    image: '/assets/home/banjarmasin.jpg',
  },
  {
    title: 'Seminar TRE Batam',
    image: '/assets/home/batam.jpg',
  },
  {
    title: 'Seminar TRE Bogor',
    image: '/assets/home/bogor.jpg',
  },
  {
    title: 'Seminar TRE Cirebon',
    image: '/assets/home/cirebon.png',
  },
];

const blogItems = [
  {
    category: 'Asam Lambung / GERD, Stres',
    title: 'Stress Bikin Nafsu Makan Berantakan? Kok Bisa?',
    excerpt:
      'Berapa banyak di sekitar kita, atau bahkan kita sendiri, yang pas dalam keadaan stress, cemas, tertekan, sedih, marah, nafsu makan jadi berantakan? Nah, kali ini...',
    image: '/assets/home/makan.png',
  },
  {
    category: 'Stres',
    title: 'Kenapa Stres Bikin Badan Cepat Terasa Berat',
    excerpt:
      'Pernahkah Anda bangun pagi tapi tubuh terasa seperti membawa beban menumpuk? Punggung kaku, leher nyeri, kepala pening, pinggang pegal-pegal, dada sesak, nafas berat. Padahal waktu...',
    image: '/assets/home/stressberat.jpg',
  },
  {
    category: 'Kecemasan Berlebihan',
    title: 'Kenapa Masalah Kecil Suka Dibesarkan?',
    excerpt:
      'Pernah merasa kesal saat teman terlambat 10 menit, lalu pikiranmu mulai menggila: “Dia nggak respect sama aku nih. Apa aku nggak penting?” Hingga akhirnya, masalah...',
    image: '/assets/home/smallproblem.jpg',
  },
  {
    category: 'Kecemasan Berlebihan',
    title: '5 Cara Meredam Overthinking',
    excerpt:
      'Tidak sedikit orang yang datang ke seminar saya mengeluhkan kecemasan mereka. Setelah ditelusuri lebih dalam, banyak dari mereka yang sebenarnya mengalami overthinking, yaitu kebiasaan memikirkan...',
    image: '/assets/home/overthinking.png',
  },
  {
    category: 'Lain-lain',
    title: 'Getaran Tubuh (Tremor): Ancaman atau Pemulihan?',
    excerpt:
      'Pernah nggak kamu merasa tubuhmu tiba-tiba bergetar tanpa sebab jelas? Tangan gemetar halus waktu tegang, kaki bergetar setelah marah, atau tubuh menggigil setelah menahan tangis....',
    image: '/assets/home/shaking.jpg',
  },
  {
    category: 'Kecemasan Berlebihan',
    title: 'Kenapa Tubuh Butuh Tidur? Pentingnya Tidur bagi Kesehatan',
    excerpt:
      'Di dunia yang serba sibuk, tidur sering kali dianggap sebagai hal sepele. Banyak orang mengorbankan waktu tidur demi pekerjaan, hiburan, atau aktivitas lainnya. Padahal, tidur...',
    image: '/assets/home/susah-tidur.jpg',
  },
  {
    category: 'Stres',
    title: 'Benarkah Stres Bisa Menyebabkan Penyakit Fisik (Psikosomatis)?',
    excerpt:
      'Tidak dapat dipungkiri bahwa tekanan dan stres dalam kehidupan sehari-hari dapat memberikan dampak yang signifikan pada tubuh, termasuk memicu berbagai penyakit fisik. Namun, bagaimana sebenarnya...',
    image: '/assets/home/stress.jpg',
  },
  {
    category: 'Kecemasan Berlebihan',
    title: '5 Cara Hidup dengan Phobia',
    excerpt:
      'Apakah Anda pernah merasa ketakutan yang berlebihan terhadap sesuatu yang bagi orang lain sama sekali tidak berbahaya? Atau mungkin ada sesuatu yang membuat Anda begitu...',
    image: '/assets/home/phobia.png',
  },
];

const getCarouselStep = (track) => {
  const firstCard = track?.querySelector('.schedule-card, .blog-card');
  if (!firstCard) {
    return 0;
  }
  const styles = window.getComputedStyle(track);
  const gap = parseFloat(styles.columnGap || styles.gap || 0);
  const cardWidth = firstCard.getBoundingClientRect().width;
  return cardWidth + gap;
};

function HomePage() {
  const scheduleTrackRef = useRef(null);
  const blogTrackRef = useRef(null);

  return (
    <>
      <header
        className="hero hero-with-image"
        style={{
          '--hero-bg': `url(${process.env.PUBLIC_URL}/assets/home/bg4.jpg)`,
        }}
      >
        <NavBar />
        <div className="hero-inner">
          <div className="hero-text">
            <h1>Tension &amp; Trauma Releasing Exercises</h1>
            <p className="lead">
              Cara Alami Tubuh Melepaskan Stress, Trauma, dan Ketegangan.
            </p>
            <div className="hero-cta">
              <NavLink className="btn btn-accent btn-link" to="/apa-itu-tre">
                Pelajari Lebih Lanjut
              </NavLink>
            </div>
          </div>
        </div>
        <div className="hero-curve" />
      </header>

      <section
        className="tre-section"
        style={{
          '--section-bg': `url(${process.env.PUBLIC_URL}/assets/home/TRE1.jpg)`,
        }}
      >
        <div className="intro">
          <div className="intro-inner">
            <div className="intro-text">
              <p className="eyebrow">MENGENAL TRE</p>
              <h2>Tension &amp; Trauma Releasing Exercises (TRE)</h2>
              <p className="content">
                Diperkenalkan oleh Dr David Berceli (Creator of TRE Global)
                adalah serangkaian latihan sederhana namun inovatif yang
                membantu tubuh melepaskan pola otot dalam dari stres,
                ketegangan, dan trauma.
              </p>
              <p className="content">
                TRE menggunakan mekanisme refleks alami berupa gemetar atau
                bergetar (shaking) untuk melepaskan ketegangan otot dan
                menenangkan sistem saraf, membantu tubuh kembali ke keadaan
                seimbang.
              </p>
              <div className="intro-actions">
                <NavLink className="btn btn-accent btn-link" to="/apa-itu-tre">
                  Selengkapnya →
                </NavLink>
              </div>
              <div className="intro-stats">
                <div className="stat-card">
                  <span className="stat-value">90+</span>
                  <span className="stat-label">Negara di dunia</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">12+</span>
                  <span className="stat-label">Tahun di Indonesia</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">30,000</span>
                  <span className="stat-label">Member Belajar</span>
                </div>
              </div>
            </div>
            <div className="intro-visual">
              <div className="intro-glow" />
              <YouTubeEmbed
                className="intro-video"
                videoId="DHGic7T-flU"
                title="Penjelasan TRE"
              />
            </div>
          </div>
        </div>

        <div className="benefits">
          <div className="section-title">
            <p className="eyebrow">MANFAAT TRE</p>
            <h2>Bagaimana TRE Mengubah Hidup Anda</h2>
          </div>
          <div className="benefit-grid">
            {benefits.map((item, index) => (
              <div
                className="benefit-card"
                style={{ animationDelay: `${index * 0.2}s` }}
                key={item.title}
                data-benefit-index={index + 1}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="benefit-figure">
                  <img src={item.image} alt={item.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trusted">
        <div className="section-title">
          <p className="eyebrow2">DIPERCAYA OLEH</p>
        </div>
        <div className="logo-grid">
          {trustedLogos.map((logo) => (
            <div className="logo-tile" key={logo.src}>
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </section>

      <section
        className="testimonials"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/bg-perp5.jpg)`,
        }}
      >
        <div className="testimonials-header">
          <div>
            <p className="eyebrow3">TESTIMONIAL</p>
            <h2>Kisah Transformatif dari Peserta Kami</h2>
          </div>
          <NavLink className="btn btn-accent btn-link" to="/testimonial">
            Lihat Kisah Transformatif Lainnya →
          </NavLink>
        </div>
        <div className="testimonial-grid">
          {homeTestimonials.map((item) => (
            <article className="testimonial-card" key={item.videoId}>
              <div className="testimonial-media">
                <YouTubeEmbed
                  videoId={item.videoId}
                  title={`Testimonial ${item.name}`}
                />
                <div className="testimonial-overlay">
                  <span className="testimonial-name">{item.name}</span>
                  <span className="testimonial-role">{item.role}</span>
                </div>
              </div>
              <div className="testimonial-body">
                <div className="testimonial-meta">
                  <span>{item.category}</span>
                  <span className="dot" aria-hidden="true" />
                  <span>{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <Link className="testimonial-link" to={`/testimonial/${item.slug}`}>
                  Baca Selengkapnya →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="schedule-section"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/bg-perp5.jpg)`,
        }}
      >
        <div className="section-title schedule-title">
          <p className="eyebrow3">BELAJAR TRE</p>
          <h2>Cek Jadwal Terdekat di Kota Anda</h2>
        </div>
        <div className="schedule-carousel">
          <button
            className="schedule-nav"
            type="button"
            aria-label="Sebelumnya"
            onClick={() => {
              const track = scheduleTrackRef.current;
              if (!track) {
                return;
              }
              const step = getCarouselStep(track);
              if (!step) {
                return;
              }
              const maxScroll = track.scrollWidth - track.clientWidth;
              if (track.scrollLeft <= 0) {
                track.scrollLeft = maxScroll;
                return;
              }
              track.scrollBy({ left: -step, behavior: 'smooth' });
            }}
          >
            ←
          </button>
          <div className="schedule-grid" ref={scheduleTrackRef}>
            {scheduleItems.map((item) => (
              <article
                className="schedule-card"
                key={`${item.title}-${item.image}`}
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="schedule-overlay">
                  <h3>{item.title}</h3>
                  <div className="schedule-cta">
                    <span>Selengkapnya</span>
                    <span className="schedule-arrow" aria-hidden="true">
                      →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <button
            className="schedule-nav"
            type="button"
            aria-label="Berikutnya"
            onClick={() => {
              const track = scheduleTrackRef.current;
              if (!track) {
                return;
              }
              const step = getCarouselStep(track);
              if (!step) {
                return;
              }
              const maxScroll = track.scrollWidth - track.clientWidth;
              if (track.scrollLeft >= maxScroll - 1) {
                track.scrollLeft = 0;
                return;
              }
              track.scrollBy({ left: step, behavior: 'smooth' });
            }}
          >
            →
          </button>
        </div>
        <div className="schedule-actions">
          <button className="btn btn-accent" type="button">
            Jadwal Seminar Kota Lain →
          </button>
        </div>
      </section>

      <section
        className="test-section"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/bg-perp5.jpg)`,
        }}
      >
        <div className="test-card">
          <div className="test-media">
            <img src="/assets/home/test.jpg" alt="Tes kesehatan mental" />
          </div>
          <div className="test-content">
            <p className="test-eyebrow">TEST</p>
            <h2>Pahami Kondisi Anda Saat ini dengan Tes Sederhana</h2>
            <p className="test-copy">Dengan pendekatan tes DASS dan GAD-7</p>
            <button className="test-link" type="button">
              Mulai Test →
            </button>
          </div>
        </div>
      </section>

      <section
        className="blog-section"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/bg-perp5.jpg)`,
        }}
      >
        <div className="blog-header">
          <div>
            <p className="blog-eyebrow">BLOG</p>
            <h2>Jelajahi Blog Kami untuk Pemahaman Lebih dalam</h2>
          </div>
          <button className="btn btn-accent" type="button">
            Semua Blog →
          </button>
        </div>
        <div className="schedule-carousel blog-carousel">
          <button
            className="schedule-nav"
            type="button"
            aria-label="Sebelumnya"
            onClick={() => {
              const track = blogTrackRef.current;
              if (!track) {
                return;
              }
              const step = getCarouselStep(track);
              if (!step) {
                return;
              }
              const maxScroll = track.scrollWidth - track.clientWidth;
              if (track.scrollLeft <= 0) {
                track.scrollLeft = maxScroll;
                return;
              }
              track.scrollBy({ left: -step, behavior: 'smooth' });
            }}
          >
            ←
          </button>
          <div className="blog-grid" ref={blogTrackRef}>
            {blogItems.map((item) => (
              <article className="blog-card" key={item.title}>
                <div className="blog-media">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="blog-body">
                  <p className="blog-category">{item.category}</p>
                  <h3>{item.title}</h3>
                  <p className="blog-excerpt">{item.excerpt}</p>
                  <button className="blog-link" type="button">
                    Baca Selengkapnya →
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button
            className="schedule-nav"
            type="button"
            aria-label="Berikutnya"
            onClick={() => {
              const track = blogTrackRef.current;
              if (!track) {
                return;
              }
              const step = getCarouselStep(track);
              if (!step) {
                return;
              }
              const maxScroll = track.scrollWidth - track.clientWidth;
              if (track.scrollLeft >= maxScroll - 1) {
                track.scrollLeft = 0;
                return;
              }
              track.scrollBy({ left: step, behavior: 'smooth' });
            }}
          >
            →
          </button>
        </div>
      </section>

      <section
        className="cta-section"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/waterfall.gif)`,
        }}
      >
        <div className="cta-content">
          <p>Temukan Layanan TRE yang Sesuai untuk Anda</p>
          <h>
            Jelajahi berbagai pilihan layanan yang dirancang untuk memenuhi
            kebutuhan dan kondisi Anda dengan fleksibel.
          </h>
          <button className="cta-button" type="button">
            Lihat layanan seminar
          </button>
        </div>
      </section>
    </>
  );
}

export default HomePage;



