import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async rewrites() {
    return [
      {source: '/', destination:'/home'},
      {source: '/login', destination:'/auth/login'},
      {source: '/signup', destination:'/auth/signup'},
      {source: '/dashboard', destination:'/dashboard'},
      {source: '/kanban', destination:'/kanban'},
    ]
  },
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
};

export default nextConfig;