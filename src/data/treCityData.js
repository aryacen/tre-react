import { getTreProviderProfile } from './treProviderData';
import { getUpcomingSeminar } from './treScheduleData';

const cityRecords = [
  { name: 'Balikpapan', image: 'balikpapan.jpg', speakerName: 'Juli Wati Zeng' },
  { name: 'Bandung', image: 'bandung.png', speakerName: 'Hindra Gunawan' },
  { name: 'Banjarmasin', image: 'banjarmasin.jpg', speakerName: 'Hindra Gunawan' },
  { name: 'Batam', image: 'batam.jpg', speakerName: 'Johannes' },
  { name: 'Bekasi', image: 'bekasi.jpg', speakerName: 'Marion' },
  { name: 'Bogor', image: 'bogor.jpg', speakerName: 'Marion' },
  { name: 'Cirebon', image: 'cirebon.png', speakerName: 'Yuliana Chen' },
  { name: 'Jakarta', image: 'jakarta.jpg', speakerName: 'Hindra Gunawan' },
  { name: 'Jambi', image: 'jambi.jpeg', speakerName: 'Johannes' },
  { name: 'Jayapura', image: 'jayapura.jpeg', speakerName: 'Ivonne Somar' },
  { name: 'Karawang', image: 'karawang.jpeg', speakerName: 'Marion' },
  { name: 'Kudus', image: 'kudus.jpg', speakerName: 'Yuliana Chen' },
  { name: 'Lampung', image: 'lampung.jpg', speakerName: 'Johannes' },
  { name: 'Lombok', image: 'lombok.jpg', speakerName: 'Ice Carlianti' },
  { name: 'Makassar', image: 'makassar.jpg', speakerName: 'Juli Wati Zeng' },
  { name: 'Malang', image: 'malang.jpeg', speakerName: 'Ice Carlianti' },
  { name: 'Manado', image: 'manado.jpg', speakerName: 'Johannes' },
  { name: 'Medan', image: 'medan.jpg', speakerName: 'Marion' },
  { name: 'Padang', image: 'padang.png', speakerName: 'Johannes' },
  { name: 'Palembang', image: 'palembang.jpg', speakerName: 'Johannes' },
  { name: 'Pekanbaru', image: 'pekanbaru.jpeg', speakerName: 'Johannes' },
  { name: 'Pontianak', image: 'pontianak.jpeg', speakerName: 'Johannes' },
  { name: 'Purwokerto', image: 'Purwokerto.jpg', speakerName: 'Yuliana Chen' },
  { name: 'Samarinda', image: 'samarinda.jpg', speakerName: 'Juli Wati Zeng' },
  { name: 'Semarang', image: 'semarang.jpg', speakerName: 'Juli Wati Zeng' },
  { name: 'Solo', image: 'solo.png', speakerName: 'Juli Wati Zeng' },
  { name: 'Sorong', image: 'sorong.jpeg', speakerName: 'Ivonne Somar' },
  { name: 'Surabaya', image: 'surabaya.jpg', speakerName: 'Ice Carlianti' },
  { name: 'Tangerang Selatan', image: 'tangerang.jpg', speakerName: 'Hindra Gunawan' },
  { name: 'Tanjung Pinang', image: 'tanjungpinang.jpg', speakerName: 'Johannes' },
  { name: 'Tasikmalaya', image: 'tasikmalaya.jpeg', speakerName: 'Femi Lusiyani Dewi' },
  { name: 'Yogyakarta', image: 'yogyakarta.png', speakerName: 'Juli Wati Zeng' },
  { name: 'Bali', image: 'bali.jpg', speakerName: 'Hindra Gunawan' },
];

const slugifyCity = (cityName) =>
  cityName.trim().toLowerCase().replace(/\s+/g, '-');

export const treCityData = cityRecords
  .map((city) => {
    const slug = slugifyCity(city.name);
    const upcomingSeminar = getUpcomingSeminar(slug);

    return {
      name: city.name,
      slug,
      image: city.image,
      waktuDate: upcomingSeminar?.dateLabel || 'Segera diumumkan',
      waktuTime: upcomingSeminar?.time || 'Segera diumumkan',
      lokasi: upcomingSeminar?.location || 'Segera diumumkan',
      timezone: upcomingSeminar?.timezone || '',
      speaker: getTreProviderProfile(city.speakerName),
    };
  })
  .sort((leftCity, rightCity) => leftCity.name.localeCompare(rightCity.name, 'id'));

export const findCityBySlug = (slug) =>
  treCityData.find((city) => city.slug === slug);
