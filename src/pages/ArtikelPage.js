import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const articleItems = [
  {
    id: 1,
    topic: 'Lain-Lain',
    title:
      'Mengapa Berpikir Positif Saja Tidak Cukup? Rahasia Mengakses "Pintu Belakang" Sistem Saraf Anda',
    excerpt:
      'Banyak dari kita yang saat sedang stres, cemas, atau burnout, mencoba menyelesaikannya melalui pikiran. Kita mencoba bermeditasi, melakukan afirmasi positif, atau memaksa diri untuk "berpikir..."',
    image: 'positive-thinking.png',
  },
  {
    id: 2,
    topic: 'Stres',
    title:
      'Mengenal Fascia: "Baju Ketat" di Bawah Kulit yang Menyimpan Memori Stres dan Mengunci Energi Anda',
    excerpt:
      'Pernahkah Anda menyentuh pundak Anda sendiri dan rasanya sekeras papan kayu? Atau mungkin Anda merasa tubuh "kaku" saat bangun pagi, seolah-olah Anda mengenakan baju yang...',
    image: 'kulit.jpg',
  },
  {
    id: 3,
    topic: 'Asam Lambung / Gerd, Stres',
    title: 'Stress Bikin Nafsu Makan Berantakan? Kok Bisa?',
    excerpt:
      'Berapa banyak di sekitar kita, atau bahkan kita sendiri, yang pas dalam keadaan stress, cemas, tertekan, sedih, marah, nafsu makan jadi berantakan? Nah, kali ini...',
    image: 'makan.png',
  },
  {
    id: 4,
    topic: 'Stres',
    title: 'Kenapa Stres Bikin Badan Cepat Terasa Berat',
    excerpt:
      'Pernahkah Anda bangun pagi tapi tubuh terasa seperti membawa beban menumpuk? Punggung kaku, leher nyeri, kepala pening, pinggang pegal-pegal, dada sesak, nafas berat. Padahal waktu...',
    image: 'stressberat.jpg',
  },
  {
    id: 5,
    topic: 'Kecemasan Berlebihan',
    title: 'Kenapa Masalah Kecil Suka Dibesar-besarkan?',
    excerpt:
      'Pernah merasa kesal saat teman terlambat 10 menit, lalu pikiranmu mulai menggila: "Dia nggak respect sama aku nih. Apa aku nggak penting?" Hingga akhirnya, masalah...',
    image: 'smallproblem.jpg',
  },
  {
    id: 6,
    topic: 'Lain-Lain',
    title: 'Getaran Tubuh (Tremor): Ancaman atau Pemulihan?',
    excerpt:
      'Pernah nggak kamu merasa tubuhmu tiba-tiba bergetar tanpa sebab jelas? Tangan gemetar halus waktu tegang, kaki bergetar setelah marah, atau tubuh menggigil setelah menahan tangis....',
    image: 'shaking.jpg',
  },
  {
    id: 7,
    topic: 'Kecemasan Berlebihan',
    title: 'Kenapa Tubuh Butuh Tidur? Pentingnya Tidur bagi Kesehatan',
    excerpt:
      'Di dunia yang serba sibuk, tidur sering kali dianggap sebagai hal sepele. Banyak orang mengorbankan waktu tidur demi pekerjaan, hiburan, atau aktivitas lainnya. Padahal, tidur...',
    image: 'susah-tidur.jpg',
  },
  {
    id: 8,
    topic: 'Kecemasan Berlebihan',
    title: '5 Cara Meredam Overthinking',
    excerpt:
      'Tidak sedikit orang yang datang ke seminar saya mengeluhkan kecemasan mereka. Setelah ditelusuri lebih dalam, banyak dari mereka yang sebenarnya mengalami overthinking, yaitu kebiasaan memikirkan...',
    image: 'overthinking.png',
  },
  {
    id: 9,
    topic: 'Stres',
    title: 'Benarkah Stres Bisa Menyebabkan Penyakit Fisik (Psikosomatis)?',
    excerpt:
      'Tidak dapat dipungkiri bahwa tekanan dan stres dalam kehidupan sehari-hari dapat memberikan dampak yang signifikan pada tubuh, termasuk memicu berbagai penyakit fisik. Namun, bagaimana sebenarnya...',
    image: 'stress.jpg',
  },
  {
    id: 10,
    topic: 'Kecemasan Berlebihan',
    title: '5 Cara Hidup dengan Phobia',
    excerpt:
      'Apakah Anda pernah merasa ketakutan yang berlebihan terhadap sesuatu yang bagi orang lain sama sekali tidak berbahaya? Atau mungkin ada sesuatu yang membuat Anda begitu...',
    image: 'phobia.png',
  },
  {
    id: 11,
    topic: 'Emosi',
    title: 'Alexithymia: Ketika Emosi Terasa Asing di Diri Sendiri',
    excerpt:
      'Apa Itu Alexithymia? Pernahkah kamu merasa sulit menjelaskan apa yang sedang kamu rasakan? Atau mungkin melihat seseorang yang tampak tidak peka terhadap perasaan orang lain...',
    image: 'alexithymia.jpeg',
  },
  {
    id: 12,
    topic: 'Stres',
    title: '5 Gerakan yang Bisa Melepas Stres',
    excerpt:
      'Kenapa Aktivitas Fisik Bisa Menjadi Stres Healing? Apakah Anda pernah merasa lebih lega setelah berolahraga, berjalan santai, atau bahkan sekadar beberes rumah? Ternyata, gerakan fisik...',
    image: 'exercise.jpg',
  },
  {
    id: 13,
    topic: 'Lain-Lain',
    title: 'Self Healing dengan Menulis : Cara Efektif Atasi Stres & Trauma',
    excerpt:
      'Pernah dengar nggak, kalau suasana hati sedang gundah, stres dan tekanan mengganggu pikiran, atau kalau ada perasaan yang tidak bisa dan tidak sempat diutarakan, menulis...',
    image: 'self-healing.jpg',
  },
  {
    id: 14,
    topic: 'Asam Lambung/Gerd',
    title: 'GERD: Penyebab, Gejala, dan Cara Mengatasinya Secara Alami',
    excerpt:
      'GERD (Gastroesophageal Reflux Disease) adalah kondisi di mana asam lambung naik ke kerongkongan, menyebabkan sensasi terbakar di dada (heartburn) dan gejala tidak nyaman lainnya. ...',
    image: 'gerd.jpg',
  },
  {
    id: 15,
    topic: 'Stres',
    title: 'Kenali 5 Respon Tubuh Terhadap Stres dan Cara Mengatasinya dengan Teknik TRE',
    excerpt:
      'Pernah ngerasa takut sampai tubuh gak bisa bergerak? Pernah merasa menyesal karena menyerang seseorang tanpa berpikir terlebih dahulu? Atau pernah ada yang menegur kita karena...',
    image: 'stress-artikel.jpg',
  },
];

const topics = [
  'Semua',
  'Stres',
  'Kecemasan Berlebihan',
  'Emosi',
  'Asam Lambung/Gerd',
  'Lain-Lain',
];

function ArtikelPage() {
  const [activeTopic, setActiveTopic] = useState('Semua');

  const filteredArticles = useMemo(() => {
    if (activeTopic === 'Semua') {
      return articleItems;
    }
    return articleItems.filter((item) => item.topic === activeTopic);
  }, [activeTopic]);

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

      <section className="artikel-library">
        <div className="artikel-library-inner">
          <div className="testimonial-library-heading">
            <h2>Wawasan dan Tips Seputar Kesehatan Mental</h2>
          </div>

          <div className="testimonial-filters" role="tablist" aria-label="Filter topik artikel">
            {topics.map((topic) => (
              <button
                key={topic}
                type="button"
                className={`testimonial-filter${
                  activeTopic === topic ? ' is-active' : ''
                }`}
                onClick={() => setActiveTopic(topic)}
                role="tab"
                aria-selected={activeTopic === topic}
              >
                {topic}
              </button>
            ))}
          </div>

          <div className="testimonial-library-grid">
            {filteredArticles.map((article) => (
              <article className="testimonial-library-card" key={article.id}>
                <div className="testimonial-library-card-video">
                  <div className="artikel-image-frame">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/home/${article.image}`}
                      alt={article.title}
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="testimonial-library-card-body">
                  <span className="artikel-card-topic">{article.topic}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <Link className="testimonial-library-card-action" to="/artikel">
                    <span>Baca Selengkapnya</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="cta-section cta-northlights"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/artikel.gif)`,
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
    </div>
  );
}

export default ArtikelPage;
