import { useAuth0 } from "@auth0/auth0-react";
import { useUserPages } from "../hooks/useUserPages"; 
import { useEffect, useState, useRef } from "react"; 

const API_ROOT_URL = "https://photo-gallery-api-l2fz.onrender.com"; 
const API_UPLOAD_URL = `${API_ROOT_URL}/api/images/upload`;

export const AuthAndUpload = ({ setIsUploading, isUploading }) => {
    const { 
        isAuthenticated,       
        isLoading,             
        user,                   
        loginWithRedirect,     
        logout,                
        getAccessTokenSilently 
    } = useAuth0();
    
    const authLoaded = !isLoading;
    const isSignedIn = isAuthenticated;
    const userId = user ? user.sub : null; 
    
    const { fetchUserPages, currentImageCount, MAX_IMAGE_SLOTS } = useUserPages(); 
    const [showLimitPopup, setShowLimitPopup] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (authLoaded) {
            if (isSignedIn && userId) {
                fetchUserPages(userId); 
            } else if (!isSignedIn) {
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
            const token = await getAccessTokenSilently(); 
            const formData = new FormData();
            formData.append('image', file); 

            const response = await fetch(API_UPLOAD_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${errorText}`);
            }
            
            await fetchUserPages(userId || undefined); 

        } catch (error) {
            console.error("Upload error:", error);
            alert(`Error uploading file: ${error.message}`);
        } finally {
            setIsUploading(false);
            if (event.target) event.target.value = null; 
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
    
    if (isLoading) return null;

    return (
        <>
            {/* Image Limit Popup */}
            {showLimitPopup && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 text-black/80 p-6 rounded-lg shadow-2xl text-lg font-bold text-center">
                        You can't upload any more images...
                    </div>
                </div>
            )}
            
            {/* UI Controls Container */}
            <div className="fixed top-4 right-4 sm:top-7 sm:right-10 z-[100]">
                {!isSignedIn ? (
                    <button 
                        className="auth-btn-base"
                        onClick={() => loginWithRedirect()}
                    >
                        Sign Up / Log In
                    </button>
                ) : (
                    <div className="flex items-center gap-[10px] flex-wrap justify-end">
                        {/* Custom Upload Button Label */}
                        <label 
                            htmlFor="file-upload" 
                            onClick={handleUploadButtonClick}
                            className={`auth-btn-base ${uploadDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                        </label>

                        {/* Hidden File Input */}
                        <input 
                            id="file-upload" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileUpload} 
                            style={{ display: 'none' }}        
                            disabled={uploadDisabled}            
                            ref={fileInputRef}
                        />

                        {/* Logout Button */}
                        <div className="user-avatar-container">
                            <button
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                className="auth-btn-base"
                                style={{ padding: '8px 12px', backgroundColor: '#00000066' }}
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};