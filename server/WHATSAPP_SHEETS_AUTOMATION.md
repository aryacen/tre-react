# Seminar Checkout Automation

This backend now triggers automation when a seminar payment session is created at `POST /api/midtrans/transactions`.

## What gets captured

The payment-start event sends these 9 fields to Google Sheets:

1. `Order ID`
2. `Product name (QTY) (SKU)`
3. `Order Total`
4. `Payment Method`
5. `Billing First name`
6. `Billing City`
7. `Email`
8. `Phone`
9. `Created Date`

It also sends WhatsApp messages through WatZap:

1. Customer notification with order details and the Midtrans payment link.
2. Admin notification for each number in `WATZAP_ADMIN_PHONE_NUMBERS`.

If Midtrans later sends a payment notification with a concrete `payment_type`, the server updates the `Payment Method` cell in the sheet for that `order_id`.

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
```

Notes:

- `WATZAP_ADMIN_PHONE_NUMBERS` accepts a comma-separated list.
- Customer numbers are normalized to Indonesian format when possible, for example `0812...` becomes `62812...`.
- If `paymentMethod` is not chosen on the checkout form, the initial sheet row uses `Midtrans Snap`. When Midtrans later reports the actual payment type, the sheet row is updated.

## Google Sheets setup

The ready-to-deploy Apps Script file is:

`server/google-apps-script/tre-payment-sheet-webhook.gs`

It is already preconfigured for this spreadsheet:

`https://docs.google.com/spreadsheets/d/10pKfHYCbwtlvXuuCchm1I5pDi4Bh58RUvVJfqbLWxE4/edit?gid=240346658#gid=240346658`

### Deploy steps

1. Open Google Apps Script and create a new standalone project.
2. Paste the contents of `tre-payment-sheet-webhook.gs`.
3. Change `WEBHOOK_SECRET` to the same value you place in `GOOGLE_SHEETS_WEBHOOK_SECRET`.
4. Deploy as a Web app.
5. Set:
   Execute as: `Me`
   Who has access: `Anyone`
6. Copy the deployed `/exec` URL into `GOOGLE_SHEETS_WEBHOOK_URL`.

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
