const DEFAULT_CONTACT_MESSAGE = `Hi Sreedev,

I found your portfolio and would like to discuss a project with you.

Project / idea:
Preferred timeline:`;

const DEFAULT_EMAIL_SUBJECT = "Project enquiry from your portfolio";

export const WHATSAPP_CONTACT_URL = `https://wa.me/918606425698?text=${encodeURIComponent(
  DEFAULT_CONTACT_MESSAGE,
)}`;

export const EMAIL_CONTACT_URL = `mailto:vpsreedev24@gmail.com?subject=${encodeURIComponent(
  DEFAULT_EMAIL_SUBJECT,
)}&body=${encodeURIComponent(DEFAULT_CONTACT_MESSAGE)}`;
