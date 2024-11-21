import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import '../style.css';
import { StepanAnimation } from './StepanAnimation';
import { Loader } from '@react-three/drei';

export const App = () => {
  return (
    <>
      <Canvas shadows camera={{ position: [3, 1, 3], fov: 40 }}>
        <Suspense fallback={null}>
            <StepanAnimation />
        </Suspense>
      </Canvas>
      <Loader
        containerStyles={{ background: "rgba(0,0,0,0.7)" }}
        barStyles={{ background: "red" }}
        dataStyles={{ color: "white", fontFamily: "Comfortaa" }}
      />
    </>
  );
}
