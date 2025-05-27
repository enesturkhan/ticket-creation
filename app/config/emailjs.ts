import emailjs from '@emailjs/browser';

// EmailJS'i başlat
const PUBLIC_KEY = 'dKxQ5F1NoDWU8FN3U';
emailjs.init(PUBLIC_KEY);

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_lw6zktq',
  TEMPLATE_ID: 'template_6hwb78e',
  TO_EMAIL: 'enestrkhan213@gmail.com',
  PUBLIC_KEY: PUBLIC_KEY
}; 