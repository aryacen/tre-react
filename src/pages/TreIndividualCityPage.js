import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { findCityBySlug } from '../data/treCityData';

function TreIndividualCityPage() {
  const { city: citySlug } = useParams();
  const city = findCityBySlug(citySlug);
  const waktuLabel =
    city?.waktuDate === 'Segera diumumkan'
      ? city.waktuDate
      : `${city.waktuDate} | ${city.waktuTime}${city.timezone ? ` ${city.timezone}` : ''}`;

  if (!city) {
    return (
      <div className="tre-city-page">
        <header className="tre-city-hero">
          <NavBar />
          <div className="tre-city-hero-inner">
            <h1>Kota tidak ditemukan</h1>
            <p>Silakan kembali ke daftar kota seminar TRE.</p>
            <Link className="tre-city-back" to="/tre-individuals">
              Kembali ke daftar kota
            </Link>
          </div>
        </header>
      </div>
    );
  }

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
          <h1>TRE For Individuals</h1>
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
                src={`${process.env.PUBLIC_URL}/assets/home/${city.image}`}
                alt={`Seminar TRE ${city.name}`}
              />
            </div>
            <h2 className="tre-city-banner-title">Seminar TRE {city.name}</h2>
          </div>
        </div>

        <div className="tre-city-summary">
          <div className="tre-city-info">
            <div className="tre-city-info-inner">
              <div className="tre-city-info-grid">
                <div className="tre-city-info-card">
                  <span>Waktu</span>
                  <strong>{waktuLabel}</strong>
                </div>
                <div className="tre-city-info-card">
                  <span>Lokasi</span>
                  <strong>{city.lokasi}</strong>
                </div>
              </div>
              <div className="tre-city-action-card">
                <div className="tre-city-price">
                  <span className="tre-city-price-old">Rp 598.000</span>
                  <span className="tre-city-price-new">Rp 299.000</span>
                </div>
                <Link
                  className="tre-city-cta"
                  to={`/tre-individuals/${city.slug}/payment`}
                >
                  Daftar Seminar
                </Link>
              </div>
            </div>
          </div>

          <div className="tre-city-speaker-wrap">
            <article className="tre-city-card tre-city-speaker">
              <h3>Pembicara</h3>
              <div className="tre-city-speaker-profile">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/home/${city.speaker.image}`}
                  alt={city.speaker.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = `${process.env.PUBLIC_URL}/assets/home/${city.speaker.fallbackImage}`;
                  }}
                />
                <div>
                  <h4>{city.speaker.name}</h4>
                  <ul>
                    {city.speaker.roles.map((role) => (
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

        </div>
      </section>

      <section
        className="cta-section"
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

export default TreIndividualCityPage;
