import NavBar from '../components/NavBar';

function KebijakanPrivasiPage() {
  return (
    <div className="privacy-page">
      <header
        className="privacy-hero"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/privasi.jpg)`,
        }}
      >
        <NavBar />
        <div className="privacy-hero-inner">
          <h1>Kebijakan Privasi</h1>
        </div>
      </header>

      <main className="privacy-content">
        <div className="privacy-container">
          <p className="privacy-updated">Terakhir diperbarui: 13 Agustus 2024</p>
          <p>
            Kebijakan Privasi ini menjelaskan kebijakan dan prosedur Kami mengenai
            pengumpulan, penggunaan, dan pengungkapan informasi Anda saat Anda
            menggunakan Layanan dan memberi tahu Anda tentang hak privasi Anda
            dan bagaimana hukum melindungi Anda.
          </p>
          <p>
            Kami menggunakan Data Pribadi Anda untuk menyediakan dan meningkatkan
            Layanan. Dengan menggunakan Layanan, Anda menyetujui pengumpulan dan
            penggunaan informasi sesuai dengan Kebijakan Privasi ini.
          </p>

          <section className="privacy-section">
            <h2>Interpretasi dan Definisi</h2>
            <h3>Interpretasi</h3>
            <p>
              Kata-kata yang huruf awalnya diawali dengan huruf kapital memiliki
              makna yang ditetapkan berdasarkan ketentuan berikut. Definisi
              berikut akan memiliki makna yang sama terlepas dari apakah kata-kata
              tersebut muncul dalam bentuk tunggal atau jamak.
            </p>

            <h3>Definisi</h3>
            <p>Untuk tujuan Kebijakan Privasi ini:</p>
            <ul>
              <li>
                Akun berarti akun unik yang dibuat bagi Anda untuk mengakses
                Layanan kami atau bagian dari Layanan kami.
              </li>
              <li>
                Afiliasi berarti suatu badan usaha yang mengendalikan,
                dikendalikan oleh, atau berada di bawah kendali bersama dengan
                suatu pihak, di mana “kendali” berarti kepemilikan atas 50% atau
                lebih saham, kepentingan ekuitas, atau sekuritas lain yang berhak
                memberikan suara untuk pemilihan direktur atau otoritas pengelola
                lainnya.
              </li>
              <li>
                Perusahaan (disebut sebagai “Perusahaan”, “Kami”, “Kita” atau
                “Milik Kami” dalam Perjanjian ini) mengacu pada TRE Indonesia.
              </li>
              <li>
                Cookie merupakan berkas kecil yang ditempatkan pada komputer
                Anda, perangkat seluler, atau perangkat lainnya oleh suatu situs
                web, yang berisi rincian riwayat penelusuran Anda di situs web
                tersebut di antara sekian banyak kegunaannya.
              </li>
              <li>Negara mengacu pada: Indonesia</li>
              <li>
                Perangkat berarti perangkat apa pun yang dapat mengakses Layanan
                seperti komputer, ponsel, atau tablet digital.
              </li>
              <li>
                Data Pribadi adalah informasi apa pun yang berkaitan dengan
                individu yang teridentifikasi atau dapat diidentifikasi.
              </li>
              <li>Layanan mengacu pada Situs Web.</li>
              <li>
                Penyedia Layanan berarti setiap orang atau badan hukum yang
                memproses data atas nama Perusahaan. Ini merujuk pada perusahaan
                pihak ketiga atau individu yang dipekerjakan oleh Perusahaan
                untuk memfasilitasi Layanan, menyediakan Layanan atas nama
                Perusahaan, melakukan layanan yang terkait dengan Layanan, atau
                membantu Perusahaan dalam menganalisis cara penggunaan Layanan.
              </li>
              <li>
                Data Penggunaan mengacu pada data yang dikumpulkan secara
                otomatis, baik yang dihasilkan oleh penggunaan Layanan atau dari
                infrastruktur Layanan itu sendiri (misalnya, durasi kunjungan
                halaman).
              </li>
              <li>
                Situs web mengacu pada TRE Indonesia, dapat diakses dari
                treindonesia.com
              </li>
              <li>
                Anda berarti individu yang mengakses atau menggunakan Layanan,
                atau perusahaan, atau badan hukum lain yang atas namanya individu
                tersebut mengakses atau menggunakan Layanan, sebagaimana berlaku.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>Pengumpulan dan Penggunaan Data Pribadi Anda</h2>
            <h3>Jenis Data yang Dikumpulkan</h3>
            <h4>Data Pribadi</h4>
            <p>
              Saat menggunakan Layanan Kami, Kami mungkin meminta Anda untuk
              memberikan Kami informasi pengenal pribadi tertentu yang dapat
              digunakan untuk menghubungi atau mengidentifikasi Anda. Informasi
              pengenal pribadi dapat mencakup, tetapi tidak terbatas pada:
            </p>
            <ul>
              <li>Alamat email</li>
              <li>Nama depan dan nama belakang</li>
              <li>Nomor telepon</li>
              <li>Alamat, Negara Bagian, Provinsi, Kode Pos, Kota</li>
              <li>Data Penggunaan</li>
            </ul>

            <h4>Data Penggunaan</h4>
            <p>Data Penggunaan dikumpulkan secara otomatis saat menggunakan Layanan.</p>
            <p>
              Data Penggunaan dapat mencakup informasi seperti alamat Protokol
              Internet Perangkat Anda (misalnya alamat IP), jenis browser, versi
              browser, halaman Layanan kami yang Anda kunjungi, waktu dan tanggal
              kunjungan Anda, waktu yang dihabiskan di halaman tersebut, pengenal
              perangkat unik, dan data diagnostik lainnya.
            </p>
            <p>
              Saat Anda mengakses Layanan melalui perangkat seluler, Kami dapat
              mengumpulkan informasi tertentu secara otomatis, termasuk, namun
              tidak terbatas pada, jenis perangkat seluler yang Anda gunakan, ID
              unik perangkat seluler Anda, alamat IP perangkat seluler Anda,
              sistem operasi seluler Anda, jenis peramban internet seluler yang
              Anda gunakan, pengenal perangkat unik, dan data diagnostik lainnya.
            </p>
            <p>
              Kami juga dapat mengumpulkan informasi yang dikirimkan browser Anda
              setiap kali Anda mengunjungi Layanan kami atau ketika Anda mengakses
              Layanan melalui perangkat seluler.
            </p>
          </section>

          <section className="privacy-section">
            <h3>Teknologi Pelacakan dan Cookie</h3>
            <p>
              Kami menggunakan Cookie dan teknologi pelacakan serupa untuk melacak
              aktivitas di Layanan Kami dan menyimpan informasi tertentu.
              Teknologi pelacakan yang digunakan adalah beacon, tag, dan skrip
              untuk mengumpulkan dan melacak informasi serta untuk meningkatkan dan
              menganalisis Layanan Kami. Teknologi yang Kami gunakan dapat meliputi:
            </p>
            <ul>
              <li>
                <strong>Cookie atau Cookie Peramban.</strong> Cookie adalah berkas
                kecil yang ditempatkan di Perangkat Anda. Anda dapat memerintahkan
                peramban Anda untuk menolak semua Cookie atau untuk menunjukkan
                saat Cookie sedang dikirim. Namun, jika Anda tidak menerima Cookie,
                Anda mungkin tidak dapat menggunakan beberapa bagian Layanan kami.
                Kecuali Anda telah menyesuaikan pengaturan peramban Anda sehingga
                akan menolak Cookie, Layanan kami dapat menggunakan Cookie.
              </li>
              <li>
                <strong>Web Beacon.</strong> Bagian tertentu dari Layanan dan email
                kami mungkin berisi berkas elektronik kecil yang dikenal sebagai web
                beacon (juga disebut clear gif, pixel tag, dan single-pixel gif)
                yang mengizinkan Perusahaan, misalnya, untuk menghitung pengguna
                yang telah mengunjungi halaman tersebut atau membuka email dan untuk
                statistik situs web terkait lainnya (misalnya, mencatat popularitas
                bagian tertentu dan memverifikasi integritas sistem dan server).
              </li>
            </ul>
            <p>
              Cookie dapat berupa Cookie “Persisten” atau Cookie “Sesi”. Cookie
              Persisten tetap berada di komputer pribadi atau perangkat seluler
              Anda saat Anda offline, sedangkan Cookie Sesi dihapus segera setelah
              Anda menutup peramban web. Pelajari lebih lanjut tentang cookie di
              artikel <a href="/kebijakan-privasi">situs web Kebijakan Privasi.</a>
            </p>
            <p>
              Kami menggunakan Cookie Sesi dan Cookie Permanen untuk tujuan yang
              ditetapkan di bawah ini:
            </p>
            <ul>
              <li>
                <strong>Cookie yang Diperlukan / Penting</strong>
                <br />
                Tipe: Cookie Sesi
                <br />
                Diselenggarakan oleh: Kami
                <br />
                Tujuan: Cookie ini penting untuk menyediakan layanan yang tersedia
                melalui Situs Web dan memungkinkan Anda menggunakan beberapa
                fiturnya. Cookie ini membantu mengautentikasi pengguna dan
                mencegah penggunaan akun pengguna secara curang. Tanpa Cookie ini,
                layanan yang Anda minta tidak dapat diberikan, dan Kami hanya
                menggunakan Cookie ini untuk menyediakan layanan tersebut kepada
                Anda.
              </li>
              <li>
                <strong>Kebijakan Cookie / Pemberitahuan Penerimaan Cookie</strong>
                <br />
                Tipe: Cookie Permanen
                <br />
                Diselenggarakan oleh: Kami
                <br />
                Tujuan: Cookie ini mengidentifikasi apakah pengguna telah menerima
                penggunaan cookie di Situs Web.
              </li>
              <li>
                <strong>Cookie Fungsionalitas</strong>
                <br />
                Tipe: Cookie Permanen
                <br />
                Diselenggarakan oleh: Kami
                <br />
                Tujuan: Cookie ini memungkinkan kami mengingat pilihan yang Anda
                buat saat menggunakan Situs Web, seperti mengingat detail login
                atau preferensi bahasa Anda. Tujuan dari Cookie ini adalah untuk
                memberi Anda pengalaman yang lebih personal dan menghindari
                keharusan memasukkan kembali preferensi Anda setiap kali
                menggunakan Situs Web.
              </li>
            </ul>
            <p>
              Untuk informasi lebih lanjut tentang cookie yang kami gunakan dan
              pilihan Anda terkait cookie, silakan kunjungi Kebijakan Cookie kami
              atau bagian Cookie pada Kebijakan Privasi kami.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Penyimpanan Data Pribadi Anda</h2>
            <p>
              Perusahaan akan menyimpan Data Pribadi Anda hanya selama diperlukan
              untuk tujuan yang ditetapkan dalam Kebijakan Privasi ini. Kami akan
              menyimpan dan menggunakan Data Pribadi Anda sejauh yang diperlukan
              untuk mematuhi kewajiban hukum kami (misalnya, jika kami diharuskan
              menyimpan data Anda untuk mematuhi hukum yang berlaku), menyelesaikan
              perselisihan, dan menegakkan perjanjian dan kebijakan hukum kami.
            </p>
            <p>
              Perusahaan juga akan menyimpan Data Penggunaan untuk keperluan
              analisis internal. Data Penggunaan umumnya disimpan untuk jangka
              waktu yang lebih pendek, kecuali jika data ini digunakan untuk
              memperkuat keamanan atau meningkatkan fungsionalitas Layanan Kami,
              atau Kami secara hukum diwajibkan untuk menyimpan data ini untuk
              jangka waktu yang lebih lama.
            </p>

            <h3>Transfer Data Pribadi Anda</h3>
            <p>
              Informasi Anda, termasuk Data Pribadi, diproses di kantor
              operasional Perusahaan dan di tempat lain tempat pihak yang terlibat
              dalam pemrosesan berada. Artinya, informasi ini dapat ditransfer ke —
              dan disimpan di — komputer yang berlokasi di luar negara bagian,
              provinsi, negara, atau yurisdiksi pemerintahan Anda yang undang-undang
              perlindungan datanya mungkin berbeda dari yurisdiksi Anda.
            </p>
            <p>
              Persetujuan Anda terhadap Kebijakan Privasi ini diikuti dengan
              penyerahan informasi tersebut merupakan persetujuan Anda terhadap
              pengalihan tersebut.
            </p>
            <p>
              Perusahaan akan mengambil semua langkah yang diperlukan secara wajar
              untuk memastikan bahwa data Anda diperlakukan dengan aman dan sesuai
              dengan Kebijakan Privasi ini dan tidak ada pengalihan Data Pribadi
              Anda yang akan dilakukan ke organisasi atau negara mana pun kecuali
              ada kontrol yang memadai termasuk keamanan data Anda dan informasi
              pribadi lainnya.
            </p>
          </section>

          <section className="privacy-section">
            <h3>Hapus Data Pribadi Anda</h3>
            <p>
              Anda memiliki hak untuk menghapus atau meminta Kami membantu menghapus
              Data Pribadi yang telah Kami kumpulkan tentang Anda.
            </p>
            <p>
              Layanan kami dapat memberi Anda kemampuan untuk menghapus informasi
              tertentu tentang Anda dari dalam Layanan.
            </p>
            <p>
              Anda dapat memperbarui, mengubah, atau menghapus informasi Anda kapan
              saja dengan masuk ke Akun Anda, jika Anda memilikinya, dan
              mengunjungi bagian pengaturan akun yang memungkinkan Anda mengelola
              informasi pribadi Anda. Anda juga dapat menghubungi Kami untuk
              meminta akses, memperbaiki, atau menghapus informasi pribadi apa pun
              yang telah Anda berikan kepada Kami.
            </p>
            <p>
              Namun, perlu dicatat bahwa Kami mungkin perlu menyimpan informasi
              tertentu apabila Kami memiliki kewajiban hukum atau dasar hukum untuk
              melakukannya.
            </p>
          </section>

          <section className="privacy-section">
            <h3>Pengungkapan Data Pribadi Anda</h3>
            <h4>Transaksi Bisnis</h4>
            <p>
              Jika Perusahaan terlibat dalam penggabungan, akuisisi, atau
              penjualan aset, Data Pribadi Anda dapat ditransfer. Kami akan
              memberikan pemberitahuan sebelum Data Pribadi Anda ditransfer dan
              menjadi subjek Kebijakan Privasi yang berbeda.
            </p>

            <h4>Penegakan hukum</h4>
            <p>
              Jika Perusahaan terlibat dalam penggabungan, akuisisi, atau
              penjualan aset, Data Pribadi Anda dapat ditransfer. Kami akan
              memberikan pemberitahuan sebelum Data Pribadi Anda ditransfer dan
              menjadi subjek Kebijakan Privasi yang berbeda.
            </p>

            <h4>Persyaratan hukum lainnya</h4>
            <p>
              Perusahaan dapat mengungkapkan Data Pribadi Anda dengan keyakinan
              yang itikad baik bahwa tindakan tersebut diperlukan untuk:
            </p>
            <ul>
              <li>Mematuhi kewajiban hukum</li>
              <li>Melindungi dan mempertahankan hak atau properti Perusahaan</li>
              <li>
                Mencegah atau menyelidiki kemungkinan kesalahan sehubungan dengan
                Layanan
              </li>
              <li>
                Melindungi keselamatan pribadi Pengguna Layanan atau masyarakat
                umum
              </li>
              <li>Melindungi dari tanggung jawab hukum</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>Keamanan Data Pribadi Anda</h3>
            <p>
              Keamanan Data Pribadi Anda penting bagi Kami, tetapi ingatlah bahwa
              tidak ada metode transmisi melalui Internet, atau metode penyimpanan
              elektronik yang 100% aman. Meskipun Kami berupaya menggunakan cara
              yang dapat diterima secara komersial untuk melindungi Data Pribadi
              Anda, Kami tidak dapat menjamin keamanannya secara mutlak.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Privasi Anak</h2>
            <p>
              Layanan kami tidak ditujukan untuk siapa pun yang berusia di bawah
              13 tahun. Kami tidak dengan sengaja mengumpulkan informasi identitas
              pribadi dari siapa pun yang berusia di bawah 13 tahun. Jika Anda
              adalah orang tua atau wali dan Anda mengetahui bahwa anak Anda telah
              memberikan Data Pribadi kepada Kami, silakan hubungi Kami. Jika Kami
              mengetahui bahwa Kami telah mengumpulkan Data Pribadi dari siapa pun
              yang berusia di bawah 13 tahun tanpa verifikasi persetujuan orang
              tua, Kami mengambil langkah-langkah untuk menghapus informasi
              tersebut dari server Kami.
            </p>
            <p>
              Jika Kami perlu mengandalkan persetujuan sebagai dasar hukum untuk
              memproses informasi Anda dan negara Anda mengharuskan persetujuan
              dari orang tua, Kami mungkin memerlukan persetujuan orang tua Anda
              sebelum Kami mengumpulkan dan menggunakan informasi tersebut.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Tautan ke Situs Web Lain</h2>
            <p>
              Layanan kami mungkin berisi tautan ke situs web lain yang tidak
              dioperasikan oleh kami. Jika Anda mengeklik tautan pihak ketiga,
              Anda akan diarahkan ke situs pihak ketiga tersebut. Kami sangat
              menyarankan Anda untuk meninjau Kebijakan Privasi setiap situs yang
              Anda kunjungi.
            </p>
            <p>
              Kami tidak memiliki kendali atas dan tidak bertanggung jawab atas
              konten, kebijakan privasi, atau praktik situs atau layanan pihak
              ketiga mana pun.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Perubahan pada Kebijakan Privasi ini</h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu.
              Kami akan memberi tahu Anda tentang perubahan apa pun dengan
              mengeposkan Kebijakan Privasi baru di halaman ini.
            </p>
            <p>
              Kami akan memberi tahu Anda melalui email dan/atau pemberitahuan
              yang menonjol pada Layanan Kami, sebelum perubahan berlaku dan
              memperbarui tanggal “Terakhir diperbarui” di bagian atas Kebijakan
              Privasi ini.
            </p>
            <p>
              Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala
              untuk mengetahui perubahan apa pun. Perubahan pada Kebijakan Privasi
              ini berlaku efektif setelah dipublikasikan di halaman ini.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Hubungi kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, Anda
              dapat menghubungi kami:
            </p>
            <ul>
              <li>
                Melalui email:{' '}
                <a href="mailto:treemail@info.com">treemail@info.com</a>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

export default KebijakanPrivasiPage;
