import NavBar from '../components/NavBar';

function KetentuanLayananPage() {
  return (
    <div className="privacy-page">
      <header
        className="privacy-hero"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/layanan.jpg)`,
        }}
      >
        <NavBar />
        <div className="privacy-hero-inner">
          <h1>Ketentuan Layanan</h1>
        </div>
      </header>

      <main className="privacy-content">
        <div className="privacy-container">
          <section className="privacy-section">
            <h2>Interpretasi dan Definisi</h2>

            <h3>1. Penerimaan Syarat dan Ketentuan</h3>
            <p>
              Dengan menggunakan layanan kami, Anda menyetujui dan terikat oleh
              syarat dan ketentuan berikut. Harap baca dengan cermat sebelum
              menggunakan situs web atau layanan kami.
            </p>

            <h3>2. Perubahan Layanan</h3>
            <p>
              Kami berhak untuk mengubah atau menghentikan layanan kami kapan
              saja, baik secara sementara maupun permanen, tanpa pemberitahuan
              terlebih dahulu. Kami tidak bertanggung jawab atas kerugian atau
              dampak yang ditimbulkan akibat perubahan tersebut.
            </p>

            <h3>3. Kewajiban Pengguna</h3>
            <p>Sebagai pengguna layanan kami, Anda setuju untuk:</p>
            <ul>
              <li>Menggunakan layanan kami hanya untuk tujuan yang sah.</li>
              <li>
                Tidak melanggar hak kekayaan intelektual atau hak lainnya.
              </li>
              <li>
                Tidak menggunakan layanan kami untuk mendistribusikan konten yang
                melanggar hukum, menyinggung, atau merugikan.
              </li>
            </ul>

            <h3>4. Pembayaran dan Pengembalian Dana</h3>
            <p>
              Semua pembayaran yang dilakukan untuk layanan kami adalah final dan
              tidak dapat dikembalikan, kecuali dinyatakan lain dalam kebijakan
              pengembalian dana kami.
            </p>

            <h3>5. Batasan Tanggung Jawab</h3>
            <p>
              Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung,
              insidental, atau konsekuensial yang mungkin timbul dari penggunaan
              layanan kami. Penggunaan layanan ini sepenuhnya adalah risiko Anda
              sendiri.
            </p>

            <h3>6. Penyelesaian Sengketa</h3>
            <p>
              Setiap sengketa yang timbul dari penggunaan layanan ini akan
              diselesaikan secara damai melalui negosiasi antara kedua belah
              pihak. Jika tidak dapat diselesaikan, sengketa akan diselesaikan
              melalui mekanisme hukum yang berlaku.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default KetentuanLayananPage;
