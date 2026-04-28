const seminarScheduleByCity = {
  // Example:
  // jakarta: [
  //   { date: '2026-04-18', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel A, Jakarta' },
  //   { date: '2026-06-20', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel B, Jakarta' },
  // ],
  balikpapan: [
    { date: '2026-06-20', time: '09.00 - 12.00', timezone: 'WITA', location: 'Platinum Hotel Balikpapan'},
  ],
  bandung: [
    { date: '2026-05-09', time: '08.30 - 12.00', timezone: 'WIB', location: 'Hotel Aston Tropicana Cihampelas, Bandung'},
    { date: '2026-06-06', time: '08.30 - 12.00', timezone: 'WIB', location: 'Hotel Aston Tropicana Cihampelas, Bandung'},
    { date: '2026-07-04', time: '08.30 - 12.00', timezone: 'WIB', location: 'Hotel Aston Tropicana Cihampelas, Bandung'},
    { date: '2026-08-01', time: '08.30 - 12.00', timezone: 'WIB', location: 'Hotel Aston Tropicana Cihampelas, Bandung'},
    { date: '2026-09-05', time: '08.30 - 12.00', timezone: 'WIB', location: 'Hotel Aston Tropicana Cihampelas, Bandung'},
    { date: '2026-10-03', time: '08.30 - 12.00', timezone: 'WIB', location: 'Hotel Aston Tropicana Cihampelas, Bandung'},
    { date: '2026-11-07', time: '08.30 - 12.00', timezone: 'WIB', location: 'Hotel Aston Tropicana Cihampelas, Bandung'},
    { date: '2026-12-05', time: '08.30 - 12.00', timezone: 'WIB', location: 'Hotel Aston Tropicana Cihampelas, Bandung'},
  ],
  banjarmasin: [],
  batam: [
    { date: '2026-04-11', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Aston Nagoya Batam'},
    { date: '2026-05-16', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Aston Nagoya Batam'},
    { date: '2026-06-27', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Aston Nagoya Batam'},
    { date: '2026-08-08', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Aston Nagoya Batam'},
    { date: '2026-09-19', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Aston Nagoya Batam'},
    { date: '2026-10-31', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Aston Nagoya Batam'},
    { date: '2026-12-05', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Aston Nagoya Batam'},
  ],
  bekasi: [
    { date: '2026-05-23', time: '09.00 - 12.00', timezone: 'WIB', location: 'Sinotif Convention Hall Kemang Pratama'},
    { date: '2026-07-25', time: '09.00 - 12.00', timezone: 'WIB', location: 'Sinotif Convention Hall Kemang Pratama'},
    { date: '2026-09-26', time: '09.00 - 12.00', timezone: 'WIB', location: 'Sinotif Convention Hall Kemang Pratama'},
    { date: '2026-11-21', time: '09.00 - 12.00', timezone: 'WIB', location: 'Sinotif Convention Hall Kemang Pratama'},
  ],
  bogor: [
    { date: '2026-05-02', time: '09.00 - 12.00', timezone: 'WIB', location: 'Luminor Hotel Padjajaran Bogor'},
    { date: '2026-06-27', time: '09.00 - 12.00', timezone: 'WIB', location: 'Swiss-Bel Hotel Bogor'},
    { date: '2026-08-29', time: '09.00 - 12.00', timezone: 'WIB', location: 'Luminor Hotel Padjajaran Bogor'},
    { date: '2026-10-17', time: '09.00 - 12.00', timezone: 'WIB', location: 'Luminor Hotel Padjajaran Bogor'},
    { date: '2026-12-12', time: '09.00 - 12.00', timezone: 'WIB', location: 'Luminor Hotel Padjajaran Bogor'},
  ],
  cirebon: [],
  jakarta: [
    { date: '2026-04-12', time: '09.00 - 12.00', timezone: 'WIB', location: 'Jakarta Design Center, Jakarta'},
    { date: '2026-05-10', time: '09.00 - 12.00', timezone: 'WIB', location: 'Jakarta Design Center, Jakarta'},
    { date: '2026-06-07', time: '09.00 - 12.00', timezone: 'WIB', location: 'Jakarta Design Center, Jakarta'},
    { date: '2026-07-04', time: '09.00 - 12.00', timezone: 'WIB', location: 'Jakarta Design Center, Jakarta'},
    { date: '2026-08-02', time: '09.00 - 12.00', timezone: 'WIB', location: 'Jakarta Design Center, Jakarta'},
    { date: '2026-09-05', time: '09.00 - 12.00', timezone: 'WIB', location: 'Segera Diumumkan'},
    { date: '2026-10-04', time: '09.00 - 12.00', timezone: 'WIB', location: 'Jakarta Design Center, Jakarta'},
    { date: '2026-11-08', time: '09.00 - 12.00', timezone: 'WIB', location: 'Jakarta Design Center, Jakarta'},
    { date: '2026-12-05', time: '09.00 - 12.00', timezone: 'WIB', location: 'Segera Diumumkan'},
  ],
  jambi: [
    { date: '2026-05-30', time: '09.00 - 12.00', timezone: 'WIB', location: 'Yello Hotel Jambi'},
    { date: '2026-08-29', time: '09.00 - 12.00', timezone: 'WIB', location: 'Yello Hotel Jambi'},
    { date: '2026-11-28', time: '09.00 - 12.00', timezone: 'WIB', location: 'Yello Hotel Jambi'},
  ],
  jayapura: [],
  karawang: [
    { date: '2026-05-09', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel NOVOTEL Karawang'},
    { date: '2026-07-11', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel NOVOTEL Karawang'},
    { date: '2026-09-12', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel NOVOTEL Karawang'},
    { date: '2026-11-14', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel NOVOTEL Karawang'},
  ],
  kudus: [],
  lampung: [
    { date: '2026-06-27', time: '09.00 - 12.00', timezone: 'WIB', location: 'Segera Diumumkan'},
  ],
  lombok: [
    { date: '2026-05-16', time: '09.00 - 12.00', timezone: 'WITA', location: 'Hotel Lombok Raya'},
    { date: '2026-07-11', time: '09.00 - 12.00', timezone: 'WITA', location: 'Hotel Lombok Raya'},
    { date: '2026-09-05', time: '09.00 - 12.00', timezone: 'WITA', location: 'Hotel Lombok Raya'},
    { date: '2026-11-07', time: '09.00 - 12.00', timezone: 'WITA', location: 'Hotel Lombok Raya'},
  ],
  makassar: [
    { date: '2026-04-11', time: '09.00 - 12.00', timezone: 'WITA', location: 'Swiss-Bel Hotel Makassar'},
    { date: '2026-05-30', time: '09.00 - 12.00', timezone: 'WITA', location: 'Swiss-Bel Hotel Makassar'},
  ],
  malang: [
    { date: '2026-06-06', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Ibis Styles Malang'},
    { date: '2026-08-01', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Ibis Styles Malang'},
    { date: '2026-10-03', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Ibis Styles Malang'},
    { date: '2026-12-05', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Ibis Styles Malang'},
  ],
  manado: [
    { date: '2026-10-03', time: '09.00 - 12.00', timezone: 'WITA', location: 'Swiss-Bel Hotel Maleosan Manado'},
  ],
  medan: [
    { date: '2026-04-18', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Grand Mercure Medan Angkasa'},
    { date: '2026-06-13', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Grand Mercure Medan Angkasa'},
    { date: '2026-08-08', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Grand Mercure Medan Angkasa'},
    { date: '2026-10-03', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Grand Mercure Medan Angkasa'},
    { date: '2026-11-28', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Grand Mercure Medan Angkasa'},
  ],
  padang: [
    { date: '2026-07-11', time: '09.00 - 12.00', timezone: 'WIB', location: 'HW Hotel Padang'},
  ],
  palembang: [
    { date: '2026-05-09', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Santika Radial Palembang'},
    { date: '2026-07-04', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Santika Radial Palembang'},
    { date: '2026-08-22', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Santika Radial Palembang'},
    { date: '2026-10-17', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Santika Radial Palembang'},
    { date: '2026-12-12', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Santika Radial Palembang'},
  ],
  pekanbaru: [
    { date: '2026-04-18', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Tjokro Pekanbaru'},
    { date: '2026-06-13', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Tjokro Pekanbaru'},
    { date: '2026-08-01', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Tjokro Pekanbaru'},
    { date: '2026-09-26', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Tjokro Pekanbaru'},
    { date: '2026-11-21', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Tjokro Pekanbaru'},
  ],
  pontianak: [
    { date: '2026-05-02', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel HARRIS Pontianak'},
    { date: '2026-08-15', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel HARRIS Pontianak'},
    { date: '2026-11-14', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel HARRIS Pontianak'},
  ],
  purwokerto: [],
  samarinda: [
    { date: '2026-05-09', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel YELLO Samarinda'},
  ],
  semarang: [
    { date: '2026-05-16', time: '09.00 - 12.00', timezone: 'WIB', location: 'Rooms Inc Hotel Pemuda Semarang'},
  ],
  solo: [],
  sorong: [],
  surabaya: [
    { date: '2026-04-18', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Movenpick Surabaya'},
    { date: '2026-05-30', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Movenpick Surabaya'},
    { date: '2026-06-27', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Movenpick Surabaya'},
    { date: '2026-07-25', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Movenpick Surabaya'},
    { date: '2026-08-29', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Movenpick Surabaya'},
    { date: '2026-09-26', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Movenpick Surabaya'},
    { date: '2026-10-24', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Movenpick Surabaya'},
    { date: '2026-11-28', time: '09.00 - 12.00', timezone: 'WIB', location: 'Hotel Movenpick Surabaya'},
  ],
  'tangerang-selatan': [
    { date: '2026-04-18', time: '08.30 - 12.00', timezone: 'WIB', location: 'Trembesi Hotel, BSD Serpong'},
    { date: '2026-05-23', time: '08.30 - 12.00', timezone: 'WIB', location: 'Trembesi Hotel, BSD Serpong'},
    { date: '2026-06-20', time: '08.30 - 12.00', timezone: 'WIB', location: 'Trembesi Hotel, BSD Serpong'},
    { date: '2026-07-18', time: '08.30 - 12.00', timezone: 'WIB', location: 'Trembesi Hotel, BSD Serpong'},
    { date: '2026-08-15', time: '08.30 - 12.00', timezone: 'WIB', location: 'Trembesi Hotel, BSD Serpong'},
    { date: '2026-09-19', time: '08.30 - 12.00', timezone: 'WIB', location: 'Trembesi Hotel, BSD Serpong'},
    { date: '2026-10-17', time: '08.30 - 12.00', timezone: 'WIB', location: 'Trembesi Hotel, BSD Serpong'},
    { date: '2026-11-21', time: '08.30 - 12.00', timezone: 'WIB', location: 'Trembesi Hotel, BSD Serpong'},
    { date: '2026-12-19', time: '08.30 - 12.00', timezone: 'WIB', location: 'Trembesi Hotel, BSD Serpong'},
  ],
  'tanjung-pinang': [
    { date: '2026-09-05', time: '09.00 - 12.00', timezone: 'WIB', location: 'Segera Diumumkan'},
  ],
  tasikmalaya: [],
  yogyakarta: [
    { date: '2026-04-18', time: '09.00 - 12.00', timezone: 'WIB', location: 'GRAMM Hotel Yogyakarta'},
    { date: '2026-06-13', time: '09.00 - 12.00', timezone: 'WIB', location: 'GRAMM Hotel Yogyakarta'},
  ],
  bali: [
    { date: '2026-05-02', time: '09.00 - 12.00', timezone: 'WITA', location: 'Hotel HARRIS Denpasar'},
    { date: '2026-07-11', time: '09.00 - 12.00', timezone: 'WITA', location: 'Hotel HARRIS Denpasar'},
    { date: '2026-08-22', time: '09.00 - 12.00', timezone: 'WITA', location: 'Hotel HARRIS Denpasar'},
    { date: '2026-09-26', time: '09.00 - 12.00', timezone: 'WITA', location: 'Hotel HARRIS Denpasar'},
    { date: '2026-10-24', time: '09.00 - 12.00', timezone: 'WITA', location: 'Hotel HARRIS Denpasar'},
    { date: '2026-11-21', time: '09.00 - 12.00', timezone: 'WITA', location: 'Hotel HARRIS Denpasar'},
  ],
};

const JAKARTA_TIME_ZONE = 'Asia/Jakarta';

const getDateParts = (value, timeZone = JAKARTA_TIME_ZONE) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value);

  return parts.reduce((result, part) => {
    if (part.type !== 'literal') {
      result[part.type] = part.value;
    }

    return result;
  }, {});
};

const getTodayIsoInJakarta = (today = new Date()) => {
  const { year, month, day } = getDateParts(today);
  return `${year}-${month}-${day}`;
};

const formatScheduleDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const eventDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: JAKARTA_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(eventDate);
};

export const getUpcomingSeminar = (citySlug, today = new Date()) => {
  const schedules = seminarScheduleByCity[citySlug] || [];
  const todayIso = getTodayIsoInJakarta(today);
  const upcomingSchedule = schedules.find((schedule) => schedule.date >= todayIso);

  if (!upcomingSchedule) {
    return null;
  }

  return {
    ...upcomingSchedule,
    dateLabel: formatScheduleDate(upcomingSchedule.date),
  };
};

export { seminarScheduleByCity };
