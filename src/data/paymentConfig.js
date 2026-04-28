export const PAYMENT_METHODS = [
  {
    id: 'credit_card',
    label: 'Credit / Debit Card',
    badges: ['Visa', 'Mastercard', 'JCB'],
    enabledPayments: ['credit_card'],
  },
  {
    id: 'gopay',
    label: 'GoPay',
    badges: ['GoPay'],
    enabledPayments: ['gopay'],
  },
  {
    id: 'qris',
    label: 'QRIS',
    badges: ['QRIS'],
    enabledPayments: ['qris'],
  },
  {
    id: 'bca_va',
    label: 'Bank Transfer - BCA VA',
    badges: ['BCA VA'],
    enabledPayments: ['bca_va'],
  },
  {
    id: 'bni_va',
    label: 'Bank Transfer - BNI VA',
    badges: ['BNI VA'],
    enabledPayments: ['bni_va'],
  },
  {
    id: 'permata_va',
    label: 'Bank Transfer - Permata VA',
    badges: ['Permata VA'],
    enabledPayments: ['permata_va'],
  },
  {
    id: 'echannel',
    label: 'Mandiri Bill Payment',
    badges: ['Mandiri'],
    enabledPayments: ['echannel'],
  },
];

export const PAYMENT_METHOD_LOOKUP = PAYMENT_METHODS.reduce((lookup, method) => {
  lookup[method.id] = method;
  return lookup;
}, {});

const parseCurrencyAmount = (value) => {
  const amount = Number(String(value ?? '').replace(/[^\d]/g, ''));
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
};

const DEFAULT_ONLINE_DELIVERY_FEE = 10000;

export const ONLINE_DELIVERY_FEE =
  parseCurrencyAmount(
    process.env.REACT_APP_ONLINE_DELIVERY_FEE || process.env.ONLINE_DELIVERY_FEE
  ) || DEFAULT_ONLINE_DELIVERY_FEE;

// Add active coupons here when needed.
// Example:
// { code: 'HEMAT50', type: 'fixed', amount: 50000, label: 'Diskon Rp50.000' }
export const PAYMENT_COUPONS = [];

export const PAYMENT_COUPON_LOOKUP = PAYMENT_COUPONS.reduce((lookup, coupon) => {
  lookup[coupon.code.trim().toUpperCase()] = coupon;
  return lookup;
}, {});

export const normalizeCouponCode = (value = '') => value.trim().toUpperCase();

export const getCouponDiscount = (coupon, subtotal) => {
  if (!coupon || subtotal <= 0) {
    return 0;
  }

  if (coupon.type === 'percentage') {
    return Math.min(subtotal, Math.round((subtotal * coupon.amount) / 100));
  }

  return Math.min(subtotal, coupon.amount);
};
