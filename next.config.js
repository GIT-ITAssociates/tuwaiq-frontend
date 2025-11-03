//  @type {import('next').NextConfig} 
const nextConfig = {
  reactStrictMode: false,
  env: {
    backend_url:
      process.env.NODE_ENV === "production"
        ? "https://law.wooo.games/"
        : "https://law.wooo.games/",
    socket_url: "http://localhost:5000/",
  },
  images: {
    // domains: ['appstick.s3.ap-southeast-1.amazonaws.com', 'i.ibb.co.com', 'legalmanagment.s3.us-east-1.amazonaws.com'],
    domains: ['legalmanagment.s3.us-east-1.amazonaws.com', 'i.ibb.co.com'],
  },
};

// : "http://3.220.234.77:3000/",


module.exports = nextConfig

// https://api.lawfirm.appstick.com.bd/
// https://9n7hwf7x-4321.asse.devtunnels.ms/
// http://192.168.0.149:8080/
// ws://192.168.0.143:8080/
// 'appstick.s3.ap-southeast-1.amazonaws.com','i.ibb.co.com'




// mongodb+srv://sharintasnia1:YeQSVRL0KzKKYY93@cluster0.gifeiy4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0