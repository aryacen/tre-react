import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_USER;
const SUPPORT_EMAIL = process.env.FORM_TO_EMAIL || 'support@treindonesia.com';
const MIDTRANS_SNAP_BASE_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com'
  : 'https://app.sandbox.midtrans.com';
const MIDTRANS_API_BASE_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://api.midtrans.com'
  : 'https://api.sandbox.midtrans.com';
const SEMINAR_PRICE = 299000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.resolve(__dirname, '../build');

if (!MIDTRANS_SERVER_KEY) {
  console.warn('Missing MIDTRANS_SERVER_KEY in environment.');
}

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM_EMAIL) {
  console.warn('SMTP configuration is incomplete. Form email delivery is disabled.');
}

app.use(cors({ origin: FRONTEND_BASE_URL }));
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

const emailLooksValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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

const sendSupportEmail = async ({ formType, subject, replyTo, fields }) => {
  if (!mailer) {
    throw new Error('Konfigurasi email server belum lengkap.');
  }

  const sanitizedFields = fields
    .filter((field) => ensureNonEmptyString(field?.label) && ensureNonEmptyString(field?.value))
    .map((field) => ({
      label: normalizeField(field.label),
      value: normalizeField(field.value),
    }));

  if (!sanitizedFields.length) {
    throw new Error('Field form wajib diisi.');
  }

  const normalizedReplyTo = normalizeField(replyTo);

  if (normalizedReplyTo && !emailLooksValid(normalizedReplyTo)) {
    throw new Error('Alamat email tidak valid.');
  }

  const normalizedSubject = normalizeField(subject);
  const normalizedFormType = normalizeField(formType);
  const text = [
    normalizedSubject,
    '',
    ...sanitizedFields.map(({ label, value }) => `${label}: ${value}`),
  ].join('\n');

  await mailer.sendMail({
    from: SMTP_FROM_EMAIL,
    to: SUPPORT_EMAIL,
    replyTo: normalizedReplyTo || undefined,
    subject: normalizedSubject,
    text,
    html: buildFormEmailMarkup(normalizedSubject, sanitizedFields),
    headers: {
      'X-TRE-Form-Type': normalizedFormType,
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
    const { city, cityName, name, email, whatsapp, domicile } = req.body || {};

    if (!city || !name || !email || !whatsapp || !domicile) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    if (!MIDTRANS_SERVER_KEY) {
      return res.status(500).json({ message: 'Midtrans server key belum diset.' });
    }

    const orderId = `tre-${city}-${Date.now()}`;
    const transactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: SEMINAR_PRICE,
      },
      item_details: [
        {
          id: `seminar-${city}`,
          price: SEMINAR_PRICE,
          quantity: 1,
          name: `Seminar TRE ${cityName || city}`,
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
        finish: `${FRONTEND_BASE_URL}/tre-individuals/${city}/payment?status=success`,
        error: `${FRONTEND_BASE_URL}/tre-individuals/${city}/payment?status=failed`,
      },
      expiry: {
        unit: 'hours',
        duration: 24,
      },
    };

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

    if (mailer) {
      try {
        await sendSupportEmail({
          formType: 'payment-registration',
          subject: `Pendaftaran Pembayaran Seminar TRE ${cityName || city}`,
          replyTo: email,
          fields: [
            { label: 'Nama Lengkap', value: name },
            { label: 'Email', value: email },
            { label: 'Whatsapp', value: whatsapp },
            { label: 'Kota Domisili', value: domicile },
            { label: 'Kota Seminar', value: cityName || city },
            { label: 'Order ID', value: orderId },
          ],
        });
      } catch (mailError) {
        console.error('Payment registration email error', mailError);
      }
    }

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

app.post('/api/midtrans/notifications', (req, res) => {
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
