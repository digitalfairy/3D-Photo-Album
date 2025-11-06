import { useAtom } from "jotai";
import { dynamicPagesAtom, defaultPages } from "../stores/pageStore";
import { useAuth } from "@clerk/clerk-react";
import { useCallback, useState, useMemo } from "react"; 

const API_BASE_URL = "http://localhost:3001/api/images"; 

export const MAX_IMAGE_SLOTS = 16; 
const TOTAL_PAGES = 10; 
const BACK_COVER_PATH = "/textures/book-back.jpg"; 


/**
 * @param {string | undefined} mockUserId 
 * @returns {object} 
 */

export const useUserPages = () => {
	const { isLoaded, userId, getToken } = useAuth(); 
	const [pages, setPages] = useAtom(dynamicPagesAtom);

    const [userImageUrls, setUserImageUrls] = useState([]);

	const fetchUserPages = useCallback(async (mockUserId) => { 
		
		const effectiveUserId = mockUserId || userId;
		
		if (!isLoaded || !effectiveUserId) { 
			setPages(defaultPages);

            setUserImageUrls([]);
			return;
		}

		try {
			const token = await getToken({ template: "long-lasting" }); 
			
			const response = await fetch(`${API_BASE_URL}/me`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch user images.");
			}

			const rawUserImages = await response.json(); 
			const userImageUrls = rawUserImages.map(img => img.url);

            setUserImageUrls(userImageUrls);

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
	}, [isLoaded, getToken, setPages, userId]); 

    const currentImageCount = useMemo(() => userImageUrls.length, [userImageUrls]);
	
	return { pages, fetchUserPages, currentImageCount, MAX_IMAGE_SLOTS };
};