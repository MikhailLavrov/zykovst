import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";

export const StepanAnimation = () => {
  const sphereGLTF = useGLTF(process.env.PUBLIC_URL + "/models/mat_001/mat_001.gltf");
  const abstractionGLTF = useGLTF(process.env.PUBLIC_URL + "/models/anim_001/anim_001.gltf");
  const sphereRef = useRef();
  const abstractionRef = useRef();
  const { actions } = useAnimations(abstractionGLTF.animations, abstractionRef);
  
  // Загружаем текстуры для sphereGLTF
  const [diffuseMap, displacementMap, normalMap, roughnessMap, grass_texture, forge_texture] = useTexture([
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Diffuse.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Displacement.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_Normal.jpg",
    process.env.PUBLIC_URL + "/models/mat_001/Abstract_Chiped_Wood_ReflRoughness.jpg",
    process.env.PUBLIC_URL + "/textures/grass_texture.webp",
    process.env.PUBLIC_URL + "/textures/forge_texture.webp",
  ]);
  
  // Компонент Leva
  const { currentModel, rotation } = useControls({
    currentModel: { value: "A", options: { Sphere: "A", Abstraction: "B" } },
    rotation: true,
  });
  
  // Sphere settings
  const sphereOptions = useControls("Sphere Settings", {
    texture: { value: diffuseMap, options: { default: diffuseMap, grass: grass_texture, forge: forge_texture } },
    metalness: { value: 0.3, min: 0, max: 1 },
    roughness: { value: 0.3, min: 0, max: 1 },
    wireframe: false,
    vertexColors: false,
  });
  
  // Abstraction settings
  const abstractionOptions = useControls("Abstraction Settings", {
    roughness: { value: 0.3, min: 0, max: 1 },
    metalness: { value: 0.3, min: 0, max: 1 },
    wireframe: false,
  });

  // Настройка материала с текстурами (для sphereGLTF)
  const material = new THREE.MeshStandardMaterial({
    map: sphereOptions.texture,
    displacementMap: displacementMap,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    metalness: sphereOptions.metalness,
    roughness: sphereOptions.roughness,
    wireframe: sphereOptions.wireframe,
    displacementScale: 0.1,
    vertexColors: sphereOptions.vertexColors,
  });

  // Анимация вращения общая
  useFrame(() => {
    const makeRotate = (ref) => {
      ref.current.rotation.x += 0.0015;
      ref.current.rotation.y += 0.0015;
    }
    
    if (sphereRef.current && rotation) {
      makeRotate(sphereRef)
    }
    if (abstractionRef.current && rotation) {
      makeRotate(abstractionRef)
    }
  });

  // Запуск встроенной анимации для abstractionGLTF, только если выбрана модель "B"
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
          obj.material.normalMap = normalMap
          obj.material.roughnessMap = roughnessMap
          obj.material.displacementScale = 0.1
          obj.material.roughness = abstractionOptions.roughness
          obj.material.metalness = abstractionOptions.metalness
          obj.material.wireframe = abstractionOptions.wireframe
        }
      })
    }
  }, [abstractionGLTF, diffuseMap, normalMap, roughnessMap, abstractionOptions.roughness, abstractionOptions.metalness, abstractionOptions.wireframe]);

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
        <primitive 
          ref={abstractionRef}
          object={abstractionGLTF.scene}
          position={[0, 0.6, 0]}
          receiveShadow
          castShadow
        />
      )}
    </>
  );
};

useGLTF.preload(process.env.PUBLIC_URL + "/models/anim_001/anim_001.gltf");
