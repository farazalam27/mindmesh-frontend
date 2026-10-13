# MindMesh Frontend Deployment Guide

## Overview

The MindMesh frontend is configured to work in two modes:
1. **GitHub Pages (Static)** - Uses mock data, no backend required
2. **Local Development** - Can connect to real backend or use mock data

## GitHub Pages Deployment

### Automatic Deployment

The frontend is configured for automatic deployment to GitHub Pages:

1. **Push to main/master branch** triggers automatic deployment
2. **GitHub Actions** builds and deploys the static site
3. **Mock data mode** is automatically enabled for GitHub Pages

### Manual Deployment

```bash
# Build for GitHub Pages
npm run build:static

# The static files will be in the 'out' directory
# GitHub Actions will automatically deploy these
```

### GitHub Pages Setup

1. Go to your repository's **Settings** > **Pages**
2. Set **Source** to "GitHub Actions"
3. The site will be available at: `https://yourusername.github.io/mindmesh-frontend`

## Local Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd mindmesh-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Modes

#### Mock Data Mode (Default)
```bash
# Uses mock data, no backend required
npm run dev
```

The `.env.local` file controls local behavior:
```env
NEXT_PUBLIC_API_MODE=mock  # or 'real'
```

#### Real Backend Mode
```bash
# Connect to local backend services
# First start the backend services (see backend README)
cd ../mindmesh
python start_services_simple.py

# Then in another terminal, start frontend in real mode
cd mindmesh-frontend
# Edit .env.local to set NEXT_PUBLIC_API_MODE=real
npm run dev
```

## Configuration Files

### Environment Files

- `.env.local` - Local development configuration
- `.env.production` - Production (GitHub Pages) configuration

### Key Environment Variables

- `NEXT_PUBLIC_API_MODE` - 'mock' or 'real'
- `DEPLOY_TARGET` - 'local' or 'github-pages'
- `NEXT_PUBLIC_API_BASE_URL` - Backend URL (when in real mode)

### Next.js Configuration

`next.config.ts` automatically configures for deployment target:
- **Local**: Standard Next.js configuration
- **GitHub Pages**: Static export with proper paths

## Build Scripts

```bash
# Development
npm run dev                # Start development server

# Production builds
npm run build             # Standard Next.js build
npm run build:static      # Static build for GitHub Pages

# Deployment
npm run deploy           # Build static + add .nojekyll file
```

## API Integration

### Mock Mode Features

When `NEXT_PUBLIC_API_MODE=mock`:
- ✅ Complete CRUD operations for ideas, votes, comments, decisions
- ✅ Realistic API delays and responses
- ✅ In-memory data persistence (session-based)
- ✅ Authentication simulation
- ✅ Search and filtering
- ✅ Analytics and statistics

### Real Mode Features

When `NEXT_PUBLIC_API_MODE=real`:
- ✅ Connects to actual backend services
- ✅ JWT authentication
- ✅ PostgreSQL data persistence
- ✅ Real-time data updates
- ✅ Full microservices integration

### Automatic Fallback

The application automatically falls back to mock mode if:
- Backend services are unavailable
- Network requests fail
- Health checks fail

## Troubleshooting

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build:static
```

### Deployment Issues

1. **GitHub Actions failing**:
   - Check the Actions tab in your GitHub repository
   - Ensure all environment variables are set
   - Verify the workflow has necessary permissions

2. **404 on GitHub Pages**:
   - Ensure GitHub Pages is enabled in repository settings
   - Check that the source is set to "GitHub Actions"
   - Verify the build completed successfully

3. **API not working**:
   - Check browser console for errors
   - Verify `NEXT_PUBLIC_API_MODE` is set correctly
   - Check network tab for failed requests

### Mock Data Not Loading

```bash
# Check environment variable
echo $NEXT_PUBLIC_API_MODE

# Should be 'mock' for static deployment
# Check browser console for any JavaScript errors
```

### Backend Connection Issues

```bash
# Verify backend is running
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health

# Check environment variables
cat .env.local
```

## Custom Domain (Optional)

To use a custom domain with GitHub Pages:

1. Add `CNAME` file to the `public` directory:
   ```
   your-domain.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `yourusername.github.io`
   - Or add A records for GitHub Pages IPs

3. Enable custom domain in repository settings

## Production Considerations

### Performance

- Static site loads instantly (no server-side rendering)
- Mock data eliminates API latency
- Images are optimized for static export
- CSS and JS are bundled and minified

### Security

- No sensitive data in static build
- All API URLs are public (but point to mock data)
- No server-side secrets or authentication

### Scalability

- GitHub Pages serves static files from CDN
- Unlimited concurrent users
- No server maintenance required
- Zero hosting costs

## Development Workflow

1. **Local Development**:
   ```bash
   npm run dev  # Test with mock or real backend
   ```

2. **Testing Static Build**:
   ```bash
   npm run build:static
   npx serve out  # Test static build locally
   ```

3. **Deploy**:
   ```bash
   git push origin main  # Automatic deployment via GitHub Actions
   ```

4. **Monitor**:
   - Check GitHub Actions for build status
   - Visit deployed site to verify functionality
   - Monitor browser console for any issues