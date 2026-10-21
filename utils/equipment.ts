export const MACHINERY_EQUIPMENT_OPTIONS = [
  'Piqueuse Plate Industrielle (Single Needle Lockstitch)',
  'Surjeteuse / Overlock Machine',
  'Recouvreuse / Coverstitch Machine',
  'Boutonnière & Pose-Bouton (Buttonhole / Button Attach)',
  'Brodeuse Numérique / Industrial Embroidery Machine',
  'Machine à Zig-Zag',
  'Cadre de Broderie Traditionnelle (Gargaf / Traditional Frame)',
  'Table de Coupe / Cutting Table',
  'Presse & Fer à Repasser Industriel (Steam Iron & Press)',
] as const;

export type MachineryEquipmentOption = (typeof MACHINERY_EQUIPMENT_OPTIONS)[number];

/**
 * Format Algerian and international phone numbers for WhatsApp and Tel links.
 * WhatsApp wa.me requires international country code with no +, spaces, dashes, or punctuation.
 * e.g., '0555 12 34 56' -> '213555123456'
 *       '+213 661 23 45 67' -> '213661234567'
 */
export function formatPhoneNumber(phone: string | null | undefined): {
  raw: string;
  tel: string;
  whatsapp: string;
  isValid: boolean;
} {
  if (!phone || typeof phone !== 'string') {
    return { raw: '', tel: '', whatsapp: '', isValid: false };
  }

  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, '');

  if (digits.length < 8) {
    return { raw: trimmed, tel: '', whatsapp: '', isValid: false };
  }

  // Format for WhatsApp: must start with country code
  let whatsappDigits = digits;
  if (whatsappDigits.startsWith('0') && whatsappDigits.length === 10) {
    // Standard Algerian number starting with 0: replace 0 with 213
    whatsappDigits = '213' + whatsappDigits.slice(1);
  } else if (!whatsappDigits.startsWith('213') && whatsappDigits.length === 9) {
    // 9 digits without leading 0
    whatsappDigits = '213' + whatsappDigits;
  }

  // Format for Tel:
  let tel = trimmed;
  if (!tel.startsWith('+') && !tel.startsWith('00') && whatsappDigits.startsWith('213')) {
    tel = '+' + whatsappDigits;
  }

  return {
    raw: trimmed,
    tel: tel,
    whatsapp: whatsappDigits,
    isValid: true,
  };
}
