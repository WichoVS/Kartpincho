var manager;
var terreno;
var modelos = [];
var colliders = [];

var skyboxArray = [];

const clock = new THREE.Clock();
const delta = clock.getDelta();
var pivot = new THREE.Group();

const width = 500;
const height = 300;
const intensity = 20;
const numOpts = 5;
const arrayLightsColors = [
  "#EBEBEB",
  "#FF808C",
  "#D780FF",
  "#393073",
  "#54A89D",
];
var arrayLights = [];

$(() => {
  window.addEventListener("resize", onWindowResize, false);
  $("#fondo3d").append(renderer.domElement);
  for (let index = 0; index < numOpts; index++) {
    if (index == 0) {
      var rectLight = new THREE.RectAreaLight(
        arrayLightsColors[index],
        intensity,
        width,
        height
      );
    } else {
      var rectLight = new THREE.RectAreaLight(
        arrayLightsColors[index],
        0,
        width,
        height
      );
    }

    rectLight.position.set(0, 300, 0);
    rectLight.lookAt(0, 0, 0);

    arrayLights.push(rectLight);
  }

  arrayLights.forEach((element) => {
    scene.add(element);
  });

  pivot.position.x = 0;
  pivot.position.y = 0;
  pivot.position.z = 0;

  pivot.add(camera);

  CargaModelos();
  scene.add(pivot);
  pivot.rotation.order = "YXZ";
  camera.rotation.order = "YXZ";
  camera.rotation.x = THREE.Math.degToRad(-25);

  camera.position.z = 300;
  camera.position.y = 200;
  camera.position.x = 0;
  InicializaEventos();
  render();
});

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
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
  const loader = new THREE.FBXLoader();
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

      console.log(texture);
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
