import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async rewrites() {
    return [
      {source: '/', destination:'/home'},
      {source: '/cadastro', destination:'/auth/signup'},
      {source: '/login', destination:'/auth/login'},
      {source: '/signup', destination:'/auth/signup'},
      {source: '/dashboard', destination:'/main/dashboard'},
      {source: '/perfil', destination:'/main/profile'},
      {source: '/receita-despesa', destination:'/main/income-expense'},
      {source: '/contas', destination:'/main/bills'},
      {source: '/extrato', destination:'/main/extract'},
    ]
  },
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
};

export default nextConfig;