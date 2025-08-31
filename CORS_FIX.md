# CORS Configuration Fix

This document outlines the CORS fixes implemented to resolve deployment issues.

## Problems Fixed

### 1. Overly Restrictive CORS Policy
**Before:** Only allowed exact matches from hardcoded origins
**After:** Added flexible origin handling for various deployment scenarios

### 2. Missing Support for Development Environments
**Before:** Only supported localhost:5173
**After:** Now supports any localhost port (5173, 3000, etc.)

### 3. No Support for Preview Deployments
**Before:** Failed on Vercel preview URLs
**After:** Automatically allows any `geo-journal-*.vercel.app` URL

### 4. Server-to-Server Request Failures
**Before:** Rejected requests with no origin header
**After:** Allows requests with no origin (mobile apps, server-to-server, etc.)

## CORS Configuration Details

The new CORS configuration in `backend/app.js` handles:

1. **No Origin Requests** - Allows requests without an origin header
2. **Localhost Development** - Allows any localhost or 127.0.0.1 origin
3. **Production Origins** - Checks against allowed origins list
4. **Vercel Previews** - Automatically allows geo-journal-*.vercel.app domains
5. **Error Logging** - Logs blocked origins for debugging

## Environment Variables Required

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```bash
# Required for basic functionality
MONGO_URI=your_mongodb_connection_string
JWT_KEY=your_jwt_secret_key
FRONTEND_URL=your_frontend_url

# Required for OAuth (optional for testing)
OAUTH_CLIENT_ID=your_google_client_id
OAUTH_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret

# Optional features
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Deployment Checklist

- [ ] Set `FRONTEND_URL` environment variable to your frontend domain
- [ ] Ensure `MONGO_URI` is configured for your database
- [ ] Set `JWT_KEY` to a strong secret
- [ ] Configure OAuth credentials if using Google authentication
- [ ] Server now uses HTTP server instead of Express app (required for WebSockets)

## Testing CORS

The implementation has been tested with:
- ✅ Development localhost origins
- ✅ Production domains
- ✅ Vercel preview deployments  
- ✅ No-origin requests
- ✅ WebSocket connections

## Graceful Degradation

The application now handles missing credentials gracefully:
- **Missing OAuth**: Google authentication disabled, warning logged
- **Missing AI Key**: AI features use fallback content instead of failing
- **Missing Environment Variables**: Server starts with appropriate warnings