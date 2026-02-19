import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import ScrollToTop from './components/ScrollToTop';
import ArtikelPage from './pages/ArtikelPage';
import ApaItuTrePage from './pages/ApaItuTrePage';
import BelajarTrePage from './pages/BelajarTrePage';
import HomePage from './pages/HomePage';
import KontakPage from './pages/KontakPage';
import TesKecemasanBerlebihPage from './pages/TesKecemasanBerlebihPage';
import TesKesehatanMentalPage from './pages/TesKesehatanMentalPage';
import TestimonialPage from './pages/TestimonialPage';
import TestimonialDetailPage from './pages/TestimonialDetailPage';
import TreIndividualsPage from './pages/TreIndividualsPage';
import TreIndividualCityPage from './pages/TreIndividualCityPage';
import TreOnlinePage from './pages/TreOnlinePage';
import PaymentPage from './pages/PaymentPage';
import KebijakanPrivasiPage from './pages/KebijakanPrivasiPage';
import KetentuanLayananPage from './pages/KetentuanLayananPage';
import FaqPage from './pages/FaqPage';
import CertifiedTreProviderPage from './pages/CertifiedTreProviderPage';

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const assetsToPreload = [
      '/assets/home/bg4.jpg',
      '/assets/home/TRE1.jpg',
      '/assets/home/bg-perp5.jpg',
      '/assets/home/waterfall.gif',
      '/assets/home/forest.gif',
      '/assets/home/apaitutre.jpg',
    ];

    assetsToPreload.forEach((asset) => {
      const img = new Image();
      img.src = `${process.env.PUBLIC_URL}${asset}`;
    });
  }, []);

  return (
    <div className="page">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apa-itu-tre" element={<ApaItuTrePage />} />
        <Route path="/tre-individuals" element={<TreIndividualsPage />} />
        <Route path="/tre-individuals/:city" element={<TreIndividualCityPage />} />
        <Route path="/tre-individuals/:city/payment" element={<PaymentPage />} />
        <Route path="/tre-online" element={<TreOnlinePage />} />
        <Route path="/belajar-tre" element={<BelajarTrePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route
          path="/certified-tre-provider"
          element={<CertifiedTreProviderPage />}
        />
        <Route path="/testimonial" element={<TestimonialPage />} />
        <Route path="/testimonial/:slug" element={<TestimonialDetailPage />} />
        <Route path="/artikel" element={<ArtikelPage />} />
        <Route path="/tes-kesehatan-mental" element={<TesKesehatanMentalPage />} />
        <Route
          path="/tes-kecemasan-berlebih-anxiety"
          element={<TesKecemasanBerlebihPage />}
        />
        <Route path="/kontak" element={<KontakPage />} />
        <Route path="/kebijakan-privasi" element={<KebijakanPrivasiPage />} />
        <Route path="/ketentuan-layanan" element={<KetentuanLayananPage />} />
      </Routes>
      <Footer />
      <WhatsAppWidget />
      <button
        className={`scroll-top${showScrollTop ? '' : ' hidden'}`}
        type="button"
        aria-label="Kembali ke atas"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M6 14l6-6 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default App;
