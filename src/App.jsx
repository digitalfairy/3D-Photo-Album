import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { useSetAtom } from "jotai";
import { uiVisibleAtom } from "./stores/pageStore";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function CameraHandler() {
  const setUiVisible = useSetAtom(uiVisibleAtom);
  
  useFrame((state) => {
    // Calculate distance from center [0,0,0]
    const distance = state.camera.position.length();
    
    // Threshold: Hide UI if closer than 4.5 units
    // You can adjust 4.5 to 3.5 if you want it to stay visible longer
    if (distance < 3.4) {
      setUiVisible(false);
    } else {
      setUiVisible(true);
    }
  });
  return null;
}

function App() {
  const isDesktop = window.innerWidth > 800;

  return (
    <>
      <UI />
      <Canvas 
        shadows 
        camera={{ position: [-0.5, 1, isDesktop ? 6 : 12], fov: 45 }}
      >
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