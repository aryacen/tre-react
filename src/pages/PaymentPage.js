import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { findCityBySlug } from '../data/treCityData';

const SEMINAR_PRICE = 299000;

function PaymentPage() {
  const { city: citySlug } = useParams();
  const city = findCityBySlug(citySlug);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    whatsapp: '',
    domicile: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const orderLabel = useMemo(() => {
    if (!city) return 'Seminar TRE';
    return `Seminar TRE ${city.name}`;
  }, [city]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/xendit/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: citySlug,
          cityName: city?.name,
          name: formValues.name,
          email: formValues.email,
          whatsapp: formValues.whatsapp,
          domicile: formValues.domicile,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Gagal membuat invoice.');
      }

      const payload = await response.json();
      if (!payload?.invoice_url) {
        throw new Error('Invoice URL tidak ditemukan.');
      }

      window.location.href = payload.invoice_url;
    } catch (error) {
      setErrorMessage(error.message || 'Terjadi kesalahan. Coba lagi.');
      setIsSubmitting(false);
    }
  };

  if (!city) {
    return (
      <div className="payment-page">
        <header className="payment-hero">
          <NavBar />
          <div className="payment-hero-inner">
            <h1>Kota tidak ditemukan</h1>
            <p>Silakan kembali ke daftar kota seminar TRE.</p>
            <Link className="payment-back" to="/tre-individuals">
              Lihat semua kota
            </Link>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <header
        className="payment-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/atmosphere.jpg)`,
        }}
      >
        <NavBar />
        <div className="payment-hero-inner">
          <h1>Pembayaran Seminar</h1>
          <p>Informasi pembayaran akan dikirim melalui WhatsApp &amp; Email.</p>
        </div>
      </header>

      <section className="payment-section">
        <div className="payment-container">
          <form className="payment-form" onSubmit={handleSubmit}>
            <h2>Detail Pendaftar</h2>
            <label>
              Nama lengkap *
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Nama lengkap"
                required
              />
            </label>
            <label>
              Email *
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </label>
            <label>
              Nomor Whatsapp *
              <input
                type="tel"
                name="whatsapp"
                value={formValues.whatsapp}
                onChange={handleChange}
                placeholder="No Whatsapp"
                required
              />
            </label>
            <label>
              Kota Domisili *
              <input
                type="text"
                name="domicile"
                value={formValues.domicile}
                onChange={handleChange}
                placeholder="Kota Domisili"
                required
              />
            </label>

            {errorMessage ? <div className="payment-error">{errorMessage}</div> : null}

            <button className="payment-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
            </button>
          </form>

          <aside className="payment-summary">
            <h2>Rincian Pesanan</h2>
            <div className="payment-summary-row">
              <span>{orderLabel}</span>
              <span>Rp {SEMINAR_PRICE.toLocaleString('id-ID')}</span>
            </div>
            <div className="payment-summary-total">
              <span>Total</span>
              <strong>Rp {SEMINAR_PRICE.toLocaleString('id-ID')}</strong>
            </div>
            <p className="payment-summary-note">
              Setelah pembayaran berhasil, Anda akan menerima konfirmasi melalui email dan WhatsApp.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default PaymentPage;
