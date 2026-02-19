const speakerDefaults = {
  name: 'Juli Wati Zeng',
  image: 'individual.jpg',
  roles: [
    'Global Certified TRE Provider',
    'TRE Mentor Trainee',
    'Compassionate Enquiry Trainee',
  ],
};

const cityImageMap = {
  Bali: 'bali.jpg',
  Balikpapan: 'balikpapan.jpg',
  Bandung: 'bandung.png',
  Banjarmasin: 'banjarmasin.jpg',
  Batam: 'batam.jpg',
  Bogor: 'bogor.jpg',
  Cirebon: 'cirebon.png',
  Jakarta: 'jakarta.jpg',
  Jambi: 'jambi.jpeg',
  Jayapura: 'jayapura.jpeg',
  Karawang: 'karawang.jpeg',
  Kudus: 'kudus.jpg',
  Lampung: 'lampung.jpg',
  Lombok: 'lombok.jpg',
  Makassar: 'makassar.jpg',
  Malang: 'malang.jpeg',
  Manado: 'manado.jpg',
  Medan: 'medan.jpg',
  Padang: 'padang.png',
  Palembang: 'palembang.jpg',
  Pekanbaru: 'pekanbaru.jpeg',
  Pontianak: 'pontianak.jpeg',
  Purwokerto: 'Purwokerto.jpg',
  Samarinda: 'samarinda.jpg',
  Semarang: 'semarang.jpg',
  Solo: 'solo.png',
  Sorong: 'sorong.jpeg',
  Surabaya: 'surabaya.jpg',
  Tangerang: 'tangerang.jpg',
  'Tanjung Pinang': 'tanjungpinang.jpg',
  Tasikmalaya: 'tasikmalaya.jpeg',
  Yogyakarta: 'yogyakarta.png',
};

const slugifyCity = (cityName) =>
  cityName.trim().toLowerCase().replace(/\s+/g, '-');

export const treCityData = Object.keys(cityImageMap).map((cityName) => ({
  name: cityName,
  slug: slugifyCity(cityName),
  image: cityImageMap[cityName],
  waktuDate: 'Segera diumumkan',
  waktuTime: 'Segera diumumkan',
  lokasi: 'Segera diumumkan',
  speaker: speakerDefaults,
}));

export const findCityBySlug = (slug) =>
  treCityData.find((city) => city.slug === slug);
