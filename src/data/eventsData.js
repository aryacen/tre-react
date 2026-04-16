export const upcomingEvent = {
  slug: 'angkatan-1000',
  title: 'Workshop TRE Angkatan 1000',
  date: '26 April 2026',
  time: '09.00 - 17:30 WIB',
  location: 'Movenpick Hotel Jakarta City Center, Jakarta, Indonesia',
  attendees: '72 peserta',
  attendeesDetail: '72 peserta',
  description: '',
  about: [
    'Workshop TRE Indonesia Angkatan 1000 adalah perayaan tonggak istimewa perjalanan TRE Indonesia dalam menghadirkan pembelajaran berbasis tubuh untuk pelepasan stres, ketegangan, dan pemulihan diri. Mengangkat tema <strong>"A Thousand Journeys, One Celebration"</strong>, acara ini menjadi momen spesial yang mempertemukan peserta dengan para pembicara dan praktisi nasional maupun internasional dalam satu workshop bersejarah.',
    'Acara ini akan diselenggarakan pada <strong>Minggu, 26 April 2026</strong>, pukul <strong>09.00–17.30 WIB</strong>, di <strong>Mövenpick Hotel Jakarta City Centre</strong>. Peserta akan mendapatkan kesempatan langka untuk belajar langsung dari <strong>Hindra Gunawan</strong> sebagai Founder TRE Indonesia, <strong>Dr. David Berceli</strong> sebagai pencipta TRE®, <strong>Chris Balsley</strong>, serta <strong>Simba Stenqvist</strong>, didampingi oleh para provider TRE Indonesia.',
    'Dalam workshop ini, peserta akan mempelajari prinsip-prinsip inti yang mendukung regulasi tubuh dan sistem saraf, termasuk pendekatan <strong>Internal Alchemy</strong>, <strong>breathwork</strong>, <strong>grounding</strong>, dan <strong>gerakan berbasis fasia</strong>. Pembelajaran dirancang untuk membantu peserta memperoleh tremor TRE yang lebih efektif, meningkatkan regulasi emosi, memperdalam rasa hadir dan grounded, serta mendukung aliran fasia, postur, dan koherensi energi yang lebih baik.',
  ],
  image: '/assets/home/1000.jpeg',
  imagePosition: 'center 16%',
  imageSize: '72%',
  gallery: [
    '/assets/home/1000_1.jpg',
    '/assets/home/1000_2.jpg',
    '/assets/home/1000_3.jpg',
    '/assets/home/1000_4.jpg',
    '/assets/home/1000_5.jpg',
    '/assets/home/1000_6.jpg',
    '/assets/home/1000_7.jpg',
    '/assets/home/1000_9.jpg',
    '/assets/home/1000_10.jpg',
  ],
  registerUrl: '/assets/home/1000.pdf',
  ctaLabel: 'Register Now',
  showCta: true,
  whatsappMessage:
    'Halo, saya ingin mengetahui informasi lebih lanjut seputar acara workshop TRE angkatan 1000.',
};

export const pastEvents = [
  {
    slug: 'tre-workshop-dr-david-2018',
    title: 'TRE Workshop with Dr. David 2018',
    date: '3 November 2018 - 4 November 2018',
    time: '09.00 - 17.00 WIB',
    location: 'Hotel Novotel Mangga Dua Square, Jakarta, Indonesia',
    attendees: '85 peserta',
    attendeesDetail: '85 peserta',
    description: '',
    about: [
      'Workshop ini menghadirkan momen berharga bagi komunitas TRE Indonesia untuk belajar langsung dari <strong>Dr. David Berceli</strong>. ',
      'Selama dua hari penuh, peserta diajak mendalami prinsip-prinsip pelepasan stres dan trauma berbasis tubuh melalui sesi praktik, diskusi, dan refleksi bersama.',
      'Acara ini menjadi salah satu tonggak penting dalam perkembangan komunitas TRE Indonesia dan memperkuat jejaring praktisi yang terus bertumbuh hingga hari ini.',
    ],
    image: '/assets/home/david2018.JPG',
    gallery: [
      '/assets/home/david2018.JPG',
      '/assets/home/david2018_2.jpg',
      '/assets/home/david2018_3.jpeg',
      ],
    registerUrl: '/assets/home/david2018.JPG',
    showCta: false,
  },
  {
    slug: 'tre-workshop-dr-david-2025',
    title: 'TRE Workshop with Dr.David 2025',
    date: '16 Februari 2025',
    time: '09.00 - 17.00 WIB',
    location: 'Ciputra Hotel, Jakarta, Indonesia',
    attendees: '64 peserta',
    attendeesDetail: '64 peserta',
    description:
      '',
    about: [
      'Pelatihan ini dirancang untuk memperdalam pemahaman peserta tentang regulasi tubuh dan respon sistem saraf.',
      'Melalui sesi teori dan praktik, peserta mengeksplorasi cara membangun rasa aman, stabil, dan hadir di dalam tubuh.',
      'Acara ini juga menjadi ruang belajar bersama bagi komunitas untuk berbagi pengalaman, wawasan, dan proses integrasi.',
    ],
    image: '/assets/home/events.JPG',
    gallery: [
      '/assets/home/events.JPG',
      '/assets/home/david2025.jpg',
      '/assets/home/david2025_2.jpg'],
    registerUrl: '/assets/home/faq.JPG',
    showCta: false,
  },
];

export const allEvents = [upcomingEvent, ...pastEvents];

export function findEventBySlug(slug) {
  return allEvents.find((event) => event.slug === slug) || null;
}
