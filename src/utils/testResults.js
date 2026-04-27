const buildLowResult = (description = '') => ({
  level: 'Rendah',
  color: '#4db6ac',
  desc: description,
});

export const kategoriKecemasan = (nilai) => {
  if (nilai === 'Severe Anxiety') {
    return {
      level: 'Sangat Tinggi',
      color: '#d32f2f',
      desc: 'Hasil ini menunjukkan kecemasan yang sudah berdampak luas pada fungsi harian Anda. Gejalanya kuat, berulang, konstan dan menguras energi. Konsultasi segera sangat dianjurkan',
    };
  }

  if (nilai === 'Moderate Anxiety') {
    return {
      level: 'Berat',
      color: '#ff7043',
      desc: 'Temuan ini menunjukkan kecemasan Anda mulai berdampak pada fokus, aktivitas, atau emosi harian. Gejalanya signifikan, meski belum konstan. Mulailah cari bantuan untuk mencegah kondisi memburuk.',
    };
  }

  if (nilai === 'Mild Anxiety') {
    return {
      level: 'Sedang',
      color: '#ffca28',
      desc: 'Hasil ini menunjukkan kecemasan mulai mengganggu kenyamanan. Gejalanya kadang muncul, tapi masih mudah dikelola. Mempelajari kesehatan mental diri bisa jadi cara untuk pengelolaan emosi lebih baik.',
    };
  }

  return buildLowResult(
    'Hasil ini menunjukkan tingkat kecemasan Anda rendah dan tidak berdampak signifikan pada aktivitas sehari-hari. Tetap perhatikan perubahan emosional untuk menjaga keseimbangan mental Anda.'
  );
};

export const skalaDASS = (nilai) => {
  const angka = parseInt(nilai, 10);

  if (Number.isNaN(angka)) {
    return buildLowResult(
      'Data tidak tersedia, tetapi kecemasan berada dalam batas normal.'
    );
  }

  if (angka <= 9) {
    return buildLowResult(
      'Anda berada dalam batas normal. Tidak ada indikasi signifikan, namun tetap penting untuk menjaga keseimbangan emosional dan mental.'
    );
  }

  if (angka <= 13) {
    return {
      level: 'Sedang',
      color: '#ffca28',
      desc: 'Anda berada dalam tingkat wajar. Mungkin ada sesekali perasaan tidak nyaman atau cemas, tetapi masih dalam kendali. Mengembangkan kebiasaan sehat dapat membantu menjaga keseimbangan.',
    };
  }

  if (angka <= 20) {
    return {
      level: 'Tinggi',
      color: '#ff7043',
      desc: 'Cukup tinggi dan dapat berdampak pada keseharian. Bisa jadi ada kesulitan dalam mengelola pikiran dan emosi. Latihan relaksasi atau bantuan profesional dapat membantu.',
    };
  }

  return {
    level: 'Sangat Tinggi',
    color: '#d32f2f',
    desc: 'Anda berada dalam tingkat yang signifikan dan bisa mengganggu aktivitas serta kesejahteraan. Sebaiknya segera mencari dukungan profesional untuk mendapatkan strategi yang sesuai.',
  };
};

export const hasCompleteTestResults = ({ kecemasan, depresi, stress }) => {
  if (!kecemasan) {
    return false;
  }

  const hasDassSignal = depresi !== null || stress !== null;

  if (!hasDassSignal) {
    return true;
  }

  return depresi !== null && stress !== null;
};

export const buildTestResultPayload = ({ kecemasan, depresi, stress }) => {
  const isDASS = depresi !== null || stress !== null;

  return {
    isDASS,
    sourceLabel: isDASS ? 'Tes Kesehatan Mental' : 'Tes Kecemasan',
    kecemasanData: isDASS ? skalaDASS(kecemasan) : kategoriKecemasan(kecemasan),
    depresiData: isDASS && depresi !== null ? skalaDASS(depresi) : null,
    stressData: isDASS && stress !== null ? skalaDASS(stress) : null,
    raw: {
      kecemasan,
      depresi,
      stress,
    },
  };
};
