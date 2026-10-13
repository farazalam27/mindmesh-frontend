import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: isGitHubPages ? 'export' : undefined,
  
  // Set base path for GitHub Pages (repository name)
  basePath: isGitHubPages ? '/mindmesh-frontend' : '',
  
  // Asset prefix for GitHub Pages
  assetPrefix: isGitHubPages ? '/mindmesh-frontend/' : '',
  
  // Disable image optimization for static export
  images: {
    unoptimized: isGitHubPages,
  },
  
  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE || 'mock',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
    NEXT_PUBLIC_VOTING_API_URL: process.env.NEXT_PUBLIC_VOTING_API_URL || 'http://localhost:8002',
    NEXT_PUBLIC_DECISION_API_URL: process.env.NEXT_PUBLIC_DECISION_API_URL || 'http://localhost:8003',
  },
  
  // Trailing slash for better GitHub Pages compatibility
  trailingSlash: isGitHubPages,
};

export default nextConfig;
