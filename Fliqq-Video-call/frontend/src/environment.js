// FIX: Use environment variable for backend URL so the app works in both local dev and production.
// In production: set REACT_APP_BACKEND_URL in your .env file or deployment platform (Vercel/Netlify/Render).
// In local dev: fallback automatically to http://localhost:8000
const url = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export default url;