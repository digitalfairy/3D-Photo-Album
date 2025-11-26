// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. New Import: Use the Auth0 Provider
import { Auth0Provider } from '@auth0/auth0-react'; 

// --- 2. Configuration Retrieval ---
// Fetch Auth0 environment variables
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const callbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL;

// CRITICAL: This is the identifier for the API you created in your Auth0 dashboard 
// (the one that represents your Render backend).
const auth0Audience = "https://photogalleryapi.com"; 

// Basic check for required keys
if (!domain || !clientId || !callbackUrl) {
    throw new Error("Missing required Auth0 environment variables. Please check your .env file.");
}
// --- End Configuration Retrieval ---

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* 3. New Provider: Replace ClerkProvider with Auth0Provider */}
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: callbackUrl,
                audience: auth0Audience, 
                // *** FIX: ADD SCOPE HERE ***
                scope: 'openid profile email read:photos write:photos', // Standard scopes for user info
                // --------------------------
            }}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
);