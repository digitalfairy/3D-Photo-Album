import { atom } from "jotai";

const DSC_IMAGES = [
    "DSC00680.jpg",
    "DSC00933.jpg",
    "DSC00966.jpg",
    "DSC00983.jpg",
    "DSC00993.jpg",
    "DSC01011.jpg",
    "DSC01040.jpg",
    "DSC01064.jpg",
    "DSC01071.jpg",
    "DSC01103.jpg",
    "DSC01145.jpg",
    "DSC01420.jpg",
    "DSC01461.jpg",
    "DSC01489.jpg",
    "DSC02031.jpg",
    "DSC02064.jpg",
    "DSC02069.jpg",
];

const DSC_PATHS = DSC_IMAGES.map(name => `/textures/${name}`); 

const constructDefaultBook = (paths) => {
    const pages = [];

    pages.push({
        front: "/textures/book-cover.jpg",  
        back: paths.length > 0 ? paths[0] : null 
    });

    for (let i = 1; i < paths.length; i += 2) {
        pages.push({
            front: paths[i],
            back: paths[i + 1] ? paths[i + 1] : paths[i] 
        });
    }

    pages.push({
        front: null, 
        back: "/textures/book-back.jpg" 
    });
    
    return pages;
};

export const defaultPages = constructDefaultBook(DSC_PATHS);

export const dynamicPagesAtom = atom(defaultPages); 
export const pageAtom = atom(0);
export const uiVisibleAtom = atom(true);