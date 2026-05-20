# Seminar Checkout Automation

This backend now triggers automation when a seminar payment session is created at `POST /api/midtrans/transactions`.

## What gets captured

The payment-start event writes a row to the `Pending Orders` tab using the same column positions as the target sheet:

1. A: `Order Id`
2. B: `Product name(QTY)(SKU)`
3. D: `Order Total`
4. E: `Payment Method`
5. F: `Billing First name`
6. J: `Billing City`
7. Z: `Email`
8. AA: `Phone`
9. AC: `Created Date`
10. AD: `Status Follow Up`
11. AE: `UTM Source`
12. AF: `UTM Medium`
13. AG: `UTM Campaign`
14. AH: `UTM Content`
15. AI: `Alamat Lengkap`
16. AJ: `Kecamatan`
17. AK: `Kode Pos`
18. AL: `Kota Pengiriman`
19. AM: `Biaya Ongkir`

New rows are written to the next available row after the last row containing order data in the mapped order columns. This avoids both top insertion and `getLastRow()` being misled by formatting-only rows.

It also sends WhatsApp messages through WatZap:

1. Customer notification with order details and the Midtrans payment link.
2. Admin notification for each number in `WATZAP_ADMIN_PHONE_NUMBERS`.

If Midtrans later sends a payment notification, the server updates the `Payment Method` and `Status Follow Up` cells for that `order_id`. Paid orders are moved to `Completed Orders`, failed/cancelled/expired orders are moved to `Cancelled Orders`, and challenged orders are moved to `On Hold Orders`.

New Midtrans transactions also send `X-Override-Notification` with the canonical backend URL:

`https://www.treindonesia.com/api/midtrans/notifications`

Keep the dashboard Payment Notification URL on the same `www` URL as a fallback. Avoid the non-www URL because it redirects, and webhook providers may not reliably follow redirects for POST notifications.

The Apps Script also includes a fallback expiry job. `cancelExpiredPendingOrders()` scans `Pending Orders` and moves rows older than 24 hours to `Cancelled Orders`. This is useful if a Midtrans `expire` webhook is delayed or missed.

## Free Test Leads

When `/tes-gratis` users request their result email, the backend also sends a `free_test_lead_created` event to the same Apps Script webhook.

The event writes to spreadsheet `12aoh6enGOns26uAf0jdwr83xaz1-b9PSEFQ6lzmvb9s`, tab `Tes Gratis`, using:

1. A: `Tanggal`
2. B: `Nama`
3. C: `Email`
4. H: `Sumber`, defaulting to `Leads Web`

The diagnostic response includes `leadMagnet.nextAvailableRow` so you can verify where the next test lead will be written.

## Server env

Add these values in `server/.env`:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/your-web-app-id/exec
GOOGLE_SHEETS_WEBHOOK_SECRET=replace-this-with-a-random-secret
WATZAP_API_KEY=your-watzap-api-key
WATZAP_NUMBER_KEY=your-watzap-number-key
WATZAP_ADMIN_PHONE_NUMBERS=6281234567890,6289876543210
WATZAP_NOTIFY_CUSTOMER=true
WATZAP_NOTIFY_ADMINS=true
WATZAP_API_BASE_URL=https://api.watzap.id/v1
WATZAP_CS_NAME={{cs_name}}
ONLINE_DELIVERY_FEE=10000
```

Notes:

- `WATZAP_ADMIN_PHONE_NUMBERS` accepts a comma-separated list.
- Customer numbers are normalized to Indonesian format when possible, for example `0812...` becomes `62812...`.
- If `paymentMethod` is not chosen on the checkout form, the initial sheet row uses `Midtrans Snap`. When Midtrans later reports the actual payment type, the sheet row is updated.
- UTM values are captured from `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` URL parameters, stored in the browser, and sent with checkout.
- Online seminar checkout requires `Alamat Lengkap`, `Kecamatan`, `Kode Pos`, and `Kota Pengiriman` for book delivery.
- Online delivery fee defaults to `10000` (Rp10.000). If you override it, set the same amount in the React build env as `REACT_APP_ONLINE_DELIVERY_FEE` so the checkout summary matches the server charge.
- `WATZAP_CS_NAME` is used in the completed-payment customer message. Leave it as `{{cs_name}}` if you want WatZap to handle that placeholder.

## Google Sheets setup

The ready-to-deploy Apps Script file is:

`server/google-apps-script/tre-payment-sheet-webhook.gs`

It is already preconfigured for this spreadsheet:

`https://docs.google.com/spreadsheets/d/10pKfHYCbwtlvXuuCchm1I5pDi4Bh58RUvVJfqbLWxE4/edit?gid=240346658#gid=240346658`

### Deploy steps

1. Open Google Apps Script and create a new standalone project.
2. Paste the contents of `tre-payment-sheet-webhook.gs`.
3. Change `WEBHOOK_SECRET` to the same value you place in `GOOGLE_SHEETS_WEBHOOK_SECRET`.
4. Deploy as a Web app. If you are editing an existing deployment, choose `Manage deployments`, edit the web app, select `New version`, then deploy.
5. Set:
   Execute as: `Me`
   Who has access: `Anyone`
6. Copy the deployed `/exec` URL into `GOOGLE_SHEETS_WEBHOOK_URL`.

After deployment, a diagnostic POST with `{ "event": "diagnostic" }` and the webhook secret should return `ok: true` plus the four order sheet names. If it returns `success: false` or an `appendRow` error, the deployed Apps Script is still an older version.

For the next-row and expiry-fallback version, the diagnostic response must include:

```json
{
  "scriptVersion": "2026-05-20-lead-magnet-next-data-row",
  "insertMode": "next_empty_order_data_row",
  "expiryHours": 24
}
```

Each sheet entry in the diagnostic response also includes `nextAvailableRow`, which is the row the next new order would use for that tab.

### Expiry fallback trigger

After deploying the script, run `installHourlyExpiryTrigger()` once from the Apps Script editor. It creates an hourly trigger for `cancelExpiredPendingOrders()`, which moves pending rows older than 24 hours into `Cancelled Orders`.

You can also test the fallback manually by running `cancelExpiredPendingOrders()` from the Apps Script editor, or by POSTing:

```json
{
  "secret": "your-webhook-secret",
  "event": "cancel_expired_pending"
}
```

## WatZap request format used by the backend

The backend sends JSON to:

`POST https://api.watzap.id/v1/send_message`

with:

```json
{
  "api_key": "your-api-key",
  "number_key": "your-number-key",
  "phone_no": "6281234567890",
  "message": "..."
}
```
