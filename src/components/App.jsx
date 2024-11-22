import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import '../style.css';
import { StepanAnimation } from './StepanAnimation';
import { Loader, OrbitControls } from '@react-three/drei';
import { Leva } from 'leva'

export const App = () => {
  return (
    <>
      <Canvas shadows camera={{ position: [3, 1, 3], fov: 40 }}>
        <OrbitControls
          target={[0, 0.6, 0]}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0}
        />
        <color attach="background" args={["#a3a3a3"]} />
        <ambientLight color={'white'} intensity={0.5} />

        <Suspense fallback={null}>
          <StepanAnimation />
        </Suspense>

      </Canvas>

      <Leva />
      <Loader
        containerStyles={{ background: "rgba(0,0,0,0.7)" }}
        barStyles={{ background: "red" }}
        dataStyles={{ color: "white", fontFamily: "Comfortaa" }}
        dataInterpolation={(p) => `Загрузка ${p.toFixed(0)}%`}
      />
    </>
  );
}
