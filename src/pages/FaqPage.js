import NavBar from '../components/NavBar';

const faqItems = [
  {
    question: 'Apa itu TRE?',
    answer:
      'TRE (Tension & Trauma Releasing Exercises) adalah serangkaian latihan sederhana namun inovatif yang membantu tubuh melepaskan pola otot dalam dari stres, ketegangan, dan trauma. Dikembangkan oleh Dr. David Berceli, TRE menggunakan mekanisme refleks alami berupa gemetar atau bergetar untuk melepaskan ketegangan otot dan menenangkan sistem saraf, membantu tubuh kembali ke keadaan seimbang.',
  },
  {
    question: 'Bagaimana cara kerja TRE?',
    answer:
      'TRE bekerja dengan mengaktifkan refleks gemetar alami yang membantu melepaskan stres dan ketegangan pada tingkat otot yang dalam. Refleks ini membantu merilekskan sistem saraf dan mengembalikan keseimbangan tanpa memerlukan fokus mental atau usaha fisik. Karena metode berdasarkan kecerdasan Tubuh, Anda tidak perlu menceritakan masalah seperti sesi konseling pada umumnya.',
  },
  {
    question: 'Siapa yang bisa mendapatkan manfaat dari TRE?',
    answer:
      'TRE bermanfaat bagi siapa saja yang mengalami stres, kecemasan, PTSD, ketegangan otot, sulit mengontrol emosi, gejala psikosomatis (di antaranya : Asam lambung, Gerd, susah tidur, kliyengan) atau mereka yang ingin meningkatkan kesejahteraan secara keseluruhan. Ini juga cocok untuk atlet dan performer yang ingin meningkatkan pemulihan dan kinerja.',
  },
  {
    question: 'Apakah TRE aman untuk semua orang?',
    answer:
      'TRE umumnya aman untuk kebanyakan orang. Namun, individu dengan kondisi fisik atau psikologis tertentu harus berkonsultasi dengan Pengajar TRE bersertifikat sebelum memulai latihan ini.',
  },
  {
    question: 'Bisakah TRE digabungkan dengan terapi lain?',
    answer:
      'Ya, TRE bisa menjadi praktik pelengkap yang efektif ketika digabungkan dengan modalitas perawatan lainnya, seperti psikoterapi, terapi fisik, atau program kesehatan.',
  },
  {
    question: 'Seberapa sering saya harus mempraktikkan TRE?',
    answer:
      'Frekuensi latihan dapat bervariasi berdasarkan kebutuhan dan preferensi individu. Di pertemuan workshop, Anda akan mendapatkan arahan dari Pengajar TRE. Banyak orang mendapatkan manfaat dari mempraktikkan TRE dua kali seminggu, sementara yang lain mungkin berlatih lebih sering tergantung pada tingkat stres dan tujuan pribadi mereka.',
  },
  {
    question: 'Saya tidak tahu apakah saya bisa melakukan TRE?',
    answer:
      'Tidak diperlukan syarat khusus untuk bisa melakukan latihan ini. Anak kecil sampai orangtua usia 85th bisa melakukan dengan aman. Meskipun Anda punya keterbatasan fisik, Pengajar TRE bersertifikasi akan membimbing Anda melakukan dengan cara yang aman.',
  },
  {
    question: 'Mengapa TRE bisa meningkatkan kualitas tidur?',
    answer:
      'Tubuh secara intuitif mengetahui cara dan waktu untuk tidur. Kesulitan tidur hanyalah gejala bahwa ada sesuatu yang tidak seimbang dalam tubuh. Insomnia sering kali merupakan sinyal bahwa stres, kecemasan, dan ketegangan menyebabkan "mekanisme tidur" tidak berfungsi dengan baik. Relaksasi otot yang dalam, yang dipicu oleh TRE, mendorong tubuh untuk mengaktifkan respons istirahat dan relaksasi dari sistem saraf parasimpatis yang memungkinkan tubuh untuk tidur.',
  },
  {
    question: 'Bagaimana cara memulai dengan TRE?',
    answer:
      'Cara terbaik untuk memulai belajar TRE adalah dengan pendampingan oleh Pembimbing TRE bersertifikasi. Anda dapat memulai dengan TRE dengan menghadiri workshop TRE Indonesia, mendaftar dalam kursus offline maupun online. Kami juga memberikan akses seumur hidup ke sesi latihan dan pertemuan komunitas untuk mendukung perjalanan Anda.',
  },
  {
    question: 'Apakah saya perlu ikut seminar TRE dahulu?',
    answer:
      'Seminar ini berfungsi untuk memberi informasi tentang dampak dan berbagai teori ilmiah yang bisa memberikan peserta mindset yang tepat untuk berlatih teknik TRE sehingga latihan yang dilakukan akan berdampak optimal.',
  },
];

function FaqPage() {
  return (
    <div className="testimonial-page faq-page">
      <header
        className="tre-about-hero testimonial-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/faq.jpg)`,
        }}
      >
        <NavBar className="nav-mobile-surface-light" />
        <div className="tre-about-hero-inner">
          <div className="tre-about-hero-copy">
            <h1 className="faq-hero-title">Frequently Asked Questions</h1>
          </div>
        </div>
      </header>

      <section className="tre-about-section faq-content-section">
        <div className="tre-about-container faq-content-container">
          <div className="tre-city-faq-list faq-list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="cta-section cta-northlights"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/faq.gif)`,
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

export default FaqPage;
