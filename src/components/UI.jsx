import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { pageAtom, dynamicPagesAtom, uiVisibleAtom } from "../stores/pageStore"; 
import { AuthAndUpload } from "./AuthAndUpload"; 

export const UI = ({ setIsUploading, isUploading }) => {
  const [page, setPage] = useAtom(pageAtom);
  const dynamicPages = useAtomValue(dynamicPagesAtom); 
  const uiVisible = useAtomValue(uiVisibleAtom);

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
      <div className="ui-container">
        <AuthAndUpload 
          setIsUploading={setIsUploading} 
          isUploading={isUploading} 
        />
      </div>

      <main 
        className={`fixed inset-0 z-50 flex flex-col justify-between select-none pointer-events-none transition-opacity duration-500 ${
          uiVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="h-20"></div> 

        {/* --- MOBILE NAVIGATION --- */}
        <div className="w-full flex flex-col items-center p-4 md:hidden mb-6">
          <div className="flex w-full max-w-sm gap-3 bg-black/40 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl pointer-events-auto">
            <div className="flex flex-col gap-2 shrink-0 border-r border-white/10 pr-3">
              <button
                className={`transition-all duration-300 px-3 py-2 rounded-lg text-xs font-bold uppercase border ${0 === page ? "bg-white text-black border-white" : "bg-black/40 text-white border-transparent"}`}
                onClick={() => setPage(0)}
              >
                Cover
              </button>
              <button
                className={`transition-all duration-300 px-3 py-2 rounded-lg text-xs font-bold uppercase border ${page === backCoverIndex || page === backCoverClosedIndex ? "bg-white text-black border-white" : "bg-black/40 text-white border-transparent"}`}
                onClick={() => setPage(backCoverClosedIndex)} 
              >
                Back
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 w-fit">
              {dynamicPages.map((_, index) => {
                if (index === 0 || index >= backCoverIndex) return null;
                return (
                  <button
                    key={index}
                    className={`transition-all duration-300 px-3 py-2 rounded-lg text-xs font-bold border flex items-center justify-center ${index === page ? "bg-white text-black border-white" : "bg-black/40 text-white border-white/10"}`}
                    style={{ minWidth: '45px' }}
                    onClick={() => setPage(index)}
                  >
                    P{index}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="w-full hidden md:flex justify-center p-10">
          <div className="flex items-start gap-4 bg-black/40 p-4 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl pointer-events-auto">
            <div className="flex flex-col gap-2 shrink-0 border-r border-white/10 pr-4">
              <button
                className={`transition-all duration-300 px-6 py-3 rounded-xl text-sm font-bold uppercase border ${0 === page ? "bg-white text-black border-white" : "bg-black/40 text-white border-transparent hover:border-white/50"}`}
                onClick={() => setPage(0)}
              >
                Cover
              </button>
              <button
                className={`transition-all duration-300 px-6 py-3 rounded-xl text-sm font-bold uppercase border ${page === backCoverIndex || page === backCoverClosedIndex ? "bg-white text-black border-white" : "bg-black/40 text-white border-transparent hover:border-white/50"}`}
                onClick={() => setPage(backCoverClosedIndex)} 
              >
                Back Cover
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 w-fit">
              {dynamicPages.map((_, index) => {
                if (index === 0 || index >= backCoverIndex) return null;
                return (
                  <button
                    key={index}
                    className={`transition-all duration-300 px-5 py-3 rounded-xl text-sm font-bold border flex items-center justify-center ${index === page ? "bg-white text-black border-white" : "bg-black/40 text-white border-white/10 hover:border-white/50"}`}
                    style={{ minWidth: '60px' }}
                    onClick={() => setPage(index)}
                  >
                    P{index}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Background Scrolling Text */}
      <div className="fixed inset-0 flex items-center -rotate-2 select-none w-full z-0 pointer-events-none opacity-10">
        <div className="w-full">
          <div className="animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h1 className="shrink-0 text-white text-10xl font-black">Memories</h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light outline-text">Creative</h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">Personalize</h2>
            <h2 className="shrink-0 text-white text-9xl font-medium outline-text">Capture</h2>
          </div>
        </div>
      </div>
    </>
  );
};