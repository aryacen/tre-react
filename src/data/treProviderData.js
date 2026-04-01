const fallbackImage = 'individual.jpg';

export const treProviderProfiles = {
  'Hindra Gunawan': {
    name: 'Hindra Gunawan',
    role: 'Founder TRE Indonesia',
    details: [
      '1st Global Certified TRE Provider in Indonesia',
      'The Only Certification TRE Trainer in Indonesia',
      '(had certified more than 40 TRE Providers in Indonesia & Malaysia)',
    ],
    image: 'pakhindra.jpg',
    fallbackImage,
    roles: [
      'Founder TRE Indonesia',
      '1st Global Certified TRE Provider in Indonesia',
      'The Only Certification TRE Trainer in Indonesia',
    ],
  },
  'Juli Wati Zeng': {
    name: 'Juli Wati Zeng',
    role: 'Global Certified TRE Provider in Indonesia',
    details: ['TRE Mentor Trainee', 'Compasionate Enquiry Trainee'],
    image: 'juli.jpg',
    fallbackImage,
    roles: [
      'Global Certified TRE Provider in Indonesia',
      'TRE Mentor Trainee',
      'Compasionate Enquiry Trainee',
    ],
  },
  Marion: {
    name: 'Marion',
    role: 'Global Certified TRE Provider in Indonesia',
    details: [],
    image: 'marion.jpg',
    fallbackImage,
    roles: ['Global Certified TRE Provider in Indonesia'],
  },
  Johannes: {
    name: 'Johannes',
    role: 'Global Certified TRE Provider in Indonesia',
    details: [],
    image: 'johanes.jpg',
    fallbackImage,
    roles: ['Global Certified TRE Provider in Indonesia'],
  },
  'Ivonne Somar': {
    name: 'Ivonne Somar',
    role: 'Global Certified TRE Provider in Indonesia',
    details: [],
    image: 'somar.jpg',
    fallbackImage,
    roles: ['Global Certified TRE Provider in Indonesia'],
  },
  'Yuliana Chen': {
    name: 'Yuliana Chen',
    role: 'Global Certified TRE Provider in Indonesia',
    details: [],
    image: 'yuliana.jpg',
    fallbackImage,
    roles: ['Global Certified TRE Provider in Indonesia'],
  },
  'Ice Carlianti': {
    name: 'Ice Carlianti',
    role: 'Global Certified TRE Provider in Indonesia',
    details: [],
    image: 'bu_ice.png',
    fallbackImage,
    roles: ['Global Certified TRE Provider in Indonesia'],
  },
  'Femi Lusiyani Dewi': {
    name: 'Femi Lusiyani Dewi',
    role: 'Global Certified TRE Provider in Indonesia',
    details: [],
    image: 'bu_lusi.png',
    fallbackImage,
    roles: ['Global Certified TRE Provider in Indonesia'],
  },
};

export const certifiedTreProviders = [
  treProviderProfiles['Hindra Gunawan'],
  treProviderProfiles['Juli Wati Zeng'],
  treProviderProfiles.Marion,
  {
    name: 'Cornelia Nurisa',
    role: 'Global Certified TRE Provider in Indonesia',
    details: [],
    image: 'cornelia.jpg',
    fallbackImage,
    roles: ['Global Certified TRE Provider in Indonesia'],
  },
  treProviderProfiles.Johannes,
  treProviderProfiles['Ivonne Somar'],
  treProviderProfiles['Ice Carlianti'],
  {
    name: 'Ilmia R. Susanti (Santi)',
    role: 'Global Certified TRE Provider in Indonesia',
    details: [],
    image: 'ilmia.jpg',
    fallbackImage,
    roles: ['Global Certified TRE Provider in Indonesia'],
  },
  treProviderProfiles['Yuliana Chen'],
  treProviderProfiles['Femi Lusiyani Dewi'],
];

export const getTreProviderProfile = (name) =>
  treProviderProfiles[name] ?? {
    name,
    role: 'Global Certified TRE Provider in Indonesia',
    details: [],
    image: fallbackImage,
    fallbackImage,
    roles: ['Global Certified TRE Provider in Indonesia'],
  };
