import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";

export const StepanAnimation = () => {
  const sphereGLTF = useGLTF(process.env.PUBLIC_URL + "/models/mat_001/mat_001.gltf");
  const abstractionGLTF = useGLTF(process.env.PUBLIC_URL + "/models/anim_001/anim_001.gltf");
  const sphereRef = useRef();
  const abstractionRef = useRef();
  const texture2 = useTexture('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW-glEOwG5L2ms7K9YhYIC5OeTOXYfsypPsW2lef3DNuenf3JJiqujeR1BaaCGYYPB4rA&usqp=CAU');
  const texture3 = useTexture('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1mtrFjnGJ4c5LmbhmMlZi5frAHzbT0kj_HQ&s');
  const { actions } = useAnimations(abstractionGLTF.animations, abstractionRef);
  
  // Загружаем текстуры для sphereGLTF
  const [diffuseMap, displacementMap, normalMap, roughnessMap] = useTexture([
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Diffuse.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Displacement.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Normal.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_ReflRoughness.jpg",
  ]);
  
  // Компонент Leva
  const { currentModel, rotation } = useControls({
    currentModel: { value: "A", options: { Sphere: "A", Abstraction: "B" } },
    rotation: true,
  });

  // Sphere settings
  const sphereOptions = useControls("Sphere Settings", {
    texture: { value: diffuseMap, options: { first: diffuseMap, second: texture2, third: texture3 } },
  });

  // Abstraction settings
  const abstractionOptions = useControls("Abstraction Settings", {
    roughness: { value: 0.3, min: 0, max: 1 },
  });

  // Настройка материала с текстурами (для sphereGLTF)
  const material = new THREE.MeshStandardMaterial({
    map: sphereOptions.texture,
    displacementMap: displacementMap,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    displacementScale: 0.1,
  });

  // Анимация вращения объекта для sphereGLTF
  useFrame(() => {
    if (sphereRef.current && rotation) {
      sphereRef.current.rotation.x += 0.0015;
      sphereRef.current.rotation.y += 0.001;
    }
    if (abstractionRef.current && rotation) {
      abstractionRef.current.rotation.y += 0.0015;
    }
  });

  // Запуск анимации для abstractionGLTF, только если выбрана модель "B"
  useEffect(() => {
    const action = actions[Object.keys(actions)[0]];

    if (currentModel === 'A') {
      if (action) action.stop();
    } else if (currentModel === 'B' && action) {
      action.loop = THREE.LoopPingPong;
      action.repetitions = Infinity;
      action.play();
    }
  }, [actions, currentModel]); // Перезапуск анимации при изменении модели

  // Текстуры и опции для abstractionGLTF
  useEffect(() => {
    if (abstractionGLTF && abstractionGLTF.scene) {
      abstractionGLTF.scene.traverse((obj) => {
        if (obj.isMesh) {
          console.log(obj.material)
          obj.material.map = texture2
          obj.material.normalMap = normalMap
          obj.material.roughnessMap = roughnessMap
          obj.material.displacementScale = 0.1
          obj.material.roughness = abstractionOptions.roughness
        }
      })
    }
  }, [abstractionGLTF, diffuseMap, normalMap, roughnessMap, abstractionOptions.roughness, texture2]);

  return (
    <>
      {/* Сфера с материалом */}
      {currentModel === "A" && (
        <mesh
          ref={sphereRef}
          position={[0, 0.6, 0]} // Поднимите объект чуть выше уровня пола
          geometry={sphereGLTF.nodes.geo1.geometry}
          material={material}
          morphTargetDictionary={sphereGLTF.nodes.geo1.morphTargetDictionary}
          morphTargetInfluences={sphereGLTF.nodes.geo1.morphTargetInfluences}
          castShadow
          receiveShadow
        />
      )}

      {/* Анимированная абстракция */}
      {currentModel === "B" && (
        <primitive ref={abstractionRef} object={abstractionGLTF.scene} position={[0, 0.6, 0]} receiveShadow castShadow />
      )}

      {/* Окружение */}
      <Environment preset="forest" />
      <ContactShadows opacity={0.6} scale={5} blur={5} far={1} resolution={256} color="#000000" />
    </>
  );
};

useGLTF.preload(process.env.PUBLIC_URL + "/models/anim_001/anim_001.gltf");
