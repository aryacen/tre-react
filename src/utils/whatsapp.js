export const WHATSAPP_PHONE = '62818901789';

export const buildWhatsAppLink = (message) =>
  `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
    message
  )}`;
