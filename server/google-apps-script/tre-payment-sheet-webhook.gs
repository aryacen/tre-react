const SPREADSHEET_ID = '10pKfHYCbwtlvXuuCchm1I5pDi4Bh58RUvVJfqbLWxE4';
const LEAD_MAGNET_SPREADSHEET_ID = '12aoh6enGOns26uAf0jdwr83xaz1-b9PSEFQ6lzmvb9s';
const LEAD_MAGNET_SHEET_NAME = 'Tes Gratis';
const WEBHOOK_SECRET = 'replace-this-with-a-random-secret';
const SCRIPT_VERSION = '2026-05-20-lead-magnet-next-data-row';
const ORDER_EXPIRY_HOURS = 24;
const ORDER_EXPIRY_MS = ORDER_EXPIRY_HOURS * 60 * 60 * 1000;
const LEAD_MAGNET_DEFAULT_SOURCE = 'Leads Web';

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

const FIRST_ORDER_ROW = 2;
const FIRST_LEAD_MAGNET_ROW = 2;

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
const LEAD_MAGNET_COLUMN_MAP = {
  tanggal: 1,
  nama: 2,
  email: 3,
  sumber: 8,
};
const LEAD_MAGNET_HEADER_MAP = {
  tanggal: 'Tanggal',
  nama: 'Nama',
  email: 'Email',
  sumber: 'Sumber',
};
const MAX_LEAD_MAGNET_COLUMN = 8;

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

    if (payload.event === 'cancel_expired_pending') {
      return jsonResponse_(handleExpiredPendingOrders_(spreadsheet, payload));
    }

    if (payload.event === 'free_test_lead_created') {
      return jsonResponse_(handleFreeTestLeadCreated_(payload));
    }

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
    scriptVersion: SCRIPT_VERSION,
    insertMode: 'next_empty_order_data_row',
    expiryHours: ORDER_EXPIRY_HOURS,
    spreadsheetId: SPREADSHEET_ID,
    leadMagnet: getLeadMagnetDiagnosticStatus_(),
    sheets: ORDER_SHEET_NAMES.map(function (sheetName) {
      return {
        name: sheetName,
        exists: Boolean(spreadsheet.getSheetByName(sheetName)),
        nextAvailableRow: spreadsheet.getSheetByName(sheetName)
          ? findNextAvailableOrderRow_(spreadsheet.getSheetByName(sheetName))
          : null,
      };
    }),
  };
}

function getLeadMagnetDiagnosticStatus_() {
  const spreadsheet = SpreadsheetApp.openById(LEAD_MAGNET_SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(LEAD_MAGNET_SHEET_NAME);

  return {
    spreadsheetId: LEAD_MAGNET_SPREADSHEET_ID,
    sheetName: LEAD_MAGNET_SHEET_NAME,
    exists: Boolean(sheet),
    nextAvailableRow: sheet ? findNextAvailableLeadMagnetRow_(sheet) : null,
  };
}

function handleFreeTestLeadCreated_(payload) {
  const spreadsheet = SpreadsheetApp.openById(LEAD_MAGNET_SPREADSHEET_ID);
  const sheet = getLeadMagnetSheet_(spreadsheet);
  ensureLeadMagnetHeaders_(sheet);

  const leadData = normalizeLeadMagnetData_(payload.row || payload.lead || {});
  const rowIndex = upsertLeadMagnetRow_(sheet, leadData);

  return {
    ok: true,
    event: payload.event,
    scriptVersion: SCRIPT_VERSION,
    spreadsheetId: LEAD_MAGNET_SPREADSHEET_ID,
    sheetName: sheet.getName(),
    rowIndex: rowIndex,
    lead: leadData,
  };
}

function getLeadMagnetSheet_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(LEAD_MAGNET_SHEET_NAME);

  if (!sheet) {
    throw new Error('Lead magnet sheet not found: ' + LEAD_MAGNET_SHEET_NAME);
  }

  return sheet;
}

function ensureLeadMagnetHeaders_(sheet) {
  Object.keys(LEAD_MAGNET_HEADER_MAP).forEach(function (key) {
    const column = LEAD_MAGNET_COLUMN_MAP[key];
    const header = LEAD_MAGNET_HEADER_MAP[key];
    const cell = sheet.getRange(1, column);

    if (cell.getValue() !== header) {
      cell.setValue(header);
    }
  });
}

function normalizeLeadMagnetData_(source) {
  source = source || {};

  return {
    tanggal: getFirstValue_(source, ['tanggal', 'date', 'created_date', 'createdDate']),
    nama: getFirstValue_(source, ['nama', 'name']),
    email: getFirstValue_(source, ['email']),
    sumber:
      getFirstValue_(source, ['sumber', 'source']) || LEAD_MAGNET_DEFAULT_SOURCE,
  };
}

function upsertLeadMagnetRow_(sheet, leadData) {
  const rowIndex = findNextAvailableLeadMagnetRow_(sheet);
  writeLeadMagnetDataToRow_(sheet, rowIndex, leadData);
  return rowIndex;
}

function findNextAvailableLeadMagnetRow_(sheet) {
  const lastRow = Math.max(sheet.getLastRow(), FIRST_LEAD_MAGNET_ROW);
  const rows = sheet
    .getRange(
      FIRST_LEAD_MAGNET_ROW,
      1,
      lastRow - FIRST_LEAD_MAGNET_ROW + 1,
      MAX_LEAD_MAGNET_COLUMN
    )
    .getValues();

  for (var index = rows.length - 1; index >= 0; index -= 1) {
    if (rowHasLeadMagnetData_(rows[index])) {
      return FIRST_LEAD_MAGNET_ROW + index + 1;
    }
  }

  return FIRST_LEAD_MAGNET_ROW;
}

function rowHasLeadMagnetData_(row) {
  return Object.keys(LEAD_MAGNET_COLUMN_MAP).some(function (key) {
    const columnIndex = LEAD_MAGNET_COLUMN_MAP[key] - 1;
    return String(row[columnIndex] || '').trim() !== '';
  });
}

function writeLeadMagnetDataToRow_(sheet, rowIndex, leadData) {
  Object.keys(LEAD_MAGNET_COLUMN_MAP).forEach(function (key) {
    const value = leadData[key] === undefined || leadData[key] === null ? '' : leadData[key];
    sheet.getRange(rowIndex, LEAD_MAGNET_COLUMN_MAP[key]).setValue(value);
  });
}

function cancelExpiredPendingOrders() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureOrderSheetHeaders_(spreadsheet);

  return handleExpiredPendingOrders_(spreadsheet, {});
}

function installHourlyExpiryTrigger() {
  const handlerFunction = 'cancelExpiredPendingOrders';

  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === handlerFunction) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger(handlerFunction).timeBased().everyHours(1).create();

  return {
    ok: true,
    handlerFunction: handlerFunction,
    frequency: 'everyHours(1)',
    expiryHours: ORDER_EXPIRY_HOURS,
  };
}

function handleExpiredPendingOrders_(spreadsheet, payload) {
  const pendingSheet = getOrderSheet_(spreadsheet, SHEET_NAMES.pending);
  const cancelledSheet = getOrderSheet_(spreadsheet, SHEET_NAMES.cancelled);
  const now = payload && payload.now ? new Date(payload.now) : new Date();
  const cutoffTime = now.getTime() - ORDER_EXPIRY_MS;
  const lastRow = pendingSheet.getLastRow();
  const movedOrders = [];

  if (lastRow < FIRST_ORDER_ROW) {
    return {
      ok: true,
      event: 'cancel_expired_pending',
      scriptVersion: SCRIPT_VERSION,
      movedCount: 0,
      movedOrders: movedOrders,
    };
  }

  for (var rowIndex = lastRow; rowIndex >= FIRST_ORDER_ROW; rowIndex -= 1) {
    const orderData = readOrderDataFromRow_(pendingSheet, rowIndex);
    const statusFollowUp = String(orderData.status_follow_up || '').trim().toLowerCase();

    if (!orderData.order_id || (statusFollowUp && statusFollowUp !== 'pending')) {
      continue;
    }

    const createdDate = parseSheetDate_(orderData.created_date);
    if (!createdDate || createdDate.getTime() > cutoffTime) {
      continue;
    }

    orderData.status_follow_up = 'Cancelled';
    const targetRowIndex = upsertOrderRow_(cancelledSheet, orderData.order_id, orderData);
    pendingSheet.deleteRow(rowIndex);

    movedOrders.push({
      order_id: orderData.order_id,
      sourceRowIndex: rowIndex,
      targetSheetName: cancelledSheet.getName(),
      targetRowIndex: targetRowIndex,
    });
  }

  return {
    ok: true,
    event: 'cancel_expired_pending',
    scriptVersion: SCRIPT_VERSION,
    movedCount: movedOrders.length,
    movedOrders: movedOrders,
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
    rowIndex = findNextAvailableOrderRow_(sheet);
  }

  writeOrderDataToRow_(sheet, rowIndex, orderData);
  return rowIndex;
}

function findNextAvailableOrderRow_(sheet) {
  const lastRow = Math.max(sheet.getLastRow(), FIRST_ORDER_ROW);
  const rows = sheet
    .getRange(FIRST_ORDER_ROW, 1, lastRow - FIRST_ORDER_ROW + 1, MAX_ORDER_COLUMN)
    .getValues();

  for (var index = rows.length - 1; index >= 0; index -= 1) {
    if (rowHasOrderData_(rows[index])) {
      return FIRST_ORDER_ROW + index + 1;
    }
  }

  return FIRST_ORDER_ROW;
}

function rowHasOrderData_(row) {
  return Object.keys(COLUMN_MAP).some(function (key) {
    const columnIndex = COLUMN_MAP[key] - 1;
    return String(row[columnIndex] || '').trim() !== '';
  });
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

function parseSheetDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  const text = String(value || '').trim();
  if (!text) {
    return null;
  }

  const normalizedText = text.replace(/\s*WIB$/i, '').replace('T', ' ');
  const match = normalizedText.match(
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/
  );

  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const hour = Number(match[4]);
    const minute = Number(match[5]);
    const second = Number(match[6] || 0);

    return new Date(Date.UTC(year, month, day, hour - 7, minute, second));
  }

  const fallbackDate = new Date(text);
  return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
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
