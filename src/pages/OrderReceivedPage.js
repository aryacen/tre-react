import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

function OrderReceivedPage() {
  return (
    <div className="order-received-page">
      <header
        className="payment-hero tre-individual-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/atmosphere.jpg)`,
        }}
      >
        <NavBar />
        <div className="tre-individual-hero-inner">
          <h1>Pesanan Diterima</h1>
        </div>
      </header>

      <section
        className="order-received-section"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/clouds.jpg)`,
        }}
      >
        <div className="order-received-card">
          <p>
            Terima kasih. Pesanan anda telah diterima. Informasi pembayaran telah
            dikirim ke email dan Whatsapp.
          </p>
          <Link className="order-received-home" to="/">
            Kembali ke beranda
          </Link>
        </div>
      </section>
    </div>
  );
}

export default OrderReceivedPage;
