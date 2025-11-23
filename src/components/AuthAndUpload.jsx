import { 
    SignInButton, 
    SignedIn, 
    SignedOut, 
    useAuth, 
    UserButton 
} from "@clerk/clerk-react";
import { dark } from '@clerk/themes'; 
import { useUserPages } from "../hooks/useUserPages"; 
import { useEffect, useState, useRef } from "react"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_UPLOAD_URL = `${API_BASE_URL}/api/images/upload`;

export const AuthAndUpload = () => {
    const { 
        isLoaded: authLoaded, 
        isSignedIn, 
        getToken, 
        userId 
    } = useAuth();
    

    const { fetchUserPages, currentImageCount, MAX_IMAGE_SLOTS } = useUserPages(); 

    const [isUploading, setIsUploading] = useState(false);
    const [showLimitPopup, setShowLimitPopup] = useState(false);
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (authLoaded && isSignedIn && userId) {
            fetchUserPages(userId); 
        } else if (authLoaded && !isSignedIn) {
            fetchUserPages();
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
            const token = await getToken({ template: "long-lasting" }); 
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
            
            console.log("Upload successful!");

            if (userId) {
                await fetchUserPages(userId); 
            } else {
                await fetchUserPages();
            }

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
                <SignedOut>
                <SignInButton 
                    mode="modal"
                    appearance={{
                        baseTheme: dark,
                        variables: {
                            colorPrimary: "#5a47ce", 
                            colorText: "white", 
                            colorBackground: "#232323", 
                            colorInputBackground: "#1a1a1a", 
                        },
                        elements: {
                            socialButtonsText: {
                            color: '#ffffff',
                            },
                        }
                    }}
                >
                <button className="auth-btn-base">
                    Sign Up / Log In
                </button>
                </SignInButton>
                </SignedOut>

                <SignedIn>
                <div className="flex items-center gap-[10px] flex-wrap justify-end">

                    <label 
                        htmlFor="file-upload" 
                        onClick={handleUploadButtonClick}
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
                        <UserButton afterSignOutUrl="/" 
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: {
                                        width: '40px', 
                                        height: '40px',
                                        border: 'none',
                                    },
                                    userButtonOuterIdentifier: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }
                                }
                            }}
                        /> 
                    </div>
                </div>
                </SignedIn>
            </div>
        </>
    );
};