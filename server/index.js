import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ONLINE_DELIVERY_FEE,
  PAYMENT_COUPON_LOOKUP,
  PAYMENT_METHOD_LOOKUP,
  getCouponDiscount,
  normalizeCouponCode,
} from '../src/data/paymentConfig.js';
import { getUpcomingSeminar } from '../src/data/treScheduleData.js';
import {
  buildTestResultPayload,
  hasCompleteTestResults,
} from '../src/utils/testResults.js';
import { buildWhatsAppLink } from '../src/utils/whatsapp.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || '';
const DEFAULT_PUBLIC_FRONTEND_BASE_URL = 'https://treindonesia.com';
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_USER;
const SUPPORT_EMAIL = process.env.FORM_TO_EMAIL || 'support@treindonesia.com';
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';
const GOOGLE_SHEETS_WEBHOOK_SECRET = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || '';
const WATZAP_API_BASE_URL = process.env.WATZAP_API_BASE_URL || 'https://api.watzap.id/v1';
const WATZAP_API_KEY = process.env.WATZAP_API_KEY || '';
const WATZAP_NUMBER_KEY = process.env.WATZAP_NUMBER_KEY || '';
const WATZAP_ADMIN_PHONE_NUMBERS = process.env.WATZAP_ADMIN_PHONE_NUMBERS || '';
const WATZAP_CS_NAME = process.env.WATZAP_CS_NAME || '{{cs_name}}';
const WATZAP_NOTIFY_CUSTOMER = process.env.WATZAP_NOTIFY_CUSTOMER !== 'false';
const WATZAP_NOTIFY_ADMINS = process.env.WATZAP_NOTIFY_ADMINS !== 'false';
const FREE_TEST_WHATSAPP_MESSAGE =
  '[TesGratis] Halo, saya ingin mengetahui informasi lebih lanjut seputar acara seminar yang TRE Indonesia tawarkan.';
const MIDTRANS_SNAP_BASE_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com'
  : 'https://app.sandbox.midtrans.com';
const MIDTRANS_API_BASE_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://api.midtrans.com'
  : 'https://api.sandbox.midtrans.com';
const DEFAULT_SEMINAR_PRICE = 299000;
const NORMAL_SEMINAR_PRICE = 598000;
const ONLINE_SEMINAR_SLUG = 'online';
const INDONESIA_TIME_ZONE = 'Asia/Jakarta';
const GOOGLE_SHEETS_ORDER_COLUMNS = {
  order_id: 'Order Id',
  product_name_qty_sku: 'Product name(QTY)(SKU)',
  order_total: 'Order Total',
  payment_method: 'Payment Method',
  billing_first_name: 'Billing First name',
  billing_city: 'Billing City',
  email: 'Email',
  phone: 'Phone',
  created_date: 'Created Date',
  status_follow_up: 'Status Follow Up',
  utm_source: 'UTM Source',
  utm_medium: 'UTM Medium',
  utm_campaign: 'UTM Campaign',
  utm_content: 'UTM Content',
  shipping_address: 'Alamat Lengkap',
  shipping_district: 'Kecamatan',
  shipping_postal_code: 'Kode Pos',
  shipping_city: 'Kota Pengiriman',
  delivery_fee: 'Biaya Ongkir',
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.resolve(__dirname, '../build');

if (!MIDTRANS_SERVER_KEY) {
  console.warn('Missing MIDTRANS_SERVER_KEY in environment.');
}

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM_EMAIL) {
  console.warn('SMTP configuration is incomplete. Form email delivery is disabled.');
}

const trimTrailingSlash = (value) => String(value ?? '').replace(/\/+$/, '');

const isLocalhostUrl = (value) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(trimTrailingSlash(value));

const getPreferredBaseUrl = (candidates, { allowLocalhost = false } = {}) => {
  for (const candidate of candidates) {
    const normalizedCandidate = trimTrailingSlash(candidate);

    if (!normalizedCandidate) {
      continue;
    }

    if (!allowLocalhost && isLocalhostUrl(normalizedCandidate)) {
      continue;
    }

    return normalizedCandidate;
  }

  return '';
};

const getConfiguredPublicFrontendBaseUrl = () => {
  const configuredBaseUrl = trimTrailingSlash(FRONTEND_BASE_URL);

  if (configuredBaseUrl && !isLocalhostUrl(configuredBaseUrl)) {
    return configuredBaseUrl;
  }

  if (process.env.NODE_ENV === 'production') {
    return DEFAULT_PUBLIC_FRONTEND_BASE_URL;
  }

  return '';
};

const getFrontendBaseUrl = (req) => {
  const configuredBaseUrl = getConfiguredPublicFrontendBaseUrl();
  const requestOrigin = trimTrailingSlash(req.get('origin'));

  const forwardedProto = trimTrailingSlash(req.get('x-forwarded-proto'));
  const forwardedHost = trimTrailingSlash(req.get('x-forwarded-host'));
  const host = trimTrailingSlash(req.get('host'));
  const protocol = forwardedProto || req.protocol;
  const hostname = forwardedHost || host;
  const derivedBaseUrl = protocol && hostname ? `${protocol}://${hostname}` : '';

  const publicBaseUrl = getPreferredBaseUrl([
    configuredBaseUrl,
    requestOrigin,
    derivedBaseUrl,
  ]);

  if (publicBaseUrl) {
    return publicBaseUrl;
  }

  return getPreferredBaseUrl([requestOrigin, configuredBaseUrl, derivedBaseUrl], {
    allowLocalhost: true,
  });
};

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const configuredBaseUrl = getConfiguredPublicFrontendBaseUrl();
      if (!configuredBaseUrl) {
        return callback(null, true);
      }

      return callback(null, trimTrailingSlash(origin) === configuredBaseUrl);
    },
  })
);
app.use(express.json());

const buildBasicAuthHeader = (serverKey) =>
  `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`;

const parseJsonSafely = (rawBody) => {
  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return { raw: rawBody };
  }
};

const postJson = async (url, payload) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify(payload),
  });

  const rawBody = await response.text();
  const parsedBody = parseJsonSafely(rawBody);

  if (!response.ok) {
    throw new Error(
      parsedBody?.message ||
        parsedBody?.status_message ||
        parsedBody?.raw ||
        `Request failed with status ${response.status}.`
    );
  }

  return parsedBody;
};

const postGoogleSheetsWebhook = async (payload) => {
  const response = await postJson(GOOGLE_SHEETS_WEBHOOK_URL, payload);

  if (response?.ok === false || response?.success === false) {
    throw new Error(
      response.message || response.error || 'Google Sheets webhook rejected the request.'
    );
  }

  return response;
};

const formatCityNameFromSlug = (slug) =>
  String(slug ?? '')
    .trim()
    .split('-')
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');

const getSeminarConfig = (city, cityName) => {
  if (city === ONLINE_SEMINAR_SLUG) {
    return {
      label: cityName || 'Seminar TRE Online',
      price: 199000,
      paymentPath: '/tre-online/payment',
    };
  }

  return {
    label: cityName || `Seminar TRE ${formatCityNameFromSlug(city) || city}`,
    price: DEFAULT_SEMINAR_PRICE,
    paymentPath: `/tre-individuals/${city}/payment`,
  };
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildMailer = () => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM_EMAIL) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const mailer = buildMailer();

const ensureNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const normalizeField = (value) => String(value ?? '').trim();

const splitCommaSeparatedValues = (value) =>
  String(value ?? '')
    .split(',')
    .map((item) => normalizeField(item))
    .filter(Boolean);

const emailLooksValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const formatCurrency = (amount) => `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
const formatCompactCurrency = (amount) => formatCurrency(amount).replace(/^Rp\s+/, 'Rp');

const formatDateTimeForIndonesia = (value) => {
  const date = value instanceof Date ? value : new Date(value);

  return `${new Intl.DateTimeFormat('sv-SE', {
    timeZone: INDONESIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(',', '')} WIB`;
};

const extractFirstName = (value) => {
  const [firstName = ''] = normalizeField(value).split(/\s+/);
  return firstName;
};

const normalizePhoneNumber = (value, defaultCountryCode = '62') => {
  const normalizedValue = String(value ?? '').trim();
  if (!normalizedValue) {
    return '';
  }

  const digitsOnly = normalizedValue.replace(/[^\d+]/g, '').replace(/^\+/, '').replace(/^00/, '');
  if (!digitsOnly) {
    return '';
  }

  if (digitsOnly.startsWith(defaultCountryCode)) {
    return digitsOnly;
  }

  if (digitsOnly.startsWith('0')) {
    return `${defaultCountryCode}${digitsOnly.slice(1)}`;
  }

  return digitsOnly;
};

const getConfiguredAdminPhoneNumbers = () =>
  splitCommaSeparatedValues(WATZAP_ADMIN_PHONE_NUMBERS)
    .map((value) => normalizePhoneNumber(value))
    .filter(Boolean);

const getRequestedPaymentMethodLabel = (selectedPaymentMethod) =>
  selectedPaymentMethod?.label || 'Midtrans Snap';

const normalizeUtmParams = (utm = {}) => ({
  source: normalizeField(utm.source || utm.utm_source),
  medium: normalizeField(utm.medium || utm.utm_medium),
  campaign: normalizeField(utm.campaign || utm.utm_campaign),
  content: normalizeField(utm.content || utm.utm_content),
});

const getDeliveryFeeForCity = (city) =>
  normalizeField(city) === ONLINE_SEMINAR_SLUG ? ONLINE_DELIVERY_FEE : 0;

const normalizeShippingAddress = (source = {}) => {
  const normalizedSource = source || {};

  return {
    address: normalizeField(
      normalizedSource.shipping_address ||
        normalizedSource.shippingAddress ||
        normalizedSource.address ||
        normalizedSource.fullAddress ||
        normalizedSource.alamatLengkap ||
        normalizedSource.alamat_lengkap
    ),
    district: normalizeField(
      normalizedSource.shipping_district ||
        normalizedSource.shippingDistrict ||
        normalizedSource.district ||
        normalizedSource.kecamatan
    ),
    postalCode: normalizeField(
      normalizedSource.shipping_postal_code ||
        normalizedSource.shippingPostalCode ||
        normalizedSource.postalCode ||
        normalizedSource.postal_code ||
        normalizedSource.kodePos ||
        normalizedSource.kode_pos
    ),
    city: normalizeField(
      normalizedSource.shipping_city ||
        normalizedSource.shippingCity ||
        normalizedSource.city ||
        normalizedSource.kota
    ),
  };
};

const hasCompleteShippingAddress = (shippingAddress) =>
  Boolean(
    shippingAddress?.address &&
      shippingAddress?.district &&
      shippingAddress?.postalCode &&
      shippingAddress?.city
  );

const formatShippingAddress = (shippingAddress = {}) => {
  const normalizedShippingAddress = normalizeShippingAddress(shippingAddress);
  const areaLine = [
    normalizedShippingAddress.district
      ? `Kec. ${normalizedShippingAddress.district}`
      : '',
    normalizedShippingAddress.city,
    normalizedShippingAddress.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  return [normalizedShippingAddress.address, areaLine].filter(Boolean).join('\n');
};

const getSheetStatusFollowUp = (statusLabel) => {
  const lookup = {
    paid: 'Paid',
    pending: 'Pending',
    challenge: 'On Hold',
    failed: 'Cancelled',
  };

  return lookup[statusLabel] || statusLabel || '';
};

const formatMidtransPaymentMethod = (paymentType) => {
  const lookup = {
    credit_card: 'Credit / Debit Card',
    gopay: 'GoPay',
    qris: 'QRIS',
    bank_transfer: 'Bank Transfer',
    bca_va: 'Bank Transfer - BCA VA',
    bni_va: 'Bank Transfer - BNI VA',
    permata_va: 'Bank Transfer - Permata VA',
    echannel: 'Mandiri Bill Payment',
    cstore: 'Convenience Store',
    shopeepay: 'ShopeePay',
    akulaku: 'Akulaku',
  };

  return lookup[paymentType] || paymentType || '';
};

const getCitySlugFromOrderId = (orderId) => {
  const match = normalizeField(orderId).match(/^tre-(.+)-\d+$/);
  return match?.[1] || '';
};

const getProductNameFromLine = (productLine) =>
  normalizeField(productLine).replace(/\s+\(\d+\)\s+\([^)]+\)\s*$/, '');

const formatSeminarTime = (time, timezone) =>
  [normalizeField(time).replace(/\s*-\s*/g, '-'), normalizeField(timezone)]
    .filter(Boolean)
    .join(' ');

const getSeminarDetailsForOrder = ({ orderId, citySlug, productLine }) => {
  const resolvedCitySlug = normalizeField(citySlug) || getCitySlugFromOrderId(orderId);
  const schedule =
    resolvedCitySlug && resolvedCitySlug !== ONLINE_SEMINAR_SLUG
      ? getUpcomingSeminar(resolvedCitySlug)
      : null;
  const productName =
    resolvedCitySlug === ONLINE_SEMINAR_SLUG
      ? 'Seminar TRE Online'
      : getProductNameFromLine(productLine) ||
        `Seminar TRE ${formatCityNameFromSlug(resolvedCitySlug) || resolvedCitySlug}`;

  return {
    productName,
    dateLabel: schedule?.dateLabel || 'Segera diumumkan',
    timeLabel: formatSeminarTime(schedule?.time, schedule?.timezone) || 'Segera diumumkan',
    location:
      schedule?.location ||
      (resolvedCitySlug === ONLINE_SEMINAR_SLUG ? 'Online' : 'Segera diumumkan'),
  };
};

const buildPaymentStartRecord = ({
  orderId,
  city,
  seminar,
  grossAmount,
  selectedPaymentMethod,
  name,
  email,
  whatsapp,
  domicile,
  shippingAddress,
  deliveryFee,
  utm,
  createdAt,
}) => {
  const sku = `seminar-${city}`;
  const normalizedPhone = normalizePhoneNumber(whatsapp);
  const normalizedUtm = normalizeUtmParams(utm);
  const normalizedShippingAddress = normalizeShippingAddress(shippingAddress);
  const upcomingSeminar = city === ONLINE_SEMINAR_SLUG ? null : getUpcomingSeminar(city);
  const productDisplayName = upcomingSeminar?.dateLabel
    ? `${seminar.label} ${upcomingSeminar.dateLabel.replace(/^[^,]+,\s*/, '')}`
    : seminar.label;

  return {
    orderId,
    productName: seminar.label,
    productDisplayName,
    productQty: 1,
    sku,
    productLine: `${seminar.label} (1) (${sku})`,
    orderTotal: grossAmount,
    paymentMethod: getRequestedPaymentMethodLabel(selectedPaymentMethod),
    billingFirstName: extractFirstName(name),
    billingCity: normalizeField(domicile),
    email: normalizeField(email),
    phone: normalizedPhone || normalizeField(whatsapp),
    shippingAddress: normalizedShippingAddress.address,
    shippingDistrict: normalizedShippingAddress.district,
    shippingPostalCode: normalizedShippingAddress.postalCode,
    shippingCity: normalizedShippingAddress.city,
    deliveryFee: Number(deliveryFee || 0),
    createdDate: formatDateTimeForIndonesia(createdAt),
    createdAtIso: createdAt.toISOString(),
    normalPrice: NORMAL_SEMINAR_PRICE,
    statusFollowUp: 'Pending',
    utmSource: normalizedUtm.source,
    utmMedium: normalizedUtm.medium,
    utmCampaign: normalizedUtm.campaign,
    utmContent: normalizedUtm.content,
  };
};

const getPaymentStartSheetRow = (record) => ({
  order_id: record.orderId,
  product_name_qty_sku: record.productLine,
  order_total: record.orderTotal,
  payment_method: record.paymentMethod,
  billing_first_name: record.billingFirstName,
  billing_city: record.billingCity,
  email: record.email,
  phone: record.phone,
  created_date: record.createdDate,
  status_follow_up: record.statusFollowUp,
  utm_source: record.utmSource,
  utm_medium: record.utmMedium,
  utm_campaign: record.utmCampaign,
  utm_content: record.utmContent,
  shipping_address: record.shippingAddress,
  shipping_district: record.shippingDistrict,
  shipping_postal_code: record.shippingPostalCode,
  shipping_city: record.shippingCity,
  delivery_fee: record.deliveryFee,
});

const pushPaymentStartToGoogleSheets = async (record) => {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return;
  }

  return postGoogleSheetsWebhook({
    secret: GOOGLE_SHEETS_WEBHOOK_SECRET,
    event: 'payment_started',
    order_id: record.orderId,
    columns: GOOGLE_SHEETS_ORDER_COLUMNS,
    row: getPaymentStartSheetRow(record),
    order: record,
  });
};

const updatePaymentInGoogleSheets = async ({ orderId, paymentMethod, statusLabel }) => {
  if (!GOOGLE_SHEETS_WEBHOOK_URL || (!paymentMethod && !statusLabel)) {
    return;
  }

  return postGoogleSheetsWebhook({
    secret: GOOGLE_SHEETS_WEBHOOK_SECRET,
    event: 'payment_updated',
    order_id: orderId,
    updates: {
      payment_method: paymentMethod,
      payment_status: statusLabel,
      status_follow_up: getSheetStatusFollowUp(statusLabel),
    },
  });
};

const sendWatzapMessage = async ({ phoneNo, message }) => {
  if (!WATZAP_API_KEY || !WATZAP_NUMBER_KEY || !phoneNo || !message) {
    return;
  }

  return postJson(`${trimTrailingSlash(WATZAP_API_BASE_URL)}/send_message`, {
    api_key: WATZAP_API_KEY,
    number_key: WATZAP_NUMBER_KEY,
    phone_no: phoneNo,
    message,
  });
};

const buildCustomerPaymentStartedMessage = ({
  customerName,
  record,
  redirectUrl,
  expiresInHours,
}) =>
  {
    const firstName = extractFirstName(customerName) || 'Bapak/Ibu';
    const productName = record.productDisplayName || record.productName || record.productLine;

    return [
      `*Hai ${firstName}!* 👋`,
      `Terima kasih sudah mendaftar di *${productName}*`,
      'Bapak/Ibu berhak dapat *Harga spesial khusus hari ini !* 🎉',
      '',
      `Normal ~${formatCompactCurrency(record.normalPrice)}~,`,
      `PROMO *${formatCompactCurrency(record.orderTotal)}*`,
      ...(record.deliveryFee > 0
        ? [`Termasuk Biaya Ongkir buku *${formatCompactCurrency(record.deliveryFee)}*`]
        : []),
      '',
      `Sudah menyelesaikan pembayaran sesuai metode yang dipilih pak/bu ${firstName}?`,
      '',
      'Jika belum, silakan selesaikan pembayarannya dengan klik',
      redirectUrl,
      '',
      `*Mohon selesaikan pembayaran dalam ${expiresInHours} jam.*`,
      '',
      'Terima kasih 😊',
    ].join('\n');
  };

const buildAdminPaymentStartedMessage = ({ record, redirectUrl }) =>
  [
    'Checkout seminar baru dimulai.',
    `Order ID: ${record.orderId}`,
    `Produk: ${record.productLine}`,
    `Total: ${formatCurrency(record.orderTotal)}`,
    `Metode Pembayaran: ${record.paymentMethod}`,
    `Billing First Name: ${record.billingFirstName}`,
    `Billing City: ${record.billingCity}`,
    `Email: ${record.email}`,
    `Phone: ${record.phone}`,
    ...(record.shippingAddress || record.shippingCity || record.deliveryFee > 0
      ? [
          `Alamat Pengiriman: ${formatShippingAddress(record) || '-'}`,
          `Biaya Ongkir: ${formatCurrency(record.deliveryFee)}`,
        ]
      : []),
    `Created Date: ${record.createdDate}`,
    `Link pembayaran: ${redirectUrl}`,
  ].join('\n');

const buildCustomerPaymentCompletedMessage = ({ order, paymentPayload }) => {
  const normalizedOrder = order || {};
  const orderId = normalizedOrder.order_id || normalizedOrder.orderId || paymentPayload.order_id;
  const customerName =
    normalizeField(normalizedOrder.billing_first_name || normalizedOrder.billingFirstName) ||
    extractFirstName(paymentPayload.customer_details?.first_name) ||
    'Bpk/Ibu';
  const amount =
    normalizedOrder.order_total || normalizedOrder.orderTotal || paymentPayload.gross_amount;
  const seminar = getSeminarDetailsForOrder({
    orderId,
    citySlug: paymentPayload.custom_field1,
    productLine: normalizedOrder.product_name_qty_sku || normalizedOrder.productLine,
  });
  const shippingSummary = formatShippingAddress(normalizedOrder);
  const deliveryFee = Number(
    normalizeField(normalizedOrder.delivery_fee || normalizedOrder.deliveryFee).replace(/[^\d]/g, '')
  );
  const shippingLines = shippingSummary
    ? [
        '',
        'Alamat pengiriman buku:',
        `*${shippingSummary}*`,
        ...(deliveryFee > 0
          ? [`Biaya Ongkir: *${formatCompactCurrency(deliveryFee)}*`]
          : []),
      ]
    : [];

  return [
    `Selamat !!! Pembayaran Bpk/Ibu *${customerName}* sejumlah *${formatCompactCurrency(amount)}* sudah kami terima.`,
    '',
    `Bpk/Ibu sudah resmi terdaftar menjadi peserta *${seminar.productName}*.`,
    '',
    `Hari/Tgl : *${seminar.dateLabel}* | *${seminar.timeLabel}*`,
    `Tempat : *${seminar.location}*`,
    ...shippingLines,
    '',
    '*Informasi selanjutnya akan kami berikan segera ya.*',
    `Jika ada yang ingin ditanyakan bisa balas chat ${WATZAP_CS_NAME} di sini`,
    '',
    'Terima kasih \u{1F64F}\u{263A}\u{FE0F}',
  ].join('\n');
};

const sendPaymentCompletedWatzapNotification = async ({
  order,
  paymentPayload,
  wasAlreadyCompleted,
}) => {
  if (
    !WATZAP_API_KEY ||
    !WATZAP_NUMBER_KEY ||
    !WATZAP_NOTIFY_CUSTOMER ||
    wasAlreadyCompleted
  ) {
    return;
  }

  const customerPhone = normalizePhoneNumber(
    order?.phone || order?.whatsapp || paymentPayload.customer_details?.phone
  );

  if (!customerPhone) {
    console.warn('Skipping completed payment WatZap notification: missing customer phone.', {
      orderId: paymentPayload.order_id,
    });
    return;
  }

  await sendWatzapMessage({
    phoneNo: customerPhone,
    message: buildCustomerPaymentCompletedMessage({
      order,
      paymentPayload,
    }),
  });
};

const sendPaymentStartedWatzapNotifications = async ({
  customerName,
  customerPhone,
  record,
  redirectUrl,
  expiresInHours,
}) => {
  if (!WATZAP_API_KEY || !WATZAP_NUMBER_KEY) {
    return;
  }

  const notifications = [];

  if (WATZAP_NOTIFY_CUSTOMER) {
    const normalizedCustomerPhone = normalizePhoneNumber(customerPhone);
    if (normalizedCustomerPhone) {
      notifications.push(
        sendWatzapMessage({
          phoneNo: normalizedCustomerPhone,
          message: buildCustomerPaymentStartedMessage({
            customerName,
            record,
            redirectUrl,
            expiresInHours,
          }),
        })
      );
    }
  }

  if (WATZAP_NOTIFY_ADMINS) {
    const adminMessage = buildAdminPaymentStartedMessage({ record, redirectUrl });
    for (const phoneNo of getConfiguredAdminPhoneNumbers()) {
      notifications.push(
        sendWatzapMessage({
          phoneNo,
          message: adminMessage,
        })
      );
    }
  }

  if (!notifications.length) {
    return;
  }

  await Promise.allSettled(notifications);
};

const logRejectedAutomationResults = (results, labels) => {
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`${labels[index]} error`, result.reason);
    }
  });
};

const buildFormEmailMarkup = (title, fields) => {
  const rows = fields
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #d9e2ec;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border:1px solid #d9e2ec;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;color:#1f2933;">
      <h2 style="margin-bottom:16px;">${escapeHtml(title)}</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
};

const sendEmail = async ({ to, subject, replyTo, text, html, headers = {} }) => {
  if (!mailer) {
    throw new Error('Konfigurasi email server belum lengkap.');
  }

  const normalizedTo = normalizeField(to);
  const normalizedReplyTo = normalizeField(replyTo);
  const normalizedSubject = normalizeField(subject);

  if (!normalizedTo || !emailLooksValid(normalizedTo)) {
    throw new Error('Alamat email tujuan tidak valid.');
  }

  if (normalizedReplyTo && !emailLooksValid(normalizedReplyTo)) {
    throw new Error('Alamat email tidak valid.');
  }

  await mailer.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'TRE Indonesia'}" <${SMTP_FROM_EMAIL}>`,
    to: normalizedTo,
    replyTo: normalizedReplyTo || undefined,
    subject: normalizedSubject,
    text,
    html,
    headers,
  });
};

const sendSupportEmail = async ({ formType, subject, replyTo, fields }) => {
  const sanitizedFields = fields
    .filter((field) => ensureNonEmptyString(field?.label) && ensureNonEmptyString(field?.value))
    .map((field) => ({
      label: normalizeField(field.label),
      value: normalizeField(field.value),
    }));

  if (!sanitizedFields.length) {
    throw new Error('Field form wajib diisi.');
  }

  const normalizedSubject = normalizeField(subject);
  const normalizedFormType = normalizeField(formType);
  const text = [
    normalizedSubject,
    '',
    ...sanitizedFields.map(({ label, value }) => `${label}: ${value}`),
  ].join('\n');

  await sendEmail({
    to: SUPPORT_EMAIL,
    subject: normalizedSubject,
    replyTo,
    text,
    html: buildFormEmailMarkup(normalizedSubject, sanitizedFields),
    headers: {
      'X-TRE-Form-Type': normalizedFormType,
    },
  });
};

const buildFreeTestGoodNewsEmailMarkup = ({ speakerImageUrl, whatsappUrl }) => `
  <div style="margin-top:26px;padding:24px;border:1px solid #c8dfef;border-radius:18px;background:#dff0fb;color:#0d4487;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:top;padding:0 22px 0 0;">
          <h2 style="margin:0 0 12px;color:#103f7f;font-size:30px;line-height:1.2;">Kabar Baiknya..</h2>
          <h3 style="margin:0 0 14px;color:#103f7f;font-size:28px;line-height:1.25;">TRE Hadir Sebagai <span style="color:#f52218;">Solusi</span></h3>
          <p style="margin:0 0 14px;color:#0d4487;line-height:1.7;">
            Sebuah teknik pemulihan Stress dan Trauma yang ditemukan oleh Dr. David Berceli, seorang ahli Psychotherapy dan Therapeutic dari Amerika Serikat dan dibawa <strong>pertama kali ke Indonesia oleh Hindra Gunawan sejak tahun 2013.</strong>
          </p>
          <p style="margin:0;color:#0d4487;line-height:1.7;">
            Teknik yang telah tersebar di 90+ negara ini terbukti sangat efektif, mudah diaplikasikan dan bisa dilakukan kapan saja, sambil nonton, baca buku bahkan sambil bekerja.
          </p>
        </td>
        <td style="width:190px;vertical-align:top;text-align:center;">
          <img src="${escapeHtml(speakerImageUrl)}" alt="Hindra Gunawan dan Dr. David Berceli" width="170" style="display:block;width:170px;max-width:170px;border-radius:999px;border:6px solid #ffffff;margin:0 auto 10px;" />
          <p style="margin:0;color:#0d4487;font-style:italic;font-size:14px;line-height:1.4;">Hindra Gunawan &amp; Dr. David Berceli</p>
        </td>
      </tr>
    </table>
  </div>

  <div style="margin-top:22px;padding:24px;border:1px solid #d9e2ec;border-radius:18px;background:#ffffff;text-align:center;color:#0d4487;">
    <p style="margin:0 0 18px;color:#0d4487;font-size:19px;line-height:1.6;">
      Selama lebih dari 12 tahun menyebarkan teknik TRE di Indonesia, kami telah
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="width:33.333%;padding:10px;text-align:center;">
          <p style="margin:0 0 6px;color:#0d4487;">mengadakan</p>
          <strong style="display:block;color:#f24b35;font-size:36px;line-height:1;">1,500+</strong>
          <span style="display:block;margin-top:8px;color:#0d4487;">Pelatihan Online &amp; Offline</span>
        </td>
        <td style="width:33.333%;padding:10px;text-align:center;">
          <p style="margin:0 0 6px;color:#0d4487;">Kepada lebih dari</p>
          <strong style="display:block;color:#f24b35;font-size:36px;line-height:1;">30,000+</strong>
          <span style="display:block;margin-top:8px;color:#0d4487;">Orang di Indonesia</span>
        </td>
        <td style="width:33.333%;padding:10px;text-align:center;">
          <p style="margin:0 0 6px;color:#0d4487;">di</p>
          <strong style="display:block;color:#f24b35;font-size:36px;line-height:1;">42</strong>
          <span style="display:block;margin-top:8px;color:#0d4487;">Kota</span>
        </td>
      </tr>
    </table>
    <p style="margin:22px 0 0;color:#0d4487;font-size:18px;line-height:1.6;">
      Jika Anda tertarik untuk ikut mempelajari teknik TRE bersama TRE Indonesia dan ingin mengetahui promo spesialnya, klik tombol WhatsApp di bawah ini.
    </p>
    <div style="margin-top:22px;">
      <a href="${escapeHtml(whatsappUrl)}" style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700;">Chat WhatsApp untuk Info Seminar</a>
    </div>
  </div>
`;

const buildTestResultsEmailMarkup = ({
  recipientName,
  resultSummary,
  speakerImageUrl,
  whatsappUrl,
}) => {
  const resultRows = [
    {
      label: 'Jenis Tes',
      value: resultSummary.sourceLabel,
    },
    {
      label: 'Kecemasan',
      value: resultSummary.kecemasanData.level,
    },
  ];

  if (resultSummary.depresiData) {
    resultRows.push({
      label: 'Depresi',
      value: resultSummary.depresiData.level,
    });
  }

  if (resultSummary.stressData) {
    resultRows.push({
      label: 'Stress',
      value: resultSummary.stressData.level,
    });
  }

  const detailSections = [
    {
      title: 'Kecemasan',
      description: resultSummary.kecemasanData.desc,
    },
  ];

  if (resultSummary.depresiData) {
    detailSections.push({
      title: 'Depresi',
      description: resultSummary.depresiData.desc,
    });
  }

  if (resultSummary.stressData) {
    detailSections.push({
      title: 'Stress',
      description: resultSummary.stressData.desc,
    });
  }

  const rowsMarkup = resultRows
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:10px 12px;border:1px solid #d9e2ec;font-weight:600;vertical-align:top;background:#f7fbff;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border:1px solid #d9e2ec;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join('');

  const detailsMarkup = detailSections
    .map(
      ({ title, description }) => `
        <div style="margin-top:18px;">
          <h3 style="margin:0 0 8px;color:#17344d;">${escapeHtml(title)}</h3>
          <p style="margin:0;color:#334e68;line-height:1.6;">${escapeHtml(description)}</p>
        </div>
      `
    )
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;color:#102133;background:#f6fbff;padding:24px;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #d9e2ec;border-radius:18px;padding:28px;">
        <h1 style="margin:0 0 10px;color:#17344d;">Hasil ${escapeHtml(resultSummary.sourceLabel)} Anda</h1>
        <p style="margin:0 0 18px;color:#486581;line-height:1.6;">Halo ${escapeHtml(recipientName)}, berikut ringkasan hasil tes Anda dari TRE Indonesia.</p>
        <table style="border-collapse:collapse;width:100%;">
          <tbody>${rowsMarkup}</tbody>
        </table>
        ${detailsMarkup}
        <div style="margin-top:22px;padding:16px 18px;border-radius:14px;background:#eef6fc;color:#334e68;line-height:1.6;">
          Hasil tes ini bukan diagnosis medis. Jika Anda merasa kondisi emosional mulai mengganggu keseharian, pertimbangkan untuk berkonsultasi dengan profesional kesehatan mental.
        </div>
        ${buildFreeTestGoodNewsEmailMarkup({ speakerImageUrl, whatsappUrl })}
      </div>
    </div>
  `;
};

const buildTestResultsEmailText = ({ recipientName, resultSummary, whatsappUrl }) => {
  const lines = [
    `Halo ${recipientName},`,
    '',
    `Berikut hasil ${resultSummary.sourceLabel} Anda dari TRE Indonesia:`,
    `Kecemasan: ${resultSummary.kecemasanData.level}`,
    resultSummary.depresiData ? `Depresi: ${resultSummary.depresiData.level}` : null,
    resultSummary.stressData ? `Stress: ${resultSummary.stressData.level}` : null,
    '',
    `Penjelasan Kecemasan: ${resultSummary.kecemasanData.desc}`,
    resultSummary.depresiData
      ? `Penjelasan Depresi: ${resultSummary.depresiData.desc}`
      : null,
    resultSummary.stressData ? `Penjelasan Stress: ${resultSummary.stressData.desc}` : null,
    '',
    'Hasil tes ini bukan diagnosis medis.',
    '',
    'Kabar Baiknya..',
    'TRE Hadir Sebagai Solusi',
    'Sebuah teknik pemulihan Stress dan Trauma yang ditemukan oleh Dr. David Berceli dan dibawa pertama kali ke Indonesia oleh Hindra Gunawan sejak tahun 2013.',
    'Selama lebih dari 12 tahun, TRE Indonesia telah mengadakan 1,500+ pelatihan online dan offline kepada lebih dari 30,000+ orang di 42 kota.',
    '',
    `Chat WhatsApp untuk info seminar: ${whatsappUrl}`,
  ];

  return lines.filter(Boolean).join('\n');
};

const sendFreeTestResultsEmail = async ({
  name,
  email,
  resultSummary,
  frontendBaseUrl,
}) => {
  const subject = `Hasil ${resultSummary.sourceLabel} Anda - TRE Indonesia`;
  const normalizedName = normalizeField(name);
  const normalizedEmail = normalizeField(email);
  const publicFrontendBaseUrl =
    getPreferredBaseUrl([
      frontendBaseUrl,
      getConfiguredPublicFrontendBaseUrl(),
      DEFAULT_PUBLIC_FRONTEND_BASE_URL,
    ]) || DEFAULT_PUBLIC_FRONTEND_BASE_URL;
  const whatsappUrl = buildWhatsAppLink(FREE_TEST_WHATSAPP_MESSAGE);
  const speakerImageUrl = `${publicFrontendBaseUrl}/assets/home/hindradavid.png`;

  await sendEmail({
    to: normalizedEmail,
    subject,
    replyTo: SUPPORT_EMAIL,
    text: buildTestResultsEmailText({
      recipientName: normalizedName,
      resultSummary,
      whatsappUrl,
    }),
    html: buildTestResultsEmailMarkup({
      recipientName: normalizedName,
      resultSummary,
      speakerImageUrl,
      whatsappUrl,
    }),
    headers: {
      'X-TRE-Email-Type': 'free-test-results',
    },
  });
};

app.post('/api/forms/submit', async (req, res) => {
  try {
    const { formType, subject, replyTo, fields } = req.body || {};

    if (!mailer) {
      return res.status(500).json({
        message: 'Konfigurasi email server belum lengkap.',
      });
    }

    if (!ensureNonEmptyString(formType) || !ensureNonEmptyString(subject) || !Array.isArray(fields)) {
      return res.status(400).json({
        message: 'Data form tidak lengkap.',
      });
    }

    await sendSupportEmail({ formType, subject, replyTo, fields });

    return res.json({
      message: `Form ${normalizeField(formType)} berhasil dikirim.`,
    });
  } catch (error) {
    console.error('Form submission email error', error);
    return res.status(500).json({
      message: error.message || 'Gagal mengirim email form.',
    });
  }
});

const getPaymentStatusLabel = (transactionStatus, fraudStatus) => {
  if (transactionStatus === 'capture') {
    return fraudStatus === 'challenge' ? 'challenge' : 'paid';
  }

  if (transactionStatus === 'settlement') {
    return 'paid';
  }

  if (transactionStatus === 'pending') {
    return 'pending';
  }

  if (
    transactionStatus === 'deny' ||
    transactionStatus === 'cancel' ||
    transactionStatus === 'expire'
  ) {
    return 'failed';
  }

  return transactionStatus || 'unknown';
};

const verifyMidtransSignature = ({
  order_id,
  status_code,
  gross_amount,
  signature_key,
}) => {
  if (!MIDTRANS_SERVER_KEY || !order_id || !status_code || !gross_amount || !signature_key) {
    return false;
  }

  const expectedSignature = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
    .digest('hex');

  return expectedSignature === signature_key;
};

app.post('/api/midtrans/transactions', async (req, res) => {
  try {
    const {
      city,
      cityName,
      name,
      email,
      whatsapp,
      domicile,
      shippingAddress,
      paymentMethod,
      couponCode,
      utm,
    } = req.body || {};
    const seminar = getSeminarConfig(city, cityName);
    const isOnlineSeminar = city === ONLINE_SEMINAR_SLUG;
    const normalizedShippingAddress = normalizeShippingAddress(shippingAddress);
    const deliveryFee = getDeliveryFeeForCity(city);
    const normalizedCouponCode = normalizeCouponCode(couponCode);
    const appliedCoupon = normalizedCouponCode
      ? PAYMENT_COUPON_LOOKUP[normalizedCouponCode]
      : null;
    const selectedPaymentMethod = paymentMethod
      ? PAYMENT_METHOD_LOOKUP[paymentMethod]
      : null;
    const couponDiscount = getCouponDiscount(appliedCoupon, seminar.price);
    const grossAmount = seminar.price + deliveryFee - couponDiscount;

    if (!city || !name || !email || !whatsapp || !domicile) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    if (isOnlineSeminar && !hasCompleteShippingAddress(normalizedShippingAddress)) {
      return res.status(400).json({
        message: 'Alamat pengiriman buku wajib diisi lengkap.',
      });
    }

    if (paymentMethod && !selectedPaymentMethod) {
      return res.status(400).json({ message: 'Metode pembayaran tidak valid.' });
    }

    if (couponCode && !appliedCoupon) {
      return res.status(400).json({ message: 'Kupon tidak valid atau belum aktif.' });
    }

    if (grossAmount <= 0) {
      return res.status(400).json({ message: 'Total pembayaran harus lebih besar dari Rp 0.' });
    }

    if (!MIDTRANS_SERVER_KEY) {
      return res.status(500).json({ message: 'Midtrans server key belum diset.' });
    }

    const orderId = `tre-${city}-${Date.now()}`;
    const createdAt = new Date();
    const frontendBaseUrl = getFrontendBaseUrl(req);

    if (!frontendBaseUrl) {
      return res.status(500).json({ message: 'Frontend base URL belum tersedia.' });
    }

    const callbackBaseUrl = `${frontendBaseUrl}${seminar.paymentPath}`;
    const itemDetails = [
      {
        id: `seminar-${city}`,
        price: seminar.price - couponDiscount,
        quantity: 1,
        name: seminar.label,
      },
    ];

    if (deliveryFee > 0) {
      itemDetails.push({
        id: `ongkir-buku-${city}`,
        price: deliveryFee,
        quantity: 1,
        name: 'Biaya Ongkir Buku',
      });
    }

    const transactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: name,
        email,
        phone: whatsapp,
      },
      custom_field1: city,
      custom_field2: domicile,
      callbacks: {
        finish: `${callbackBaseUrl}?status=success&order_id=${encodeURIComponent(orderId)}`,
        error: `${callbackBaseUrl}?status=failed&order_id=${encodeURIComponent(orderId)}`,
        unfinish: `${callbackBaseUrl}?status=pending&order_id=${encodeURIComponent(orderId)}`,
      },
      expiry: {
        unit: 'hours',
        duration: 24,
      },
    };

    if (isOnlineSeminar) {
      transactionPayload.customer_details.shipping_address = {
        first_name: name,
        phone: whatsapp,
        address: formatShippingAddress(normalizedShippingAddress).replace(/\n/g, ', '),
        city: normalizedShippingAddress.city,
        postal_code: normalizedShippingAddress.postalCode,
        country_code: 'IDN',
      };
    }

    if (appliedCoupon) {
      transactionPayload.custom_field3 = appliedCoupon.code;
    }

    if (selectedPaymentMethod?.enabledPayments?.length) {
      transactionPayload.enabled_payments = selectedPaymentMethod.enabledPayments;
    }

    const response = await fetch(`${MIDTRANS_SNAP_BASE_URL}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: buildBasicAuthHeader(MIDTRANS_SERVER_KEY),
      },
      body: JSON.stringify(transactionPayload),
    });

    const rawBody = await response.text();
    const payload = parseJsonSafely(rawBody);

    if (!response.ok) {
      return res.status(response.status).json({
        message:
          payload?.error_messages?.[0] ||
          payload?.status_message ||
          payload?.raw ||
          'Gagal membuat transaksi Midtrans.',
        details: payload,
      });
    }

    const paymentStartRecord = buildPaymentStartRecord({
      orderId,
      city,
      seminar,
      grossAmount,
      selectedPaymentMethod,
      name,
      email,
      whatsapp,
      domicile,
      shippingAddress: normalizedShippingAddress,
      deliveryFee,
      utm,
      createdAt,
    });

    if (mailer) {
      try {
        await sendSupportEmail({
          formType: 'payment-registration',
          subject: `Pendaftaran Pembayaran ${seminar.label}`,
          replyTo: email,
          fields: [
            { label: 'Nama Lengkap', value: name },
            { label: 'Email', value: email },
            { label: 'Whatsapp', value: whatsapp },
            { label: 'Kota Domisili', value: domicile },
            ...(isOnlineSeminar
              ? [
                  { label: 'Alamat Lengkap', value: normalizedShippingAddress.address },
                  { label: 'Kecamatan', value: normalizedShippingAddress.district },
                  { label: 'Kode Pos', value: normalizedShippingAddress.postalCode },
                  { label: 'Kota Pengiriman', value: normalizedShippingAddress.city },
                  { label: 'Biaya Ongkir', value: formatCurrency(deliveryFee) },
                ]
              : []),
            { label: 'Seminar', value: seminar.label },
            { label: 'Order ID', value: orderId },
            {
              label: 'Metode Pembayaran',
              value: getRequestedPaymentMethodLabel(selectedPaymentMethod),
            },
            {
              label: 'Kupon',
              value: appliedCoupon
                ? `${appliedCoupon.code} (-${couponDiscount.toLocaleString('id-ID')})`
                : 'Tidak ada',
            },
            { label: 'Total', value: formatCurrency(grossAmount) },
          ],
        });
      } catch (mailError) {
        console.error('Payment registration email error', mailError);
      }
    }

    const automationResults = await Promise.allSettled([
      pushPaymentStartToGoogleSheets(paymentStartRecord),
      sendPaymentStartedWatzapNotifications({
        customerName: name,
        customerPhone: whatsapp,
        record: paymentStartRecord,
        redirectUrl: payload.redirect_url,
        expiresInHours: transactionPayload.expiry.duration,
      }),
    ]);
    logRejectedAutomationResults(automationResults, [
      'Google Sheets payment start',
      'WatZap payment start notification',
    ]);

    return res.json({
      token: payload.token,
      redirect_url: payload.redirect_url,
      order_id: orderId,
    });
  } catch (error) {
    console.error('Midtrans transaction error', error);
    return res.status(500).json({
      message: error.message || 'Terjadi kesalahan server.',
    });
  }
});

app.get('/api/midtrans/transactions/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!MIDTRANS_SERVER_KEY) {
      return res.status(500).json({ message: 'Midtrans server key belum diset.' });
    }

    const response = await fetch(
      `${MIDTRANS_API_BASE_URL}/v2/${encodeURIComponent(orderId)}/status`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: buildBasicAuthHeader(MIDTRANS_SERVER_KEY),
        },
      }
    );
    const rawBody = await response.text();
    const payload = parseJsonSafely(rawBody);

    if (!response.ok) {
      return res.status(response.status).json({
        message: payload?.status_message || 'Gagal mengambil status transaksi.',
        details: payload,
      });
    }

    return res.json({
      order_id: payload.order_id,
      transaction_status: payload.transaction_status,
      fraud_status: payload.fraud_status,
      payment_type: payload.payment_type,
      status_code: payload.status_code,
      gross_amount: payload.gross_amount,
      status_label: getPaymentStatusLabel(payload.transaction_status, payload.fraud_status),
    });
  } catch (error) {
    console.error('Midtrans status error', error);
    return res.status(500).json({
      message: error.message || 'Terjadi kesalahan server.',
    });
  }
});

app.post('/api/tests/send-results', async (req, res) => {
  try {
    const {
      name,
      email,
      kecemasan = null,
      depresi = null,
      stress = null,
    } = req.body || {};

    if (!mailer) {
      return res.status(500).json({
        message: 'Konfigurasi email server belum lengkap.',
      });
    }

    if (!ensureNonEmptyString(name) || !ensureNonEmptyString(email)) {
      return res.status(400).json({
        message: 'Nama dan email wajib diisi.',
      });
    }

    if (!emailLooksValid(normalizeField(email))) {
      return res.status(400).json({
        message: 'Alamat email tidak valid.',
      });
    }

    if (!hasCompleteTestResults({ kecemasan, depresi, stress })) {
      return res.status(400).json({
        message: 'Hasil tes tidak lengkap.',
      });
    }

    const resultSummary = buildTestResultPayload({ kecemasan, depresi, stress });
    const frontendBaseUrl =
      getFrontendBaseUrl(req) ||
      getConfiguredPublicFrontendBaseUrl() ||
      DEFAULT_PUBLIC_FRONTEND_BASE_URL;

    await sendFreeTestResultsEmail({
      name,
      email,
      resultSummary,
      frontendBaseUrl,
    });

    return res.json({
      message: `Hasil tes berhasil dikirim ke ${normalizeField(email)}.`,
    });
  } catch (error) {
    console.error('Free test results email error', error);
    return res.status(500).json({
      message: error.message || 'Gagal mengirim hasil tes.',
    });
  }
});

app.post('/api/midtrans/notifications', async (req, res) => {
  const payload = req.body || {};
  const isValid = verifyMidtransSignature(payload);

  if (!isValid) {
    return res.status(403).json({ message: 'Signature Midtrans tidak valid.' });
  }

  const statusLabel = getPaymentStatusLabel(payload.transaction_status, payload.fraud_status);

  console.log('Midtrans notification received', {
    orderId: payload.order_id,
    transactionStatus: payload.transaction_status,
    fraudStatus: payload.fraud_status,
    paymentType: payload.payment_type,
    statusLabel,
  });

  let sheetUpdateResult;

  try {
    sheetUpdateResult = await updatePaymentInGoogleSheets({
      orderId: payload.order_id,
      paymentMethod: formatMidtransPaymentMethod(payload.payment_type),
      statusLabel,
    });
  } catch (error) {
    console.error('Google Sheets payment update error', error);
  }

  try {
    if (statusLabel === 'paid') {
      await sendPaymentCompletedWatzapNotification({
        order: sheetUpdateResult?.order,
        paymentPayload: payload,
        wasAlreadyCompleted: sheetUpdateResult?.wasAlreadyCompleted,
      });
    }
  } catch (error) {
    console.error('WatZap completed payment notification error', error);
  }

  // Persist payment status here when you add a database or CRM.
  return res.status(200).json({ received: true, status: statusLabel });
});

app.use(express.static(frontendBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  return res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});
