/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa');

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: 'public/serviceWorker',
    disable: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: ['storage.googleapis.com'],
  },
});
