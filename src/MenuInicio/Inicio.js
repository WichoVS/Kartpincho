import * as THREE from "../../libs/threejs/src/Three.js";
import { OptMove, GeneraEventos } from "./Inicio_Eventos.js";
import { RectAreaLightUniformsLib } from "../../libs/threejs/lights/RectAreaLightUniformsLib.js";

import { OrbitControls } from "../../libs/threejs/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "../../libs/threejs/examples/jsm/loaders/FBXLoader.js";

var skyboxArray = [];

const clock = new THREE.Clock();
const delta = clock.getDelta();
var pivot = new THREE.Group();

const width = 500;
const height = 300;
const intensity = 20;
const rectLight = new THREE.RectAreaLight("#FFFFFF", intensity, width, height);
const rectLightOp1 = new THREE.RectAreaLight("#BF0413", 0, width, height);
const rectLightOp2 = new THREE.RectAreaLight("#5A37A6", 0, width, height);
const rectLightOp3 = new THREE.RectAreaLight("#393073", 0, width, height);
const rectLightOp4 = new THREE.RectAreaLight("#04BFBF", 0, width, height);

$(() => {
  RectAreaLightUniformsLib.init();
  GeneraEventos();
  window.addEventListener("resize", onWindowResize, false);
  $("#fondo3d").append(renderer.domElement);
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
  //scene.add(ambientLight);

  rectLight.position.set(0, 300, 0);
  rectLight.lookAt(0, 0, 0);
  rectLightOp1.position.set(0, 300, 0);
  rectLightOp1.lookAt(0, 0, 0);
  rectLightOp2.position.set(0, 300, 0);
  rectLightOp2.lookAt(0, 0, 0);
  rectLightOp3.position.set(0, 300, 0);
  rectLightOp3.lookAt(0, 0, 0);
  rectLightOp4.position.set(0, 300, 0);
  rectLightOp4.lookAt(0, 0, 0);
  scene.add(rectLight);
  scene.add(rectLightOp1);
  scene.add(rectLightOp2);
  scene.add(rectLightOp3);
  scene.add(rectLightOp4);

  //const rectLightHelper = new THREE.RectAreaLightHelper(rectLight);
  //rectLight.add(rectLightHelper);

  pivot.position.x = 0;
  pivot.position.y = 0;
  pivot.position.z = 0;

  pivot.add(camera);

  scene.add(rectLight);
  CargaModelos();
  scene.add(pivot);
  pivot.rotation.order = "YXZ";
  camera.rotation.order = "YXZ";
  camera.rotation.x = THREE.Math.degToRad(-25);

  camera.position.z = 300;
  camera.position.y = 200;
  camera.position.x = 0;
  //camera.rotateX(THREE.Math.degToRad(5));
  render();
});

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  OptMove();
  let yRot = THREE.Math.radToDeg(
    pivot.rotation.y + THREE.Math.degToRad(0.25 + 50 * delta)
  );
  pivot.rotation.y = THREE.Math.degToRad(yRot);
}

const CrearEscena = () => {
  return new THREE.Scene();
};

const CrearCamara = () => {
  return new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    30000
  );
};

const CrearRenderer = () => {
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
};

const scene = CrearEscena();
const camera = CrearCamara();
const renderer = CrearRenderer();

const CargaModelos = () => {
  const loader = new FBXLoader();
  const textureLoader = new THREE.TextureLoader();

  loader.load(
    "../../assets/modelos/menu-principal/gokart/gokart.fbx",
    (fbx) => {
      //Acciones cuando se cargue este modelo

      fbx.name = "gokart";
      fbx.translateX(0);
      fbx.translateY(0);
      fbx.translateZ(0);
      fbx.scale.set(1, 1, 1);
      scene.add(fbx);
    },
    () => {},
    (error) => {
      console.log(error);
    }
  );

  loader.load(
    "../../assets/modelos/menu-principal/gokart/piso.fbx",
    (fbx) => {
      let color = textureLoader.load(
        "../../assets/modelos/menu-principal/suelo/floor/floor_Albedo.png"
      );
      let ao = textureLoader.load(
        "../../assets/modelos/menu-principal/suelo/floor/floor_AO.png"
      );
      let roughness = textureLoader.load(
        "../../assets/modelos/menu-principal/suelo/floor/floor_Roughness.png"
      );
      let normal = textureLoader.load(
        "../../assets/modelos/menu-principal/suelo/floor/floor_Normal.png"
      );
      let texture = new THREE.MeshStandardMaterial({
        aoMap: ao,
        map: color,
        normalMap: normal,
        roughnessMap: roughness,
      });
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.material = texture;
        }
      });

      fbx.name = "suelo";
      fbx.translateX(0);
      fbx.translateY(0);
      fbx.translateZ(0);
      fbx.scale.set(1, 1, 1);
      scene.add(fbx);
    },
    () => {},
    (error) => {
      console.log(error);
    }
  );

  loader.load(
    "../../assets/modelos/menu-principal/box/box.fbx",
    (fbx) => {
      let color = textureLoader.load(
        "../../assets/modelos/menu-principal/box/box/box_Albedo.png"
      );
      let ao = textureLoader.load(
        "../../assets/modelos/menu-principal/box/box/box_AO.png"
      );
      let roughness = textureLoader.load(
        "../../assets/modelos/menu-principal/box/box/box_Roughness.png"
      );
      let normal = textureLoader.load(
        "../../assets/modelos/menu-principal/box/box/box_Normal.png"
      );
      let texture = new THREE.MeshStandardMaterial({
        aoMap: ao,
        map: color,
        normalMap: normal,
        roughnessMap: roughness,
      });
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.material = texture;
        }
      });

      fbx.name = "box";
      fbx.translateX(0);
      fbx.translateY(0);
      fbx.translateZ(0);
      fbx.scale.set(1, 1, 1);
      scene.add(fbx);
    },
    () => {},
    (error) => {
      console.log(error);
    }
  );
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

export {
  clock,
  delta,
  camera,
  pivot,
  rectLight,
  rectLightOp1,
  rectLightOp2,
  rectLightOp3,
  rectLightOp4,
};
