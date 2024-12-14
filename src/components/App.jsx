import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import '../style.css';
import { StepanAnimation } from './StepanAnimation';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Leva } from 'leva'
import { Loader } from './Loader';

export const App = () => {
  return (
    <>
      <Canvas shadows camera={{ position: [3, 1, 3], fov: 40 }}>
        <Suspense fallback={<Loader />}>
          <OrbitControls
            target={[0, 0.6, 0]}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
          />
          <color attach="background" args={["#a3a3a3"]} />
          <ambientLight color={'white'} intensity={0.5} />
          <Environment files={process.env.PUBLIC_URL + "/textures/canary_wharf_1k.hdr"} />

          <ContactShadows
            opacity={0.6} 
            scale={5} 
            blur={5} 
            far={1} 
            color="#000000" 
          />

          <StepanAnimation />
        </Suspense>

      </Canvas>
      <Leva />
    </>
  );
}
