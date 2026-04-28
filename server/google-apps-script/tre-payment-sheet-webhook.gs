const SPREADSHEET_ID = '10pKfHYCbwtlvXuuCchm1I5pDi4Bh58RUvVJfqbLWxE4';
const WEBHOOK_SECRET = 'replace-this-with-a-random-secret';

const SHEET_NAMES = {
  pending: 'Pending Orders',
  onHold: 'On Hold Orders',
  cancelled: 'Cancelled Orders',
  completed: 'Completed Orders',
};

const ORDER_SHEET_NAMES = [
  SHEET_NAMES.pending,
  SHEET_NAMES.onHold,
  SHEET_NAMES.cancelled,
  SHEET_NAMES.completed,
];

const COLUMN_MAP = {
  order_id: 1,
  product_name_qty_sku: 2,
  order_total: 4,
  payment_method: 5,
  billing_first_name: 6,
  billing_city: 10,
  email: 26,
  phone: 27,
  created_date: 29,
  status_follow_up: 30,
  utm_source: 31,
  utm_medium: 32,
  utm_campaign: 33,
  utm_content: 34,
  shipping_address: 35,
  shipping_district: 36,
  shipping_postal_code: 37,
  shipping_city: 38,
  delivery_fee: 39,
};

const HEADER_MAP = {
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

const MAX_ORDER_COLUMN = 39;

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    if (WEBHOOK_SECRET && payload.secret !== WEBHOOK_SECRET) {
      return jsonResponse_({ ok: false, message: 'Invalid secret.' });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (payload.event === 'diagnostic') {
      return jsonResponse_(getDiagnosticStatus_(spreadsheet));
    }

    ensureOrderSheetHeaders_(spreadsheet);

    if (payload.event === 'payment_started') {
      return jsonResponse_(handlePaymentStarted_(spreadsheet, payload));
    }

    if (payload.event === 'payment_updated') {
      return jsonResponse_(handlePaymentUpdated_(spreadsheet, payload));
    }

    return jsonResponse_({ ok: false, message: 'Unsupported event.' });
  } catch (error) {
    return jsonResponse_({ ok: false, message: String(error) });
  }
}

function getDiagnosticStatus_(spreadsheet) {
  return {
    ok: true,
    event: 'diagnostic',
    spreadsheetId: SPREADSHEET_ID,
    sheets: ORDER_SHEET_NAMES.map(function (sheetName) {
      return {
        name: sheetName,
        exists: Boolean(spreadsheet.getSheetByName(sheetName)),
      };
    }),
  };
}

function handlePaymentStarted_(spreadsheet, payload) {
  const sheet = getOrderSheet_(spreadsheet, SHEET_NAMES.pending);
  const orderData = normalizeOrderData_(payload.row || payload.order || {});
  orderData.order_id = orderData.order_id || payload.order_id || '';
  orderData.status_follow_up = orderData.status_follow_up || 'Pending';

  const rowIndex = upsertOrderRow_(sheet, orderData.order_id, orderData);

  return {
    ok: true,
    event: payload.event,
    sheetName: sheet.getName(),
    rowIndex: rowIndex,
  };
}

function handlePaymentUpdated_(spreadsheet, payload) {
  const updates = payload.updates || {};
  const orderId = String(payload.order_id || '').trim();

  if (!orderId) {
    throw new Error('Missing order_id.');
  }

  const sourceLocation = findOrderLocation_(spreadsheet, orderId);
  const sourceSheetName = sourceLocation.sheet ? sourceLocation.sheet.getName() : '';
  const wasAlreadyCompleted = sourceSheetName === SHEET_NAMES.completed;
  const updatedOrderData = sourceLocation.rowIndex
    ? readOrderDataFromRow_(sourceLocation.sheet, sourceLocation.rowIndex)
    : { order_id: orderId };

  mergeNonEmpty_(updatedOrderData, normalizeOrderData_(payload.row || payload.order || {}));
  updatedOrderData.order_id = updatedOrderData.order_id || orderId;
  applyOrderUpdates_(updatedOrderData, updates);

  var targetSheetName = getSheetNameForPaymentStatus_(
    updates.payment_status,
    updatedOrderData.status_follow_up
  );

  if (
    sourceLocation.sheet &&
    sourceLocation.sheet.getName() === SHEET_NAMES.completed &&
    targetSheetName !== SHEET_NAMES.completed
  ) {
    targetSheetName = SHEET_NAMES.completed;
  }

  const targetSheet = getOrderSheet_(spreadsheet, targetSheetName);
  const rowIndex = upsertOrderRow_(targetSheet, orderId, updatedOrderData);

  if (sourceLocation.rowIndex && sourceLocation.sheet.getName() !== targetSheet.getName()) {
    sourceLocation.sheet.deleteRow(sourceLocation.rowIndex);
  }

  return {
    ok: true,
    event: payload.event,
    order: updatedOrderData,
    sourceSheetName: sourceSheetName,
    sheetName: targetSheet.getName(),
    wasAlreadyCompleted: wasAlreadyCompleted,
    rowIndex: rowIndex,
  };
}

function ensureOrderSheetHeaders_(spreadsheet) {
  ORDER_SHEET_NAMES.forEach(function (sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (sheet) {
      ensureHeaders_(sheet);
    }
  });
}

function ensureHeaders_(sheet) {
  Object.keys(HEADER_MAP).forEach(function (key) {
    const column = COLUMN_MAP[key];
    const header = HEADER_MAP[key];
    const cell = sheet.getRange(1, column);

    if (cell.getValue() !== header) {
      cell.setValue(header);
    }
  });
}

function getOrderSheet_(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Target sheet not found: ' + sheetName);
  }

  return sheet;
}

function findOrderLocation_(spreadsheet, orderId) {
  for (var index = 0; index < ORDER_SHEET_NAMES.length; index += 1) {
    const sheet = spreadsheet.getSheetByName(ORDER_SHEET_NAMES[index]);
    if (!sheet) {
      continue;
    }

    const rowIndex = findOrderRowIndex_(sheet, orderId);
    if (rowIndex) {
      return {
        sheet: sheet,
        rowIndex: rowIndex,
      };
    }
  }

  return {
    sheet: null,
    rowIndex: 0,
  };
}

function findOrderRowIndex_(sheet, orderId) {
  if (!orderId) {
    return 0;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return 0;
  }

  const orderIds = sheet.getRange(2, COLUMN_MAP.order_id, lastRow - 1, 1).getValues();
  for (var index = 0; index < orderIds.length; index += 1) {
    if (String(orderIds[index][0]) === String(orderId)) {
      return index + 2;
    }
  }

  return 0;
}

function upsertOrderRow_(sheet, orderId, orderData) {
  var rowIndex = findOrderRowIndex_(sheet, orderId);
  if (!rowIndex) {
    rowIndex = sheet.getLastRow() + 1;
  }

  writeOrderDataToRow_(sheet, rowIndex, orderData);
  return rowIndex;
}

function readOrderDataFromRow_(sheet, rowIndex) {
  const row = sheet.getRange(rowIndex, 1, 1, MAX_ORDER_COLUMN).getValues()[0];
  const orderData = {};

  Object.keys(COLUMN_MAP).forEach(function (key) {
    orderData[key] = row[COLUMN_MAP[key] - 1] || '';
  });

  return orderData;
}

function writeOrderDataToRow_(sheet, rowIndex, orderData) {
  Object.keys(COLUMN_MAP).forEach(function (key) {
    const value = orderData[key] === undefined || orderData[key] === null ? '' : orderData[key];
    sheet.getRange(rowIndex, COLUMN_MAP[key]).setValue(value);
  });
}

function normalizeOrderData_(source) {
  if (Array.isArray(source)) {
    return {
      order_id: source[0] || '',
      product_name_qty_sku: source[1] || '',
      order_total: source[2] || '',
      payment_method: source[3] || '',
      billing_first_name: source[4] || '',
      billing_city: source[5] || '',
      email: source[6] || '',
      phone: source[7] || '',
      created_date: source[8] || '',
      status_follow_up: source[9] || '',
      utm_source: source[10] || '',
      utm_medium: source[11] || '',
      utm_campaign: source[12] || '',
      utm_content: source[13] || '',
      shipping_address: source[14] || '',
      shipping_district: source[15] || '',
      shipping_postal_code: source[16] || '',
      shipping_city: source[17] || '',
      delivery_fee: source[18] || '',
    };
  }

  source = source || {};

  return {
    order_id: getFirstValue_(source, ['order_id', 'orderId']),
    product_name_qty_sku: getFirstValue_(source, [
      'product_name_qty_sku',
      'productLine',
      'product_name',
    ]),
    order_total: getFirstValue_(source, ['order_total', 'orderTotal']),
    payment_method: getFirstValue_(source, ['payment_method', 'paymentMethod']),
    billing_first_name: getFirstValue_(source, ['billing_first_name', 'billingFirstName']),
    billing_city: getFirstValue_(source, ['billing_city', 'billingCity']),
    email: getFirstValue_(source, ['email']),
    phone: getFirstValue_(source, ['phone']),
    created_date: getFirstValue_(source, ['created_date', 'createdDate']),
    status_follow_up: getFirstValue_(source, ['status_follow_up', 'statusFollowUp']),
    utm_source: getFirstValue_(source, ['utm_source', 'utmSource']),
    utm_medium: getFirstValue_(source, ['utm_medium', 'utmMedium']),
    utm_campaign: getFirstValue_(source, ['utm_campaign', 'utmCampaign']),
    utm_content: getFirstValue_(source, ['utm_content', 'utmContent']),
    shipping_address: getFirstValue_(source, ['shipping_address', 'shippingAddress']),
    shipping_district: getFirstValue_(source, ['shipping_district', 'shippingDistrict']),
    shipping_postal_code: getFirstValue_(source, [
      'shipping_postal_code',
      'shippingPostalCode',
    ]),
    shipping_city: getFirstValue_(source, ['shipping_city', 'shippingCity']),
    delivery_fee: getFirstValue_(source, ['delivery_fee', 'deliveryFee']),
  };
}

function getFirstValue_(source, keys) {
  for (var index = 0; index < keys.length; index += 1) {
    const value = source[keys[index]];
    if (value !== undefined && value !== null && String(value) !== '') {
      return value;
    }
  }

  return '';
}

function mergeNonEmpty_(target, source) {
  Object.keys(COLUMN_MAP).forEach(function (key) {
    if (source[key] !== undefined && source[key] !== null && String(source[key]) !== '') {
      target[key] = source[key];
    }
  });
}

function applyOrderUpdates_(orderData, updates) {
  if (updates.payment_method) {
    orderData.payment_method = updates.payment_method;
  }

  const statusFollowUp =
    updates.status_follow_up || getStatusFollowUpForPaymentStatus_(updates.payment_status);
  if (statusFollowUp) {
    orderData.status_follow_up = statusFollowUp;
  }
}

function getStatusFollowUpForPaymentStatus_(paymentStatus) {
  const normalizedStatus = String(paymentStatus || '').toLowerCase();

  if (normalizedStatus === 'paid' || normalizedStatus === 'settlement') {
    return 'Paid';
  }

  if (
    normalizedStatus === 'failed' ||
    normalizedStatus === 'deny' ||
    normalizedStatus === 'cancel' ||
    normalizedStatus === 'expire'
  ) {
    return 'Cancelled';
  }

  if (normalizedStatus === 'challenge') {
    return 'On Hold';
  }

  if (normalizedStatus === 'pending') {
    return 'Pending';
  }

  return '';
}

function getSheetNameForPaymentStatus_(paymentStatus, statusFollowUp) {
  const normalizedPaymentStatus = String(paymentStatus || '').toLowerCase();
  const normalizedStatusFollowUp = String(statusFollowUp || '').toLowerCase();

  if (normalizedPaymentStatus === 'paid' || normalizedStatusFollowUp === 'paid') {
    return SHEET_NAMES.completed;
  }

  if (
    normalizedPaymentStatus === 'failed' ||
    normalizedPaymentStatus === 'deny' ||
    normalizedPaymentStatus === 'cancel' ||
    normalizedPaymentStatus === 'expire' ||
    normalizedStatusFollowUp === 'cancelled' ||
    normalizedStatusFollowUp === 'canceled'
  ) {
    return SHEET_NAMES.cancelled;
  }

  if (
    normalizedPaymentStatus === 'challenge' ||
    normalizedStatusFollowUp === 'on hold' ||
    normalizedStatusFollowUp === 'on_hold'
  ) {
    return SHEET_NAMES.onHold;
  }

  return SHEET_NAMES.pending;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
