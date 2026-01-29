import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react"; // Added useState here
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { CustomLoader } from "./components/CustomLoader"; // Added CustomLoader import

function App() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <>
      <CustomLoader isUploading={isUploading} />
      
      {/* Pass BOTH the state and the setter to UI */}
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