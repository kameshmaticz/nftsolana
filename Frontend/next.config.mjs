/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'example.com', 'anotherdomain.com','192.53.121.26:7017'],
   
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '192.53.121.26',
          port: '7017',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'backend-nftsolana.maticz.in',
          // port: '7017',
          pathname: '/**',
        },
      ],
    
  },
  reactStrictMode: true,
};
export default nextConfig;
