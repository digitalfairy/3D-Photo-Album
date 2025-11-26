// src/components/AuthAndUpload.jsx
import { useAuth0 } from "@auth0/auth0-react"; // 1. NEW IMPORT
import { useUserPages } from "../hooks/useUserPages"; 
import { useEffect, useState, useRef } from "react"; 

const API_ROOT_URL = "https://photo-gallery-api-l2fz.onrender.com"; 
const API_UPLOAD_URL = `${API_ROOT_URL}/api/images/upload`;

export const AuthAndUpload = () => {
    // 2. REPLACE useAuth() with useAuth0()
    const { 
        isAuthenticated,       // Replaces isSignedIn
        isLoading,             // Replaces authLoaded state
        user,                  // Contains user info
        loginWithRedirect,     // Replaces SignInButton action
        logout,                // Replaces UserButton logout action
        getAccessTokenSilently // Replaces getToken
    } = useAuth0();
    
    // Auth0 uses user.sub as the unique user ID (Clerk's userId)
    const authLoaded = !isLoading;
    const isSignedIn = isAuthenticated;
    const userId = user ? user.sub : null; 
    
    const { fetchUserPages, currentImageCount, MAX_IMAGE_SLOTS } = useUserPages(); 

    const [isUploading, setIsUploading] = useState(false);
    const [showLimitPopup, setShowLimitPopup] = useState(false);
    
    const fileInputRef = useRef(null);

    // 3. REFACTOR useEffect logic to use Auth0 variables
    useEffect(() => {
        // isLoading is true initially, so we check !isLoading for readiness
        if (authLoaded) {
            if (isSignedIn && userId) {
                fetchUserPages(userId); 
            } else if (!isSignedIn) {
                // Fetch public pages if not signed in
                fetchUserPages(); 
            }
        }
    }, [authLoaded, isSignedIn, userId, fetchUserPages]); 

    useEffect(() => {
        if (showLimitPopup) {
            const timer = setTimeout(() => {
                setShowLimitPopup(false);
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [showLimitPopup]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
            
        if (currentImageCount >= MAX_IMAGE_SLOTS) {
            return; 
        }

        setIsUploading(true);
        try {
            // 4. REPLACE getToken() with getAccessTokenSilently()
            // Auth0 handles token template/duration automatically via its configuration
            const token = await getAccessTokenSilently(); 
            
            const formData = new FormData();
            formData.append('image', file); 

            const response = await fetch(API_UPLOAD_URL, {
                method: 'POST',
                headers: {
                    // Note: FormData request automatically sets Content-Type, so we only need Authorization
                    'Authorization': `Bearer ${token}`, 
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${errorText}`);
            }
            
            console.log("Upload successful!");

            // Re-fetch pages, using userId if authenticated
            await fetchUserPages(userId || undefined); 

        } catch (error) {
            console.error("Upload error:", error);
            alert(`Error uploading file: ${error.message}`);
        } finally {
            setIsUploading(false);
            event.target.value = null; 
        }
    };
        
    const handleUploadButtonClick = (e) => {
        if (currentImageCount >= MAX_IMAGE_SLOTS) {
            e.preventDefault(); 
            setShowLimitPopup(true);
            return;
        }
    };

    const uploadDisabled = isUploading || currentImageCount >= MAX_IMAGE_SLOTS;

    return (
        <>
            {showLimitPopup && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 text-black/80 p-6 rounded-lg shadow-2xl text-lg font-bold text-center">
                        You can't upload any more images...
                    </div>
                </div>
            )}
            
            <div className="fixed top-4 right-4 sm:top-7 sm:right-10 z-[100]">
                {/* 5. REPLACE <SignedOut> with standard ternary/conditional rendering */}
                {!isSignedIn ? (
                    // 6. REPLACE <SignInButton> with a standard button calling loginWithRedirect
                    <button 
                        className="auth-btn-base"
                        onClick={() => loginWithRedirect()}
                    >
                        Sign Up / Log In
                    </button>
                ) : (
                    // 7. REPLACE <SignedIn> with a standard div
                    <div className="flex items-center gap-[10px] flex-wrap justify-end">

                        <label 
                            htmlFor="file-upload" 
                            onClick={handleUploadButtonClick}
                            // Note: Clerk styles removed, ensure 'auth-btn-base' is defined in CSS
                            className={`auth-btn-base ${uploadDisabled ? ' text-white' : ''}`}
                        >
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                        </label>

                        <input 
                            id="file-upload" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileUpload} 
                            style={{ display: 'none' }}        
                            disabled={uploadDisabled}            
                            ref={fileInputRef}
                            />

                        <div className="user-avatar-container">
                            {/* 8. REPLACE <UserButton> with a standard button calling logout() */}
                            <button
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                className="auth-btn-base"
                                style={{ padding: '8px 12px' }} // Custom styling for a logout button
                            >
                                Log Out
                            </button>
                            
                            {/* You could optionally display the user's avatar here using {user.picture} */}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};