/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  swcMinify: false,
  images: {
    domains: [
      "tfu-media.s3.ap-south-1.amazonaws.com",
      "uploads-ssl.webflow.com",
      "media.istockphoto.com",
      "img.freepik.com",
      "images.pexels.com",
      "us.123rf.com",
      "encrypted-tbn0.gstatic.com",
    ],
  },
  experimental:{
    appDir:true
  }
};

module.exports = nextConfig;
