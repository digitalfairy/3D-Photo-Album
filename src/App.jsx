import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react"; 
import { OrbitControls } from "@react-three/drei";
import { useSetAtom } from "jotai";
import { uiVisibleAtom } from "./stores/pageStore";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { CustomLoader } from "./components/CustomLoader";

function CameraHandler() {
  const setUiVisible = useSetAtom(uiVisibleAtom);
  useFrame((state) => {
    const distance = state.camera.position.length();
    setUiVisible(distance >= 4.5);
  });
  return null;
}

function App() {
  const { isLoading: authLoading } = useAuth0();
  const [isUploading, setIsUploading] = useState(false);
  const hasFinishedFirstLoad = useRef(false);

  useEffect(() => {
    if (!authLoading) {
      hasFinishedFirstLoad.current = true;
    }
  }, [authLoading]);

  const showInitialLoader = authLoading && !hasFinishedFirstLoad.current;

  return (
    <>
      <CustomLoader isUploading={isUploading || showInitialLoader} />
      
      <UI setIsUploading={setIsUploading} isUploading={isUploading} />
      
      <Canvas shadows camera={{
          position: [-0.5, 1, window.innerWidth > 800 ? 6 : 12],
          fov: 45,
      }}>
        <CameraHandler />
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
        <OrbitControls 
          makeDefault 
          minDistance={2.5} 
          maxDistance={20} 
        />
      </Canvas>
    </>
  );
}

export default App;