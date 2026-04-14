import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { findCityBySlug } from '../data/treCityData';

const DEFAULT_SEMINAR_PRICE = 299000;
const ONLINE_SEMINAR_SLUG = 'online';
const ONLINE_SEMINAR = {
  slug: ONLINE_SEMINAR_SLUG,
  name: 'Seminar TRE Online',
  price: 199000,
  backLink: '/tre-online',
  backLabel: 'Kembali ke TRE Online',
};
const STATUS_COPY = {
  success: {
    title: 'Pembayaran sedang diverifikasi',
    message:
      'Anda sudah kembali dari halaman Midtrans. Status akhir pembayaran tetap akan mengikuti hasil verifikasi dari Midtrans.',
  },
  pending: {
    title: 'Pembayaran masih menunggu',
    message:
      'Transaksi Anda masih berstatus pending. Silakan selesaikan pembayaran di Midtrans lalu kembali cek statusnya di halaman ini.',
  },
  failed: {
    title: 'Pembayaran belum berhasil',
    message:
      'Transaksi tidak berhasil diselesaikan. Anda bisa mencoba lagi untuk membuat pembayaran baru.',
  },
  paid: {
    title: 'Pembayaran berhasil',
    message:
      'Pembayaran Anda sudah diterima. Tim akan menindaklanjuti konfirmasi melalui email atau WhatsApp.',
  },
  challenge: {
    title: 'Pembayaran perlu ditinjau',
    message:
      'Transaksi Anda sedang ditinjau oleh sistem pembayaran. Tim akan mengecek status akhirnya terlebih dahulu.',
  },
};

function PaymentPage({ seminarSlug: forcedSeminarSlug }) {
  const { city: routeCitySlug } = useParams();
  const citySlug = forcedSeminarSlug || routeCitySlug;
  const [searchParams] = useSearchParams();
  const city = findCityBySlug(citySlug);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    whatsapp: '',
    domicile: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const seminar = useMemo(() => {
    if (city) {
      return {
        slug: city.slug,
        name: `Seminar TRE ${city.name}`,
        price: DEFAULT_SEMINAR_PRICE,
        backLink: '/tre-individuals',
        backLabel: 'Lihat semua kota',
      };
    }

    if (citySlug === ONLINE_SEMINAR_SLUG) {
      return ONLINE_SEMINAR;
    }

    return null;
  }, [city, citySlug]);

  const orderLabel = useMemo(() => {
    if (!seminar) return 'Seminar TRE';
    return seminar.name;
  }, [seminar]);

  const seminarPrice = seminar?.price || DEFAULT_SEMINAR_PRICE;

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const redirectedTransactionStatus = searchParams.get('transaction_status');
    const redirectedStatus = searchParams.get('status');

    if (!orderId) {
      if (redirectedStatus && STATUS_COPY[redirectedStatus]) {
        setPaymentStatus(redirectedStatus);
        setStatusNote(STATUS_COPY[redirectedStatus].message);
      }
      return undefined;
    }

    let isCancelled = false;

    const loadStatus = async () => {
      try {
        const response = await fetch(
          `/api/midtrans/transactions/${encodeURIComponent(orderId)}/status`
        );
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.message || 'Gagal mengambil status pembayaran.');
        }

        if (!isCancelled) {
          setPaymentStatus(payload.status_label || redirectedTransactionStatus || redirectedStatus || '');
          setStatusNote(
            STATUS_COPY[payload.status_label]?.message ||
              `Status pembayaran saat ini: ${
                payload.transaction_status || redirectedTransactionStatus || 'tidak diketahui'
              }.`
          );
        }
      } catch (error) {
        if (!isCancelled) {
          setPaymentStatus(redirectedTransactionStatus || redirectedStatus || '');
          setStatusNote(
            error.message ||
              'Status pembayaran belum bisa diambil. Silakan cek kembali beberapa saat lagi.'
          );
        }
      }
    };

    loadStatus();

    return () => {
      isCancelled = true;
    };
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/midtrans/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: citySlug,
          cityName: seminar?.name,
          name: formValues.name,
          email: formValues.email,
          whatsapp: formValues.whatsapp,
          domicile: formValues.domicile,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Gagal membuat transaksi.');
      }

      const payload = await response.json();
      if (!payload?.redirect_url) {
        throw new Error('Redirect URL Midtrans tidak ditemukan.');
      }

      window.location.href = payload.redirect_url;
    } catch (error) {
      setErrorMessage(error.message || 'Terjadi kesalahan. Coba lagi.');
      setIsSubmitting(false);
    }
  };

  if (!seminar) {
    return (
      <div className="payment-page">
        <header className="payment-hero">
          <NavBar />
          <div className="payment-hero-inner">
            <h1>Seminar tidak ditemukan</h1>
            <p>Silakan kembali ke halaman seminar TRE.</p>
            <Link className="payment-back" to="/belajar-tre">
              Lihat semua layanan
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
            {paymentStatus ? (
              <div className="payment-error">
                <strong>{STATUS_COPY[paymentStatus]?.title || 'Status pembayaran'}</strong>
                <br />
                {statusNote}
              </div>
            ) : null}
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
              <span>Rp {seminarPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="payment-summary-total">
              <span>Total</span>
              <strong>Rp {seminarPrice.toLocaleString('id-ID')}</strong>
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
