import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { Auth0Provider } from '@auth0/auth0-react'; 

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const callbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL;

const auth0Audience = "https://photogalleryapi.com"; 

if (!domain || !clientId || !callbackUrl) {
    throw new Error("Missing required Auth0 environment variables. Please check your .env file.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            cacheLocation="localstorage"
            useRefreshTokens={true}
            authorizationParams={{
                redirect_uri: callbackUrl,
                audience: auth0Audience, 
                scope: 'openid profile email read:photos write:photos',
            }}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
);