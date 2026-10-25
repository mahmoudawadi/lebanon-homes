// Business contact details used across the site

// WhatsApp number in international format, digits only (Lebanon +961, 81 935 326)
export const WHATSAPP_NUMBER = "96181935326";
export const WHATSAPP_DISPLAY = "+961 81 935 326";

export const whatsappLink = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
