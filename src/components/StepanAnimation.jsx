import { useFrame } from "@react-three/fiber";
import { AccumulativeShadows, ContactShadows, Environment, OrbitControls, RandomizedLight, useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

useGLTF.preload(process.env.PUBLIC_URL + "/models/anim_001/anim_001.gltf");

export const StepanAnimation = () => {
  const group = useRef();
  const sphereGLTF = useGLTF(process.env.PUBLIC_URL + "/models/mat_001/mat_001.gltf");
  const animGLTF = useGLTF(process.env.PUBLIC_URL + "/models/anim_001/anim_001.gltf");
  const ballRef = useRef();
  const animRef = useRef();

  const { actions } = useAnimations(animGLTF.animations, group);

  // Загружаем текстуры
  const [diffuseMap, displacementMap, normalMap, roughnessMap] = useTexture([
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Diffuse.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Displacement.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Normal.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_ReflRoughness.jpg",
  ]);

  // Настройка материала
  const material = new THREE.MeshStandardMaterial({
    map: diffuseMap,
    displacementMap: displacementMap,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    displacementScale: 0.1,
  });

  useFrame(() => {
    if (ballRef.current) {
      ballRef.current.rotation.x += 0.0015
      ballRef.current.rotation.y += 0.001
    }
  }, [])

  useEffect(() => {
    if (actions) {
      actions[Object.keys(actions)[0]]?.play();
    }
    console.log(sphereGLTF)
  }, [actions]);

  return (
    <>
      <OrbitControls
        target={[0, 0.5, 0]}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
        enableDamping={true}
        dampingFactor={0.1}
        />

      <color attach="background" args={["#a3a3a3"]} />
      <ambientLight intensity={0.1} />

      <group ref={group} dispose={null}>
        <mesh
          ref={ballRef}
          position={[0, 0.6, 0]} // Поднимите объект чуть выше уровня пола
          geometry={sphereGLTF.nodes.geo1.geometry}
          material={material}
          morphTargetDictionary={sphereGLTF.nodes.geo1.morphTargetDictionary}
          morphTargetInfluences={sphereGLTF.nodes.geo1.morphTargetInfluences}
          castShadow
          receiveShadow
          />
        <AccumulativeShadows temporal frames={200} color="lightgrey" colorBlend={0.5} opacity={1} scale={10} alphaTest={0.85}>
          <RandomizedLight
            amount={8}
            radius={10} // Увеличьте радиус, чтобы свет равномерно распределялся
            ambient={1}
            position={[5, 5, 5]} // Убедитесь, что свет падает сверху
            bias={0.001}
          />
        </AccumulativeShadows>

      </group>

      <Environment preset="forest" />
      <ContactShadows opacity={0.6} scale={10} blur={2} far={1} resolution={256} color="#000000" />
    </>
  );
}
