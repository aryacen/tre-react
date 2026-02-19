import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;

if (!XENDIT_SECRET_KEY) {
  console.warn('Missing XENDIT_SECRET_KEY in environment.');
}

app.use(cors({ origin: FRONTEND_BASE_URL }));
app.use(express.json());

app.post('/api/xendit/invoices', async (req, res) => {
  try {
    const { city, cityName, name, email, whatsapp, domicile } = req.body || {};

    if (!city || !name || !email || !whatsapp || !domicile) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    if (!XENDIT_SECRET_KEY) {
      return res.status(500).json({ message: 'Xendit key belum diset.' });
    }

    const invoicePayload = {
      external_id: `tre-${city}-${Date.now()}`,
      amount: 299000,
      payer_email: email,
      description: `Seminar TRE ${cityName || city}`,
      customer: {
        given_names: name,
        email,
        mobile_number: whatsapp,
      },
      customer_notification_preference: {
        invoice_created: ['email', 'whatsapp'],
        invoice_paid: ['email', 'whatsapp'],
      },
      success_redirect_url: `${FRONTEND_BASE_URL}/tre-individuals/${city}/payment?status=success`,
      failure_redirect_url: `${FRONTEND_BASE_URL}/tre-individuals/${city}/payment?status=failed`,
      metadata: {
        city,
        domicile,
      },
    };

    const response = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${XENDIT_SECRET_KEY}:`).toString('base64')}`,
      },
      body: JSON.stringify(invoicePayload),
    });

    const payload = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: payload?.message || 'Gagal membuat invoice.',
        details: payload,
      });
    }

    return res.json({ invoice_url: payload.invoice_url, id: payload.id });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});
