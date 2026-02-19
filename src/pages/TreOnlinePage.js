import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const ONLINE_SPEAKER = {
  name: 'Hindra Gunawan',
  image: 'individual.jpg',
  roles: [
    'Founder of TRE Indonesia',
    '1st Certified TRE Provider in Indonesia',
    'The Only Certified TRE Trainer in Indonesia',
  ],
};

const BASE_EVENT_DATE = new Date(2026, 1, 14);
const EVENT_INTERVAL_DAYS = 14;

const getNextEventDate = (today = new Date()) => {
  const normalizedToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const nextDate = new Date(BASE_EVENT_DATE);

  while (normalizedToday > nextDate) {
    nextDate.setDate(nextDate.getDate() + EVENT_INTERVAL_DAYS);
  }

  return nextDate;
};

const formatEventDate = (date) =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

function TreOnlinePage() {
  const nextEventDate = getNextEventDate();
  const eventDateLabel = formatEventDate(nextEventDate);

  return (
    <div className="tre-city-page">
      <header
        className="tre-city-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/atmosphere.jpg)`,
        }}
      >
        <NavBar />
        <div className="tre-city-hero-inner">
          <h1>TRE Online</h1>
        </div>
      </header>

      <section
        className="tre-city-overview"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/clouds.jpg)`,
        }}
      >
        <div className="tre-city-banner">
          <div className="tre-city-banner-inner">
            <div className="tre-city-image-wrap">
              <img
                src={`${process.env.PUBLIC_URL}/assets/home/treonline.jpg`}
                alt="Seminar TRE Online"
                className="tre-online-image"
              />
            </div>
            <h2 className="tre-city-banner-title">Seminar TRE Online</h2>
          </div>
        </div>

        <div className="tre-city-summary">
          <div className="tre-city-info">
            <div className="tre-city-info-inner">
              <div className="tre-city-info-grid">
                <div className="tre-city-info-card">
                  <span>Waktu</span>
                  <strong>{eventDateLabel} | 13.00 - 15.30 WIB</strong>
                </div>
                <div className="tre-city-info-card">
                  <span>Lokasi</span>
                  <strong>Online via ZOOM</strong>
                </div>
              </div>
              <div className="tre-city-price">
                <span className="tre-city-price-old">Rp 598.000</span>
                <span className="tre-city-price-new">Rp 299.000</span>
              </div>
              <Link className="tre-city-cta" to="/tre-individuals">
                Daftar Seminar
              </Link>
            </div>
          </div>

          <div className="tre-city-speaker-wrap">
            <article className="tre-city-card tre-city-speaker">
              <h3>Pembicara</h3>
              <div className="tre-city-speaker-profile">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/home/${ONLINE_SPEAKER.image}`}
                  alt={ONLINE_SPEAKER.name}
                />
                <div>
                  <h4>{ONLINE_SPEAKER.name}</h4>
                  <ul>
                    {ONLINE_SPEAKER.roles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        className="tre-city-details"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/sky.jpg)`,
        }}
      >
        <div className="tre-city-details-inner">
          <article className="tre-city-card">
            <h3>Deskripsi Seputar Acara</h3>
            <p className="tre-city-subtitle">
              TRE (Tension &amp; Trauma Releasing Exercises)
            </p>
            <p>
              Sebuah teknik pemulihan Stress dan Trauma yang mampu mengatasi masalah:
              Gerd, Asam Lambung, Insomnia, Anxiety, Panic Attack, Masalah Emosi dan
              Penyakit Psikosomatis.
            </p>
            <p>
              Hanya dengan Mengandalkan Kecerdasan Tubuh, Tanpa Perlu Bergantung Pada
              Siapapun, Tanpa Perlu Menceritakan Masalah Anda
            </p>
            <p>
              TRE adalah teknik yang berupa serangkaian gerakan senam sederhana, yang
              membuat otot-otot yang bertanggung jawab atas respon stress tubuh menjadi
              terkontraksi hingga tercipta rasa pegal, namun tidak sampai kelelahan.
            </p>
            <p>
              Setelah mencapai titik pegal tersebut, tubuh akan diminta untuk berbaring
              dalam keadaan relax dan senyaman mungkin.
            </p>
            <p>
              Perubahan dari kontraksi menjadi relax ini akan mengirimkan sinyal pada
              otak bahwa ketegangan dan bahaya telah berlalu, sehingga otak mengirimkan
              perintah pada tubuh untuk memunculkan refleks getar yang bersifat
              neurogenetik.
            </p>
            <p>
              Getaran inilah yang melepaskan ketegangan-ketegangan otot, sehingga
              memulihkan tubuh dari stress, trauma, kecemasan berlebih, anxiety, dan
              berbagai derita psikosomatis.
            </p>
          </article>

          <article className="tre-city-card">
            <h3>Apa yang akan dipelajari di seminar?</h3>
            <ul>
              <li>
                Memahami secara ilmiah bagaimana TRE bisa membantu melepaskan beban emosi
                dan penyakit psikosomatis tanpa obat, tanpa efek samping, tanpa perlu
                menceritakan masalah pribadi Anda.
              </li>
              <li>
                Memahami bagaimana stress dan trauma bisa menyebabkan psikosomatis dan
                kecemasan berlebih
              </li>
              <li>
                Menyadari bahwa tubuh Anda yang cerdas adalah solusi dari seluruh masalah
                Anda selama ini,
              </li>
              <li>
                Mengerti garis perintah kerja otak sehingga bisa memahami mengapa nasihat
                sering tidak berhasil.
              </li>
              <li>
                Memperoleh mindset yang tepat untuk menentukan apakah TRE memang cocok
                untuk Anda.
              </li>
            </ul>
            <p className="tre-city-strong">
              Sekarang ini TRE telah menyebar ke 39 kota di Indonesia.
            </p>
            <p className="tre-city-quote">
              "Selama 10 tahun ini, sudah lebih dari 20.000 orang merasakan
              manfaatnya." (Sudah lebih dari 1.000 angkatan : 663 kelas offline dan
              lebih dari 400 kelas online).
            </p>
            <p className="tre-city-strong">Kini Giliran Anda</p>
            <p className="tre-city-strong">BAGI 30 PENDAFTAR PERTAMA:</p>
            <div className="tre-city-bonus">
              Bonus Gratis : Buku "TRE" &amp; Video Tutorial "Teknik Energi Bumi"
              dengan total senilai Rp1.250.000
            </div>
          </article>

          <article className="tre-city-card tre-city-faq">
            <span className="tre-city-faq-eyebrow">FAQs</span>
            <h3>Jawaban untuk Pertanyaan Anda</h3>
            <div className="tre-city-faq-list">
              <details>
                <summary>Apa itu TRE?</summary>
                <p>
                  TRE (Tension & Trauma Releasing Exercises) adalah serangkaian latihan sederhana namun inovatif yang membantu tubuh melepaskan pola otot dalam dari stres, ketegangan, dan trauma. Dikembangkan oleh Dr. David Berceli, TRE menggunakan mekanisme refleks alami berupa gemetar atau bergetar untuk melepaskan ketegangan otot dan menenangkan sistem saraf, membantu tubuh kembali ke keadaan seimbang.
                </p>
              </details>
              <details>
                <summary>Bagaimana cara kerja TRE?</summary>
                <p>
                  TRE bekerja dengan mengaktifkan refleks gemetar alami yang membantu melepaskan stres dan ketegangan pada tingkat otot yang dalam. Refleks ini membantu merilekskan sistem saraf dan mengembalikan keseimbangan tanpa memerlukan fokus mental atau usaha fisik.

Karena metode berdasarkan kecerdasan Tubuh, Anda tidak perlu menceritakan masalah seperti sesi konseling pada umumnya.
                </p>
              </details>
              <details>
                <summary>Siapa yang bisa mendapatkan manfaat dari TRE?</summary>
                <p>
                  TRE bermanfaat bagi siapa saja yang mengalami stres, kecemasan, PTSD, ketegangan otot, sulit mengontrol emosi, gejala psikosomatis (di antaranya : Asam lambung, Gerd, susah tidur, kliyengan) atau mereka yang ingin meningkatkan kesejahteraan secara keseluruhan. Ini juga cocok untuk atlet dan performer yang ingin meningkatkan pemulihan dan kinerja.
                </p>
              </details>
              <details>
                <summary>Apakah TRE aman untuk semua orang?</summary>
                <p>
                  TRE umumnya aman untuk kebanyakan orang. Namun, individu dengan kondisi fisik atau psikologis tertentu harus berkonsultasi dengan Pengajar TRE bersertifikat sebelum memulai latihan ini.
                </p>
              </details>
              <details>
                <summary>Bisakah TRE digabungkan dengan terapi lain?</summary>
                <p>
                  Ya, TRE bisa menjadi praktik pelengkap yang efektif ketika digabungkan dengan modalitas perawatan lainnya, seperti psikoterapi, terapi fisik, atau program kesehatan.
                </p>
              </details>
              <details>
                <summary>Seberapa sering saya harus mempraktikkan TRE?</summary>
                <p>
                  Frekuensi latihan dapat bervariasi berdasarkan kebutuhan dan preferensi individu. Di pertemuan workshop, Anda akan mendapatkan arahan dari Pengajar TRE. Banyak orang mendapatkan manfaat dari mempraktikkan TRE dua kali seminggu, sementara yang lain mungkin berlatih lebih sering tergantung pada tingkat stres dan tujuan pribadi mereka.
                </p>
              </details>
              <details>
                <summary>Saya tidak tahu apakah saya bisa melakukan TRE?</summary>
                <p>
                  Tidak diperlukan syarat khusus untuk bisa melakukan latihan ini. Anak kecil sampai orangtua usia 85th bisa melakukan dengan aman. Meskipun Anda punya keterbatasan fisik, Pengajar TRE bersertifikasi akan membimbing Anda melakukan dengan cara yang aman.
                </p>
              </details>
              <details>
                <summary>Mengapa TRE bisa meningkatkan kualitas tidur?</summary>
                <p>
                  Tubuh secara intuitif mengetahui cara dan waktu untuk tidur. Kesulitan tidur hanyalah gejala bahwa ada sesuatu yang tidak seimbang dalam tubuh. Insomnia sering kali merupakan sinyal bahwa stres, kecemasan, dan ketegangan menyebabkan "mekanisme tidur" tidak berfungsi dengan baik. Relaksasi otot yang dalam, yang dipicu oleh TRE, mendorong tubuh untuk mengaktifkan respons istirahat dan relaksasi dari sistem saraf parasimpatis yang memungkinkan tubuh untuk tidur.
                </p>
              </details>
              <details>
                <summary>Bagaimana cara memulai dengan TRE?</summary>
                <p>
                  Cara terbaik untuk memulai belajar TRE adalah dengan pendampingan oleh Pembimbing TRE bersertifikasi. Anda dapat memulai dengan TRE dengan menghadiri workshop TRE Indonesia, mendaftar dalam kursus offline maupun online. Kami juga memberikan akses seumur hidup ke sesi latihan dan pertemuan komunitas untuk mendukung perjalanan Anda.
                </p>
              </details>
              <details>
                <summary>Apakah saya perlu ikut seminar TRE dahulu?</summary>
                <p>
                  Seminar ini berfungsi untuk memberi informasi tentang dampak dan berbagai teori ilmiah yang bisa memberikan peserta mindset yang tepat untuk berlatih teknik TRE sehingga latihan yang dilakukan akan berdampak optimal.
                </p>
              </details>
            </div>
          </article>
        </div>
      </section>

      <section
        className="cta-section"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/ocean.gif)`,
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

export default TreOnlinePage;
