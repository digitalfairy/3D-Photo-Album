import { useAtom } from "jotai";
import { dynamicPagesAtom, defaultPages } from "../stores/pageStore";
// 1. UPDATE IMPORT: Replace useAuth with useAuth0
import { useAuth0 } from "@auth0/auth0-react"; 
import { useCallback, useState, useMemo } from "react"; 

const API_ROOT_URL = "https://photo-gallery-api-l2fz.onrender.com"; 
const API_BASE_URL = `${API_ROOT_URL}/api/images`;

export const MAX_IMAGE_SLOTS = 16; 
const TOTAL_PAGES = 10; 
const BACK_COVER_PATH = "/textures/book-back.jpg"; 


/**
 * @param {string | undefined} mockUserId 
 * @returns {object} 
 */

export const useUserPages = () => {
    // 2. UPDATE HOOK: Replace useAuth() with useAuth0()
    const { 
        isLoading, 
        isAuthenticated,
        user,
        getAccessTokenSilently // Replaces getToken
    } = useAuth0(); 
    
    // Map Auth0 properties to original logic variables
    const isLoaded = !isLoading;
    // Auth0 uses user.sub as the unique user ID (Clerk's userId)
    const userId = user ? user.sub : null; 
    
    const [pages, setPages] = useAtom(dynamicPagesAtom);

    const [userImageUrls, setUserImageUrls] = useState([]);

    // We don't need 'mockUserId' anymore since 'userId' is available from useAuth0
    const fetchUserPages = useCallback(async (explicitUserId) => { 
        
        const effectiveUserId = explicitUserId || userId; // Keep for fetching public vs user pages
        
        // 3. UPDATE CONDITION: Check Auth0's isAuthenticated property 
        if (!isLoaded || (!isAuthenticated && !explicitUserId)) { 
             // If not loaded OR (not signed in AND not explicitly fetching public pages)
            setPages(defaultPages);
            setUserImageUrls([]);
            return;
        }
        
        // Only attempt to get token if we have a user and are trying to access user pages
        const isProtectedFetch = effectiveUserId && isAuthenticated;
        let token = null;

        try {
            if (isProtectedFetch) {
                // 4. FIX: Use getAccessTokenSilently() and explicitly request the Audience
                // This ensures the token contains the necessary claim for the backend to validate.
                token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: "https://photogalleryapi.com", // Must match your Auth0 API Identifier
                        scope: 'openid profile email read:photos',
                    },
                }); 
            }
            
            // Determine the API endpoint: /me (protected) or /public 
            const apiEndpoint = isProtectedFetch ? `${API_BASE_URL}/me` : `${API_BASE_URL}/public`;
            
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(apiEndpoint, {
                headers: headers,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch images.");
            }

            const rawUserImages = await response.json(); 
            const userImageUrls = rawUserImages.map(img => img.url);

            setUserImageUrls(userImageUrls);

            // ... (rest of the page construction logic is unchanged)
            const limitedUrls = userImageUrls.slice(0, MAX_IMAGE_SLOTS);
            
            while (limitedUrls.length < MAX_IMAGE_SLOTS) {
                limitedUrls.push(null); 
            }

            const newPages = [];
            
            newPages.push({ 
                front: null, 
                back: limitedUrls[0] || null 
            });
            
            for (let i = 1; i < MAX_IMAGE_SLOTS; i += 2) {
                newPages.push({
                    front: limitedUrls[i] || null, 
                    back: limitedUrls[i + 1] || null 
                });
            }

            newPages.push({
                front: null, 
                back: BACK_COVER_PATH 
            });
            
            if (newPages.length !== TOTAL_PAGES) {
                console.error(`Page structure error: Expected ${TOTAL_PAGES}, got ${newPages.length}`);
            }
            
            setPages(newPages);

        } catch (error) {
            console.error("Error fetching user pages:", error);
            setPages(defaultPages); 
            setUserImageUrls([]); 
        }
    }, [isLoaded, isAuthenticated, getAccessTokenSilently, setPages, userId]); 

    const currentImageCount = useMemo(() => userImageUrls.length, [userImageUrls]);
    
    return { pages, fetchUserPages, currentImageCount, MAX_IMAGE_SLOTS };
};
