/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import modelPath from "./models/Cube.obj";
import "./App.css";
import {WireframeGeometry} from "./WireframeGeometry";

export default function LoadObject() {
  const [childMaterials, setChildMaterials] = useState({});
  const { scene } = useThree();

  const object = useLoader(OBJLoader, modelPath);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const materialsChildren = {};
      object.traverse((child) => {
        if (child.isMesh) {
          materialsChildren[child.uuid] = child.material;
        }
      });
      setChildMaterials(materialsChildren);
    }
    return () => {
      mounted = false;
    };
  }, [object]);

  useEffect(() => {
    let mounted = true;
    if (mounted && childMaterials && Object.keys(childMaterials).length > 0) {

      const meshGeometry = object.children[0].geometry
      console.log(meshGeometry)
      const geometry = new WireframeGeometry(meshGeometry);
      const segments = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
        color: 0x1B3740,
        // linewidth: 1.5
      }));
      scene.add(segments);


      // object.traverse((child) => {
      //   if (child.isMesh) {
      //     child.castShadow = true;
      //     child.receiveShadow = true;
      //     if (childMaterials[child.uuid]) {
      //       console.log(child)
      //       child.material = new THREE.MeshPhongMaterial({
      //         color: 0x888888,
      //         wireframe: true,
      //       });
      //
      //       scene.add(child);
      //     }
      //   }
      // });
    }
    return () => {
      mounted = false;
    };
  }, [childMaterials]);
}
