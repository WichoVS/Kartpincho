import * as THREE from "../../library/threejs/src/Three.js";

import { OrbitControls } from "../../library/threejs/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "../../library/threejs/examples/jsm/loaders/FBXLoader.js";
//import { OrbitControls } from "https://cdn.skypack.dev/three@0.137.5/examples/jsm/controls/OrbitControls.js";

var skyboxArray = [];

$(() => {
  $("#fondo3d").append(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
  scene.add(ambientLight);
  scene.add(cube);
  CargaModelos();
  render();
  camera.position.z = 5;
});

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

const CrearEscena = () => {
  return new THREE.Scene();
};

const CrearCamara = () => {
  return new THREE.PerspectiveCamera(
    75,
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
    "../../assets/modelos/menu-principal/suelo/EscenarioV2.fbx",
    (fbx) => {
      let color = textureLoader.load(
        "../../assets/modelos/menu-principal/suelo/texturasV2/EscenarioV2_Albedo.png"
      );
      let ao = textureLoader.load(
        "../../assets/modelos/menu-principal/suelo/texturasV2/EscenarioV2_AO.png"
      );
      let roughness = textureLoader.load(
        "../../assets/modelos/menu-principal/suelo/texturasV2/EscenarioV2_Roughness.png"
      );
      let normal = textureLoader.load(
        "../../assets/modelos/menu-principal/suelo/texturasV2/EscenarioV2_Normal.png"
      );

      let texture = new THREE.MeshStandardMaterial({
        aoMap: ao,
        map: color,
        normalMap: normal,
        roughnessMap: roughness,
      });

      fbx.traverse((child) => {
        if (child.isMesh) {
          console.log(child.geometry.attributes.uv);
          child.material = texture;
          console.log(texture);
        }
      });

      fbx.name = "suelo";
      fbx.translateX(0);
      fbx.translateY(0);
      fbx.translateZ(0);
      fbx.scale.set(1, 1, 1);
      scene.add(fbx);
    },
    () => {
      //Acciones cuando se cargue este modelo
      let sb_ft = textureLoader.load(
        "../../assets/images/skybox/Dia/meadow_ft.jpg"
      );
      let sb_bk = textureLoader.load(
        "../../assets/images/skybox/Dia/meadow_bk.jpg"
      );
      let sb_up = textureLoader.load(
        "../../assets/images/skybox/Dia/meadow_up.jpg"
      );
      let sb_dn = textureLoader.load(
        "../../assets/images/skybox/Dia/meadow_dn.jpg"
      );
      let sb_rt = textureLoader.load(
        "../../assets/images/skybox/Dia/meadow_rt.jpg"
      );
      let sb_lf = textureLoader.load(
        "../../assets/images/skybox/Dia/meadow_lf.jpg"
      );
      skyboxArray.push(new THREE.MeshBasicMaterial({ map: sb_ft }));
      skyboxArray.push(new THREE.MeshBasicMaterial({ map: sb_bk }));
      skyboxArray.push(new THREE.MeshBasicMaterial({ map: sb_up }));
      skyboxArray.push(new THREE.MeshBasicMaterial({ map: sb_dn }));
      skyboxArray.push(new THREE.MeshBasicMaterial({ map: sb_rt }));
      skyboxArray.push(new THREE.MeshBasicMaterial({ map: sb_lf }));
      for (let i = 0; i < 6; i++) skyboxArray[i].side = THREE.BackSide;
      let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
      let skybox = new THREE.Mesh(skyboxGeo, skyboxArray);
      scene.add(skybox);
    },
    (error) => {
      console.log(error);
    }
  );
};
