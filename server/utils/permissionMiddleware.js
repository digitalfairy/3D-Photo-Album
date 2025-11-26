// server/utils/permissionMiddleware.js

/**
 * Creates a middleware function to check if the validated JWT 
 * contains ALL required scopes in its payload.
 * @param {string[]} requiredScopes - An array of required scopes (e.g., ['read:photos', 'write:photos']).
 * @returns {function} Express middleware.
 */
export const checkScopes = (requiredScopes) => {
    return (req, res, next) => {
        // The token payload is stored on req.auth by the express-oauth2-jwt-bearer library
        // The scope is a space-separated string, e.g., "openid profile read:photos"
        const tokenScopes = req.auth?.payload?.scope; 

        if (!tokenScopes) {
            // No scope claim found
            return res.status(403).json({ message: "Forbidden: Access Token must contain scopes." });
        }

        const tokenScopesArray = tokenScopes.split(' ');

        // Check if the tokenScopesArray includes every scope required for this route
        const hasRequiredScopes = requiredScopes.every(scope => tokenScopesArray.includes(scope));
        
        if (hasRequiredScopes) {
            next();
        } else {
            // This is the error response when the token is valid but lacks permissions
            res.status(403).json({ message: "Forbidden: Insufficient permissions (missing required scope)." });
        }
    };
};