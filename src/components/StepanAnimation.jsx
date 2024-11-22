import { useFrame } from "@react-three/fiber";
import { AccumulativeShadows, ContactShadows, Environment, OrbitControls, RandomizedLight, useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useControls, useStoreContext } from "leva";

export const StepanAnimation = () => {
  const group = useRef();
  const sphereGLTF = useGLTF(process.env.PUBLIC_URL + "/models/mat_001/mat_001.gltf");
  const animaGLTF = useGLTF(process.env.PUBLIC_URL + "/models/anim_001/anim_001.gltf");
  const ballRef = useRef();
  const animaRef = useRef();
  const texture = useTexture('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1mtrFjnGJ4c5LmbhmMlZi5frAHzbT0kj_HQ&s');

  const store = useStoreContext();

  const { actions } = useAnimations(animaGLTF.animations, group);
  
  // Загружаем текстуры для материала
  const [diffuseMap, displacementMap, normalMap, roughnessMap] = useTexture([
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Diffuse.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Displacement.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Normal.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_ReflRoughness.jpg",
  ]);
  
  const { currentModel, rotation } = useControls({
    currentModel: { value: "A", options: { Sphere: "A", Abstraction: "B" } },
    rotation: true,
  });

  // Abstraction settings
  const sphereOptions = useControls("Sphere Settings", {
    texture: { value: diffuseMap, options: { first: diffuseMap, second: texture } },
  });

  // Abstraction settings
  const abstractionOptions = useControls("Abstraction Settings", {
    roughness: { value: 0.3, min: 0, max: 1 },
  });

  useEffect(() => {
    if (!store) {
      console.warn("Leva store is not available");
      return;
    }
  
    const abstractionFolder = store.get("Abstraction Settings");
  
    if (!abstractionFolder) {
      console.warn("Abstraction Settings folder is not defined");
      return;
    }
  
    store.setVisible("Abstraction Settings", currentModel === "B");
  }, [currentModel, store]);
  
  
  
  if (!diffuseMap || !displacementMap || !normalMap || !roughnessMap) {
    console.warn("Textures not loaded yet");
  }

  // Настройка материала с текстурами
  const material = new THREE.MeshStandardMaterial({
    map: sphereOptions.texture,
    displacementMap: displacementMap,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    displacementScale: 0.1,
  });

  // Анимация вращения объекта для ballRef
  useFrame(() => {
    if (ballRef.current && rotation) {
      ballRef.current.rotation.x += 0.0015;
      ballRef.current.rotation.y += 0.001;
    }
    if (animaRef.current && rotation) {
      animaRef.current.rotation.y += 0.0015;
    }
  });

  // Запуск анимации для animaRef, только если выбрана модель "B"
  useEffect(() => {
    const action = actions[Object.keys(actions)[0]]; // анимация для модели B

    if (currentModel === 'A') {
      // Останавливаем анимацию для модели B
      if (action) action.stop();
    } else if (currentModel === 'B' && action) {
      // Запуск анимации для модели B
      action.loop = THREE.LoopPingPong;
      action.repetitions = Infinity;
      action.play();
    }
  }, [actions, currentModel]); // Перезапуск анимации при изменении модели

  useEffect(() => {
    if (animaGLTF && animaGLTF.scene) {
      animaGLTF.scene.traverse((obj) => {
        if (obj.isMesh) {
          console.log(obj.material)
          obj.material.map = texture
          obj.material.normalMap = normalMap
          obj.material.roughnessMap = roughnessMap
          obj.material.displacementScale = 0.1
          obj.material.roughness = abstractionOptions.roughness
        }
      })
    }
  }, [animaGLTF, diffuseMap, normalMap, roughnessMap, abstractionOptions.roughness, texture]);

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

      {/* Группа для анимации и объектов */}
      <group ref={group} dispose={null}>
        {/* Меш для объекта с материалом */}
        {currentModel === "A" && (
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
        )}

        {/* Меш для анимации модели B */}
        {currentModel === "B" && (
          <primitive ref={animaRef} object={animaGLTF.scene} position={[0, 0.6, 0]} />
        )}
        
        {/* Тени */}
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

      {/* Окружение */}
      <Environment preset="forest" />
      <ContactShadows opacity={0.6} scale={10} blur={2} far={1} resolution={256} color="#000000" />
    </>
  );
};

useGLTF.preload(process.env.PUBLIC_URL + "/models/anim_001/anim_001.gltf");
