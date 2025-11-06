import { useAtom } from "jotai";
import { useEffect } from "react";
import { pageAtom, dynamicPagesAtom } from "../stores/pageStore"; 
import { AuthAndUpload } from "./AuthAndUpload"; 


export const UI = () => {
const [page, setPage] = useAtom(pageAtom);
const [dynamicPages] = useAtom(dynamicPagesAtom); 

const backCoverIndex = dynamicPages.length > 0 ? dynamicPages.length - 1 : 0; 
const backCoverClosedIndex = dynamicPages.length; 

useEffect(() => {
     if (page !== undefined) { 
     const audio = new Audio("/audios/page-flip-01a.mp3");
     audio.play();
     }
}, [page]);

return (
<>
    <AuthAndUpload /> 

    <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">

    <div></div> 

    <div className="w-full pointer-events-auto flex justify-center p-4 md:hidden">
        <div className="flex w-full max-w-lg justify-between p-2 sm:p-4">

            <div className="flex flex-col gap-2 justify-between">
                {dynamicPages.length > 0 && (
                    <button
                        key={0}
                        className={`border-transparent hover:border-white transition-all duration-300 px-3 py-2 rounded-full text-sm sm:text-lg uppercase shrink-0 border ${
                            0 === page ? "bg-white/90 text-black" : "bg-black/30 text-white"
                        }`}
                        onClick={() => setPage(0)}
                    >
                        Cover
                    </button>
                )}
                <button
                    key={backCoverClosedIndex}
                    className={`border-transparent hover:border-white transition-all duration-300 px-3 py-2 rounded-full text-sm sm:text-lg uppercase shrink-0 border ${
                        page === backCoverIndex || page === backCoverClosedIndex 
                        ? "bg-white/90 text-black"
                        : "bg-black/30 text-white"
                    }`}
                    onClick={() => setPage(backCoverClosedIndex)} 
                >
                    Back Cover
                </button>
            </div>

            <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        {dynamicPages.map((_, index) => {
                            if (index > 0 && index <= 4 && index < backCoverIndex) {
                                return (
                                    <button
                                        key={index}
                                        className={`border-transparent hover:border-white transition-all duration-300 px-3 py-2 rounded-full text-sm sm:text-lg uppercase shrink-0 border ${
                                            index === page ? "bg-white/90 text-black" : "bg-black/30 text-white"
                                        }`}
                                        onClick={() => setPage(index)}
                                    >
                                        Page {index}
                                    </button>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <div className="flex gap-2">
                        {dynamicPages.map((_, index) => {
                            if (index >= 5 && index < backCoverIndex) {
                                return (
                                    <button
                                        key={index}
                                        className={`border-transparent hover:border-white transition-all duration-300 px-3 py-2 rounded-full text-sm sm:text-lg uppercase shrink-0 border ${
                                            index === page ? "bg-white/90 text-black" : "bg-black/30 text-white"
                                        }`}
                                        onClick={() => setPage(index)}
                                    >
                                        Page {index}
                                    </button>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
    </div>

    <div className="w-full overflow-auto pointer-events-auto hidden md:flex justify-center">
        <div className="flex items-center gap-2 sm:gap-4 max-w-full p-4 sm:p-10">
            
            {[...dynamicPages].map((_, index) => {
                if (index >= backCoverIndex) return null;  

                return (
                    <button
                        key={index}
                        className={`border-transparent hover:border-white transition-all duration-300 px-3 py-2 sm:px-4 sm:py-3 rounded-full text-sm sm:text-lg uppercase shrink-0 border ${
                        index === page
                            ? "bg-white/90 text-black"
                            : "bg-black/30 text-white"
                        }`}
                        onClick={() => setPage(index)}
                    >
                        {index === 0 ? "Cover" : `Page ${index}`}
                    </button>
                );
            })}

            <button
                className={`border-transparent hover:border-white transition-all duration-300 px-3 py-2 sm:px-4 sm:py-3 rounded-full text-sm sm:text-lg uppercase shrink-0 border ${
                    page === backCoverIndex || page === backCoverClosedIndex
                    ? "bg-white/90 text-black"
                    : "bg-black/30 text-white"
                }`}
                onClick={() => setPage(backCoverClosedIndex)}
            >
                Back Cover
            </button>
        </div>
    </div>
</main>

<div className="fixed inset-0 flex items-center -rotate-2 select-none w-full z-0 translate-z-0">
    <div className="w-full">
        <div className="bg-white/0 animate-horizontal-scroll flex items-center gap-4 sm:gap-8 w-max px-4 sm:px-8">
            <h1 className="shrink-0 text-white/70 text-3xl sm:text-10xl font-black ">
                Memories
            </h1>
            <h2 className="shrink-0 text-white/70 text-xl sm:text-8xl italic font-light">
                Creative
            </h2>
            <h2 className="shrink-0 text-white/70 text-4xl sm:text-12xl font-bold">
                Personalize
            </h2>
            <h2 className="shrink-0 text-white/70 text-4xl sm:text-12xl font-bold italic outline-text">
                Capture
            </h2>
            <h2 className="shrink-0 text-white/70 text-2xl sm:text-9xl font-medium">
                Create
            </h2>
            <h2 className="shrink-0 text-white/70 text-2xl sm:text-9xl font-extralight italic">
                Gallery
            </h2>
            <h2 className="shrink-0 text-white/70 text-5xl sm:text-13xl font-bold">
                Photos
            </h2>
            <h2 className="shrink-0 text-white/70  text-5xl sm:text-13xl font-bold outline-text italic">
                Design
            </h2>
        </div>
        <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-4 sm:gap-8 px-4 sm:px-8 w-max translate-z-0">
            <h1 className="shrink-0 text-white/70  text-3xl sm:text-10xl font-black ">
                Memories
            </h1>
            <h2 className="shrink-0 text-white/70  text-xl sm:text-8xl italic font-light">
                Creative
            </h2>
            <h2 className="shrink-0 text-white/70  text-4xl sm:text-12xl font-bold">
                Personalize
            </h2>
            <h2 className="shrink-0 text-white/70  text-4xl sm:text-12xl font-bold italic outline-text">
                Capture
            </h2>
            <h2 className="shrink-0 text-white/70  text-2xl sm:text-9xl font-medium">
                Create
            </h2>
            <h2 className="shrink-0 text-white/70  text-2xl sm:text-9xl font-extralight italic">
                Gallery
            </h2>
            <h2 className="shrink-0 text-white/70  text-5xl sm:text-13xl font-bold">
                Photos
            </h2>
            <h2 className="shrink-0 text-white/70 text-5xl sm:text-13xl font-bold outline-text italic">
                Design
            </h2>
        </div>
    </div>
</div>
</>
);
};