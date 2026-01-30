import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react"; 
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { CustomLoader } from "./components/CustomLoader";

function App() {
  const { isLoading: authLoading } = useAuth0();
  const [isUploading, setIsUploading] = useState(false);
  
  // Track if we have finished the initial load at least once
  const hasFinishedFirstLoad = useRef(false);

  useEffect(() => {
    if (!authLoading) {
      hasFinishedFirstLoad.current = true;
    }
  }, [authLoading]);

  // Logic: Only show "Initializing" if it's the FIRST time loading.
  // After that, only show the loader for manual uploads.
  const shouldShowLoader = isUploading || (authLoading && !hasFinishedFirstLoad.current);

  return (
    <>
      <CustomLoader isUploading={shouldShowLoader} />
      
      <UI setIsUploading={setIsUploading} isUploading={isUploading} />
      
      <Canvas shadows camera={{
          position: [-0.5, 1, window.innerWidth > 800 ? 4 : 9],
          fov: 45,
      }}>
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
    </>
  );
}

export default App;