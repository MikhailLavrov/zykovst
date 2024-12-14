import { Html, useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export const Loader = () => {
  const { progress, loaded, total, item } = useProgress();
  const [activeLoad, setActiveLoad] = useState("");

  useEffect(() => {
    if (item) {
      const lastDotIndex = item.lastIndexOf(".");
      const extension = item.slice(lastDotIndex + 1).toLowerCase();

      let resourceType = "файлы";
      switch (extension) {
        case "gltf":
        case "glb":
          resourceType = "модели";
          break;
        case "jpg":
        case "png":
        case "hdr":
          resourceType = "текстуры";
          break;
        default:
          resourceType = "файлы";
          break;
      }

      setActiveLoad(resourceType);
    }
  }, [item]);

  return (
    <Html center>
      {progress < 100 ? (
        <div style={{ color: "red", display: 'flex', width: 'max-content', fontFamily: 'Comfortaa' }}>
          Загружаются {activeLoad}... {Math.round(progress)}% ({loaded}/{total})
        </div>
      ) : (
        <div style={{ color: "green" }}>Готово! Загружаем сцену...</div>
      )}
    </Html>
  );
};
