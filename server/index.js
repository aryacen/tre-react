import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  PAYMENT_COUPON_LOOKUP,
  PAYMENT_METHOD_LOOKUP,
  getCouponDiscount,
  normalizeCouponCode,
} from '../src/data/paymentConfig.js';
import {
  buildTestResultPayload,
  hasCompleteTestResults,
} from '../src/utils/testResults.js';

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
const WATZAP_NOTIFY_CUSTOMER = process.env.WATZAP_NOTIFY_CUSTOMER !== 'false';
const WATZAP_NOTIFY_ADMINS = process.env.WATZAP_NOTIFY_ADMINS !== 'false';
const MIDTRANS_SNAP_BASE_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com'
  : 'https://app.sandbox.midtrans.com';
const MIDTRANS_API_BASE_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://api.midtrans.com'
  : 'https://api.sandbox.midtrans.com';
const DEFAULT_SEMINAR_PRICE = 299000;
const ONLINE_SEMINAR_SLUG = 'online';
const INDONESIA_TIME_ZONE = 'Asia/Jakarta';
const GOOGLE_SHEETS_ORDER_COLUMNS = [
  'Order ID',
  'Product name (QTY) (SKU)',
  'Order Total',
  'Payment Method',
  'Billing First name',
  'Billing City',
  'Email',
  'Phone',
  'Created Date',
];
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

const getSeminarConfig = (city, cityName) => {
  if (city === ONLINE_SEMINAR_SLUG) {
    return {
      label: cityName || 'Seminar TRE Online',
      price: 199000,
      paymentPath: '/tre-online/payment',
    };
  }

  return {
    label: cityName || `Seminar TRE ${city}`,
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
  createdAt,
}) => {
  const sku = `seminar-${city}`;
  const normalizedPhone = normalizePhoneNumber(whatsapp);

  return {
    orderId,
    productName: seminar.label,
    productQty: 1,
    sku,
    productLine: `${seminar.label} (1) (${sku})`,
    orderTotal: grossAmount,
    paymentMethod: getRequestedPaymentMethodLabel(selectedPaymentMethod),
    billingFirstName: extractFirstName(name),
    billingCity: normalizeField(domicile),
    email: normalizeField(email),
    phone: normalizedPhone || normalizeField(whatsapp),
    createdDate: formatDateTimeForIndonesia(createdAt),
    createdAtIso: createdAt.toISOString(),
  };
};

const getPaymentStartSheetRow = (record) => [
  record.orderId,
  record.productLine,
  record.orderTotal,
  record.paymentMethod,
  record.billingFirstName,
  record.billingCity,
  record.email,
  record.phone,
  record.createdDate,
];

const pushPaymentStartToGoogleSheets = async (record) => {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return;
  }

  return postJson(GOOGLE_SHEETS_WEBHOOK_URL, {
    secret: GOOGLE_SHEETS_WEBHOOK_SECRET,
    event: 'payment_started',
    order_id: record.orderId,
    columns: GOOGLE_SHEETS_ORDER_COLUMNS,
    row: getPaymentStartSheetRow(record),
    order: record,
  });
};

const updatePaymentMethodInGoogleSheets = async ({ orderId, paymentMethod }) => {
  if (!GOOGLE_SHEETS_WEBHOOK_URL || !paymentMethod) {
    return;
  }

  return postJson(GOOGLE_SHEETS_WEBHOOK_URL, {
    secret: GOOGLE_SHEETS_WEBHOOK_SECRET,
    event: 'payment_updated',
    order_id: orderId,
    updates: {
      payment_method: paymentMethod,
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
  [
    `Halo ${normalizeField(customerName)},`,
    '',
    'Pesanan seminar TRE Anda sudah dibuat.',
    `Order ID: ${record.orderId}`,
    `Produk: ${record.productLine}`,
    `Total: ${formatCurrency(record.orderTotal)}`,
    `Metode Pembayaran: ${record.paymentMethod}`,
    `Tanggal Dibuat: ${record.createdDate}`,
    '',
    `Link pembayaran: ${redirectUrl}`,
    '',
    `Silakan selesaikan pembayaran dalam ${expiresInHours} jam.`,
  ].join('\n');

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
    `Created Date: ${record.createdDate}`,
    `Link pembayaran: ${redirectUrl}`,
  ].join('\n');

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

const buildTestResultsEmailMarkup = ({ recipientName, resultSummary, ctaUrl }) => {
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
        <div style="margin-top:22px;">
          <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:#f5562f;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:700;">Pelajari TRE Lebih Lanjut</a>
        </div>
      </div>
    </div>
  `;
};

const buildTestResultsEmailText = ({ recipientName, resultSummary, ctaUrl }) => {
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
    `Pelajari TRE lebih lanjut: ${ctaUrl}`,
  ];

  return lines.filter(Boolean).join('\n');
};

const sendFreeTestResultsEmail = async ({ name, email, resultSummary, ctaUrl }) => {
  const subject = `Hasil ${resultSummary.sourceLabel} Anda - TRE Indonesia`;
  const normalizedName = normalizeField(name);
  const normalizedEmail = normalizeField(email);

  await sendEmail({
    to: normalizedEmail,
    subject,
    replyTo: SUPPORT_EMAIL,
    text: buildTestResultsEmailText({
      recipientName: normalizedName,
      resultSummary,
      ctaUrl,
    }),
    html: buildTestResultsEmailMarkup({
      recipientName: normalizedName,
      resultSummary,
      ctaUrl,
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
      paymentMethod,
      couponCode,
    } = req.body || {};
    const seminar = getSeminarConfig(city, cityName);
    const normalizedCouponCode = normalizeCouponCode(couponCode);
    const appliedCoupon = normalizedCouponCode
      ? PAYMENT_COUPON_LOOKUP[normalizedCouponCode]
      : null;
    const selectedPaymentMethod = paymentMethod
      ? PAYMENT_METHOD_LOOKUP[paymentMethod]
      : null;
    const grossAmount = seminar.price - getCouponDiscount(appliedCoupon, seminar.price);

    if (!city || !name || !email || !whatsapp || !domicile) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
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
    const transactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details: [
        {
          id: `seminar-${city}`,
          price: grossAmount,
          quantity: 1,
          name: seminar.label,
        },
      ],
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
            { label: 'Seminar', value: seminar.label },
            { label: 'Order ID', value: orderId },
            {
              label: 'Metode Pembayaran',
              value: getRequestedPaymentMethodLabel(selectedPaymentMethod),
            },
            {
              label: 'Kupon',
              value: appliedCoupon
                ? `${appliedCoupon.code} (-${getCouponDiscount(appliedCoupon, seminar.price).toLocaleString('id-ID')})`
                : 'Tidak ada',
            },
            { label: 'Total', value: grossAmount.toLocaleString('id-ID') },
          ],
        });
      } catch (mailError) {
        console.error('Payment registration email error', mailError);
      }
    }

    await Promise.allSettled([
      pushPaymentStartToGoogleSheets(paymentStartRecord),
      sendPaymentStartedWatzapNotifications({
        customerName: name,
        customerPhone: whatsapp,
        record: paymentStartRecord,
        redirectUrl: payload.redirect_url,
        expiresInHours: transactionPayload.expiry.duration,
      }),
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
      ctaUrl: `${trimTrailingSlash(frontendBaseUrl)}/belajar-tre`,
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

  try {
    await updatePaymentMethodInGoogleSheets({
      orderId: payload.order_id,
      paymentMethod: formatMidtransPaymentMethod(payload.payment_type),
    });
  } catch (error) {
    console.error('Google Sheets payment update error', error);
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
