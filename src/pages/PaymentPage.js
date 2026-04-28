import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { findCityBySlug } from '../data/treCityData';
import {
  ONLINE_DELIVERY_FEE,
  PAYMENT_COUPON_LOOKUP,
  getCouponDiscount,
  normalizeCouponCode,
} from '../data/paymentConfig';
import { getCurrentUtmParams, toServerUtmPayload } from '../utils/utm';

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
const formatCurrency = (amount) => `Rp ${amount.toLocaleString('id-ID')}`;
const getStoredPaymentUrlKey = (orderId) => `midtrans-payment-url:${orderId}`;

const saveStoredPaymentUrl = (orderId, redirectUrl) => {
  if (!orderId || !redirectUrl || typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(getStoredPaymentUrlKey(orderId), redirectUrl);
};

const readStoredPaymentUrl = (orderId) => {
  if (!orderId || typeof window === 'undefined') {
    return '';
  }

  return window.sessionStorage.getItem(getStoredPaymentUrlKey(orderId)) || '';
};

const removeStoredPaymentUrl = (orderId) => {
  if (!orderId || typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(getStoredPaymentUrlKey(orderId));
};

function PaymentPage({ seminarSlug: forcedSeminarSlug }) {
  const { city: routeCitySlug } = useParams();
  const citySlug = forcedSeminarSlug || routeCitySlug;
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const city = findCityBySlug(citySlug);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    whatsapp: '',
    domicile: '',
    shippingAddress: '',
    shippingDistrict: '',
    shippingPostalCode: '',
    shippingCity: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isOrderRemoved, setIsOrderRemoved] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [resumePaymentUrl, setResumePaymentUrl] = useState('');

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

  const isOnlineSeminar = seminar?.slug === ONLINE_SEMINAR_SLUG;
  const seminarPrice = seminar?.price || DEFAULT_SEMINAR_PRICE;
  const subtotal = isOrderRemoved ? 0 : seminarPrice;
  const deliveryFee = isOnlineSeminar && !isOrderRemoved ? ONLINE_DELIVERY_FEE : 0;
  const appliedCoupon = useMemo(
    () => PAYMENT_COUPON_LOOKUP[appliedCouponCode] || null,
    [appliedCouponCode]
  );
  const couponDiscount = useMemo(
    () => getCouponDiscount(appliedCoupon, subtotal),
    [appliedCoupon, subtotal]
  );
  const totalAmount = Math.max(0, subtotal + deliveryFee - couponDiscount);

  useEffect(() => {
    setResumePaymentUrl(readStoredPaymentUrl(orderId));
  }, [orderId]);

  useEffect(() => {
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
          const resolvedStatus =
            payload.status_label || redirectedTransactionStatus || redirectedStatus || '';

          setPaymentStatus(resolvedStatus);
          setStatusNote(
            STATUS_COPY[resolvedStatus]?.message ||
              `Status pembayaran saat ini: ${
                payload.transaction_status || redirectedTransactionStatus || 'tidak diketahui'
              }.`
          );

          if (resolvedStatus === 'pending') {
            setResumePaymentUrl(readStoredPaymentUrl(orderId));
          } else {
            removeStoredPaymentUrl(orderId);
            setResumePaymentUrl('');
          }
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
  }, [orderId, searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCouponApply = () => {
    const normalizedCode = normalizeCouponCode(couponInput);
    const matchedCoupon = PAYMENT_COUPON_LOOKUP[normalizedCode];

    if (!normalizedCode) {
      setAppliedCouponCode('');
      setCouponMessage('Masukkan kode kupon terlebih dahulu.');
      return;
    }

    if (!matchedCoupon) {
      setAppliedCouponCode('');
      setCouponMessage('Kupon tidak valid atau belum aktif.');
      return;
    }

    setAppliedCouponCode(normalizedCode);
    setCouponMessage(`Kupon ${normalizedCode} berhasil diterapkan.`);
  };

  const handleRemoveItem = () => {
    setIsOrderRemoved(true);
    setAppliedCouponCode('');
    setCouponInput('');
    setCouponMessage('');
    setErrorMessage('');
  };

  const handleRestoreItem = () => {
    setIsOrderRemoved(false);
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (isOrderRemoved) {
      setErrorMessage('Pesanan kosong. Tambahkan seminar terlebih dahulu.');
      return;
    }

    if (totalAmount <= 0) {
      setErrorMessage('Total pembayaran harus lebih besar dari Rp 0.');
      return;
    }

    if (
      isOnlineSeminar &&
      (!formValues.shippingAddress.trim() ||
        !formValues.shippingDistrict.trim() ||
        !formValues.shippingPostalCode.trim() ||
        !formValues.shippingCity.trim())
    ) {
      setErrorMessage('Alamat pengiriman buku wajib diisi lengkap.');
      return;
    }

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
          ...(isOnlineSeminar
            ? {
                shippingAddress: {
                  address: formValues.shippingAddress,
                  district: formValues.shippingDistrict,
                  postalCode: formValues.shippingPostalCode,
                  city: formValues.shippingCity,
                },
              }
            : {}),
          couponCode: appliedCouponCode,
          utm: toServerUtmPayload(getCurrentUtmParams(searchParams)),
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

      saveStoredPaymentUrl(payload.order_id, payload.redirect_url);
      window.location.href = payload.redirect_url;
    } catch (error) {
      setErrorMessage(error.message || 'Terjadi kesalahan. Coba lagi.');
      setIsSubmitting(false);
    }
  };

  const handleResumePayment = () => {
    if (!resumePaymentUrl) {
      setErrorMessage('Link pembayaran tidak ditemukan. Silakan buat pesanan baru.');
      return;
    }

    window.location.href = resumePaymentUrl;
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
        className="payment-hero tre-individual-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/atmosphere.jpg)`,
        }}
      >
        <NavBar />
        <div className="tre-individual-hero-inner">
          <h1>Pembayaran Seminar</h1>
        </div>
      </header>

      <section
        className="payment-section"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/clouds.jpg)`,
        }}
      >
        <div className="payment-container">
          <form
            id="payment-checkout-form"
            className="payment-form payment-panel"
            onSubmit={handleSubmit}
          >
            <div className="payment-panel-header">
              <h2>Detail Pendaftar</h2>
            </div>
            {paymentStatus ? (
              <div className="payment-error">
                <strong>{STATUS_COPY[paymentStatus]?.title || 'Status pembayaran'}</strong>
                <br />
                {statusNote}
                {paymentStatus === 'pending' && resumePaymentUrl ? (
                  <button
                    className="payment-submit payment-resume-button"
                    type="button"
                    onClick={handleResumePayment}
                  >
                    Lanjutkan Pembayaran
                  </button>
                ) : null}
              </div>
            ) : null}
            <label>
              <span>Nama Lengkap *</span>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Nama Lengkap"
                required
              />
            </label>
            <label>
              <span>Email *</span>
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
              <span>No Whatsapp *</span>
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
              <span>Kota Domisili *</span>
              <input
                type="text"
                name="domicile"
                value={formValues.domicile}
                onChange={handleChange}
                placeholder="Kota Domisili"
                required
              />
            </label>

            {isOnlineSeminar ? (
              <div className="payment-shipping-fields">
                <h3>Alamat Pengiriman Buku</h3>
                <label>
                  <span>Alamat Lengkap *</span>
                  <textarea
                    name="shippingAddress"
                    value={formValues.shippingAddress}
                    onChange={handleChange}
                    placeholder="Alamat Lengkap"
                    rows="3"
                    required
                  />
                </label>
                <label>
                  <span>Kecamatan *</span>
                  <input
                    type="text"
                    name="shippingDistrict"
                    value={formValues.shippingDistrict}
                    onChange={handleChange}
                    placeholder="Kecamatan"
                    required
                  />
                </label>
                <label>
                  <span>Kode Pos *</span>
                  <input
                    type="text"
                    name="shippingPostalCode"
                    value={formValues.shippingPostalCode}
                    onChange={handleChange}
                    placeholder="Kode Pos"
                    inputMode="numeric"
                    pattern="[0-9]{5}"
                    title="Kode pos berisi 5 angka"
                    required
                  />
                </label>
                <label>
                  <span>Kota *</span>
                  <input
                    type="text"
                    name="shippingCity"
                    value={formValues.shippingCity}
                    onChange={handleChange}
                    placeholder="Kota"
                    required
                  />
                </label>
              </div>
            ) : null}

            {errorMessage ? <div className="payment-error">{errorMessage}</div> : null}

            <button
              className="payment-submit payment-submit-inline"
              type="submit"
              disabled={isSubmitting || isOrderRemoved}
            >
              {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
            </button>
          </form>

          <aside className="payment-sidebar">
            <section className="payment-summary payment-panel payment-summary-panel">
              <div className="payment-panel-header">
                <h2>Rincian Pesanan</h2>
              </div>
              {isOrderRemoved ? (
                <div className="payment-summary-empty">
                  <p>Pesanan kosong.</p>
                  <button
                    className="payment-summary-restore"
                    type="button"
                    onClick={handleRestoreItem}
                  >
                    Tambahkan seminar lagi
                  </button>
                </div>
              ) : (
                <>
                  <div className="payment-summary-head">
                    <span>Produk</span>
                    <span>Subtotal</span>
                  </div>
                  <div className="payment-summary-item">
                    <div className="payment-summary-product">
                      <strong>{orderLabel}</strong>
                      <div className="payment-summary-controls">
                        <button
                          className="payment-summary-control payment-summary-control-remove"
                          type="button"
                          onClick={handleRemoveItem}
                          aria-label={`Hapus ${orderLabel}`}
                        >
                          -
                        </button>
                        <span className="payment-summary-qty">1</span>
                        <button
                          className="payment-summary-control payment-summary-control-add"
                          type="button"
                          disabled
                          aria-label="Jumlah maksimal 1"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span>{formatCurrency(seminarPrice)}</span>
                  </div>
                </>
              )}
              {isOnlineSeminar && !isOrderRemoved ? (
                <div className="payment-summary-row">
                  <span>Biaya Ongkir</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
              ) : null}
              <div className="payment-summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {appliedCoupon ? (
                <div className="payment-summary-row payment-summary-row-discount">
                  <span>Diskon ({appliedCoupon.code})</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              ) : null}
              <div className="payment-summary-total">
                <span>Total</span>
                <strong>{formatCurrency(totalAmount)}</strong>
              </div>
            </section>

            <section className="payment-coupon payment-panel payment-coupon-panel">
              <p>
                Punya kupon?{' '}
                <button
                  className="payment-coupon-trigger"
                  type="button"
                  onClick={() => setIsCouponOpen((current) => !current)}
                >
                  klik di sini
                </button>
              </p>
              {isCouponOpen ? (
                <div className="payment-coupon-form">
                  <p>If you have a coupon code, please apply it below.</p>
                  <div className="payment-coupon-fields">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(event) => setCouponInput(event.target.value)}
                      placeholder="Coupon code"
                    />
                    <button type="button" onClick={handleCouponApply}>
                      Apply
                    </button>
                  </div>
                  {couponMessage ? (
                    <p
                      className={`payment-coupon-message${
                        appliedCoupon ? ' is-success' : ' is-error'
                      }`}
                    >
                      {couponMessage}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </section>

          </aside>
        </div>
      </section>
    </div>
  );
}

export default PaymentPage;
