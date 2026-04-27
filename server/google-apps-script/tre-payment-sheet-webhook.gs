const SPREADSHEET_ID = '10pKfHYCbwtlvXuuCchm1I5pDi4Bh58RUvVJfqbLWxE4';
const SHEET_GID = 240346658;
const WEBHOOK_SECRET = 'replace-this-with-a-random-secret';
const HEADERS = [
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

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    if (WEBHOOK_SECRET && payload.secret !== WEBHOOK_SECRET) {
      return jsonResponse_({ ok: false, message: 'Invalid secret.' });
    }

    const sheet = getTargetSheet_();
    ensureHeaders_(sheet);

    if (payload.event === 'payment_started') {
      const row = Array.isArray(payload.row) ? payload.row.slice(0, HEADERS.length) : [];
      while (row.length < HEADERS.length) {
        row.push('');
      }

      const rowIndex = upsertOrderRow_(sheet, payload.order_id, row);
      return jsonResponse_({ ok: true, event: payload.event, rowIndex: rowIndex });
    }

    if (payload.event === 'payment_updated') {
      const rowIndex = updateExistingOrderRow_(sheet, payload.order_id, payload.updates || {});
      return jsonResponse_({ ok: true, event: payload.event, rowIndex: rowIndex });
    }

    return jsonResponse_({ ok: false, message: 'Unsupported event.' });
  } catch (error) {
    return jsonResponse_({ ok: false, message: String(error) });
  }
}

function getTargetSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const targetSheet = spreadsheet
    .getSheets()
    .find(function (sheet) {
      return sheet.getSheetId() === SHEET_GID;
    });

  if (!targetSheet) {
    throw new Error('Target sheet not found for configured gid.');
  }

  return targetSheet;
}

function ensureHeaders_(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  const currentHeaders = headerRange.getValues()[0];
  const needsHeaderWrite = HEADERS.some(function (header, index) {
    return currentHeaders[index] !== header;
  });

  if (needsHeaderWrite) {
    headerRange.setValues([HEADERS]);
  }
}

function findOrderRowIndex_(sheet, orderId) {
  if (!orderId) {
    return 0;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return 0;
  }

  const orderIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var index = 0; index < orderIds.length; index += 1) {
    if (String(orderIds[index][0]) === String(orderId)) {
      return index + 2;
    }
  }

  return 0;
}

function upsertOrderRow_(sheet, orderId, row) {
  var rowIndex = findOrderRowIndex_(sheet, orderId);
  if (!rowIndex) {
    rowIndex = sheet.getLastRow() + 1;
  }

  sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([row]);
  return rowIndex;
}

function updateExistingOrderRow_(sheet, orderId, updates) {
  var rowIndex = findOrderRowIndex_(sheet, orderId);
  var row;

  if (rowIndex) {
    row = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0];
  } else {
    rowIndex = sheet.getLastRow() + 1;
    row = ['', '', '', '', '', '', '', '', ''];
    row[0] = orderId || '';
  }

  if (updates.payment_method) {
    row[3] = updates.payment_method;
  }

  sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([row]);
  return rowIndex;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
