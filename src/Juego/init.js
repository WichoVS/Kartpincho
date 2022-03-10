import * as THREE from "../../libs/threejs/src/Three.js";
import { RectAreaLightUniformsLib } from "../../libs/threejs/lights/RectAreaLightUniformsLib.js";
import { FBXLoader } from "../../libs/threejs/examples/jsm/loaders/FBXLoader.js";
import { KBInputs } from "../Controles/keyboard.js";
import { delta } from "../MenuInicio/Inicio.js";
import * as CANNON from "../../libs/cannon.js/src/Cannon.js";
import { CannonHelper } from "../../libs/cannon.js/cannonhelper.js";

class Init {
  camera;
  scene;
  renderer;
  mLoader = new FBXLoader();
  tLoader = new THREE.TextureLoader();
  kart;
  delta;
  clock;
  kb = new KBInputs();
  world;
  mass = 150;
  dt;
  chassisShape;
  chassisBody;
  constructor() {
    this.clock = new THREE.Clock();
    this.camera = this.crearCamara();
    this.scene = this.crearEscena();
    this.renderer = this.crearRenderer();
    this.initThree();
    this.initCannon();
    document.addEventListener("keydown", (event) => this.onKeyDown(event));
    document.addEventListener("keyup", (event) => this.onKeyUp(event));
  }

  initCannon() {
    this.world = new CANNON.World();
    //var helper = new CannonHelper(this.scene, this.world);
    this.dt = 1 / 60;
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.gravity.set(0, -10, 0);
    this.world.defaultContactMaterial.friction = 0;

    const groundMaterial = new CANNON.Material("groundMaterial");
    const wheelMaterial = new CANNON.Material("wheelMaterial");

    const wheelGroundContactMaterial = (window.wheelGroundContactMaterial =
      new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
        friction: 0.3,
        restitution: 0,
        contactEquationStiffness: 1000,
      }));

    this.world.addContactMaterial(wheelGroundContactMaterial);

    //Car Physics body
    this.chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1, 0.5));
    this.chassisBody = new CANNON.Body({
      mass: this.mass,
    });
    this.chassisBody.addShape(this.chassisShape);
    this.chassisBody.position.set(0, 0, 4);
    this.chassisBody.angularVelocity.set(0, 0, 0.5);
    //CANNON.addVisual(chassisBody, 0x0000aa, "car");
    //helper.addVisual(chassisBody, 0x0000aa, "car");

    //Car Visual Body
    var geometry = new THREE.BoxGeometry(200, 60, 400);
    var material = new THREE.MeshBasicMaterial({
      color: "#FFFFFF",
      side: THREE.DoubleSide,
    });
    this.kart = new THREE.Mesh(geometry, material);
    console.log(this.kart);
    this.camera.lookAt(this.kart);
    this.scene.add(this.kart);

    const options = {
      radius: 0.5,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 30,
      suspensionRestLength: 0.8,
      frictionSlip: 1,
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
      maxSuspensionTravel: 0.3,
      customSlidingRotationalSpeed: 30,
      useCustomSlidingRotationalSpeed: true,
    };

    // Create the vehicle
    var vehicle = new CANNON.RaycastVehicle({
      chassisBody: this.chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2,
    });

    options.chassisConnectionPointLocal.set(1, 0, -1);
    vehicle.addWheel(options);

    options.chassisConnectionPointLocal.set(-1, 0, -1);
    vehicle.addWheel(options);

    options.chassisConnectionPointLocal.set(1, 0, 1);
    vehicle.addWheel(options);

    options.chassisConnectionPointLocal.set(-1, 0, 1);
    vehicle.addWheel(options);

    vehicle.addToWorld(this.world);
    var wheelBodies = [],
      wheelVisuals = [];
    var escena = this.scene;
    vehicle.wheelInfos.forEach(function (wheel) {
      const cylinderShape = new CANNON.Cylinder(
        wheel.radius,
        wheel.radius,
        wheel.radius / 2,
        20
      );
      const wheelBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
      const q = new CANNON.Quaternion();
      q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
      wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
      wheelBodies.push(wheelBody);

      var geometry = new THREE.CylinderGeometry(
        wheel.radius,
        wheel.radius,
        0.4,
        32
      );
      var material = new THREE.MeshPhongMaterial({
        color: 0xd0901d,
        emissive: 0xaa0000,
        side: THREE.DoubleSide,
        flatShading: true,
      });

      var cylinder = new THREE.Mesh(geometry, material);
      wheelVisuals.push(cylinder);
      escena.add(cylinder);
      //helper.addVisual(wheelBody, 0x111111, "wheel");
    });

    // Update wheels
    this.world.addEventListener("postStep", function () {
      let index = 0;
      let r;
      vehicle.wheelInfos.forEach(function (wheel) {
        vehicle.updateWheelTransform(index);
        const t = wheel.worldTransform;
        //console.log(wheelBodies);
        wheelBodies[index].position.copy(t.position);
        wheelBodies[index].quaternion.copy(t.quaternion);
        wheelVisuals[index].position.copy(t.position);
        wheelVisuals[index].quaternion.copy(t.quaternion);
        index++;
      });
    });

    let matrix = [];
    let sizeX = 64,
      sizeY = 64;

    for (let i = 0; i < sizeX; i++) {
      matrix.push([]);
      for (let j = 0; j < sizeY; j++) {
        let height =
          Math.cos((i / sizeX) * Math.PI * 5) *
            Math.cos((j / sizeY) * Math.PI * 5) *
            2 +
          2;
        if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeY - 1)
          height = 3;
        matrix[i].push(height);
      }
    }

    const hfShape = new CANNON.Heightfield(matrix, {
      elementSize: 100 / sizeX,
    });
    const hfBody = new CANNON.Body({ mass: 0 });
    hfBody.addShape(hfShape);
    hfBody.position.set(
      (-sizeX * hfShape.elementSize) / 2,
      -4,
      (sizeY * hfShape.elementSize) / 2
    );
    hfBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.world.add(hfBody);
    //helper.addVisual(hfBody, 0x00aa00, "landscape");
  }

  initThree() {
    window.addEventListener("resize", this.onWindowResize, false);
    $("#game").append(this.renderer.domElement);

    var ambientLight = new THREE.AmbientLight("#FFFFFF", 0.3);
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.castShadow = true;
    dirLight.position.x = -1;
    dirLight.position.y = 1;
    dirLight.position.z = 1;

    this.scene.add(dirLight);
    this.scene.add(ambientLight);
    //this.cargaModelos();
    //this.cargaKart();
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.x = THREE.Math.degToRad(-25);

    this.camera.position.z = -300;
    this.camera.position.y = 200;
    this.camera.position.x = 0;
    this.render();
  }

  crearCamara() {
    return new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      30000
    );
  }

  crearEscena() {
    return new THREE.Scene();
  }

  crearRenderer() {
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
  }

  cargaModelos() {
    this.mLoader.load(
      "../../assets/modelos/PistaCircuito/PistaFBX/PistaMapa1.fbx",
      (fbx) => {
        let color = this.tLoader.load(
          "../../assets/modelos/PistaCircuito/PistaTextures/Pista1_Color.png"
        );

        let roughness = this.tLoader.load(
          "../../assets/modelos/PistaCircuito/PistaTextures/Pista1_Roughness.png"
        );

        let texture = new THREE.MeshStandardMaterial({
          map: color,
          roughnessMap: roughness,
        });

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.material = texture;
          }
        });

        fbx.name = "pista";
        fbx.translateX(0);
        fbx.translateY(0);
        fbx.translateZ(0);
        fbx.scale.set(1, 1, 1);
        this.scene.add(fbx);
      },
      undefined,
      (error) => {
        console.log(error);
      }
    );

    this.mLoader.load(
      "../../assets/modelos/PistaCircuito/BarreraFBX/Barreras_N.fbx",
      (fbx) => {
        let color = this.tLoader.load(
          "../../assets/modelos/PistaCircuito/BarreraTextures/Barrera_BaseColor.png"
        );

        let roughness = this.tLoader.load(
          "../../assets/modelos/PistaCircuito/BarreraTextures/Barrera_Roughness.png"
        );

        let texture = new THREE.MeshStandardMaterial({
          map: color,
          roughnessMap: roughness,
        });

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.material = texture;
          }
        });

        fbx.name = "Barreras_N";
        fbx.translateX(0);
        fbx.translateY(0);
        fbx.translateZ(0);
        fbx.scale.set(1, 1, 1);
        this.scene.add(fbx);
      },
      undefined,
      (error) => {
        console.log(error);
      }
    );

    this.mLoader.load(
      "../../assets/modelos/PistaCircuito/BarreraFBX/Barreras_S.fbx",
      (fbx) => {
        let color = this.tLoader.load(
          "../../assets/modelos/PistaCircuito/BarreraTextures/Barrera_BaseColor.png"
        );

        let roughness = this.tLoader.load(
          "../../assets/modelos/PistaCircuito/BarreraTextures/Barrera_Roughness.png"
        );

        let texture = new THREE.MeshStandardMaterial({
          map: color,
          roughnessMap: roughness,
        });

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.material = texture;
          }
        });

        fbx.name = "Barreras_N";
        fbx.translateX(0);
        fbx.translateY(0);
        fbx.translateZ(0);
        fbx.scale.set(1, 1, 1);
        this.scene.add(fbx);
      },
      undefined,
      (error) => {
        console.log(error);
      }
    );

    this.mLoader.load(
      "../../assets/modelos/PistaCircuito/PastoCentralFBX/PastoCentral.fbx",
      (fbx) => {
        let color = this.tLoader.load(
          "../../assets/modelos/PistaCircuito/PastoCentralTextures/PastoCentral_BaseColor.png"
        );

        let texture = new THREE.MeshStandardMaterial({
          map: color,
        });

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.material = texture;
          }
        });

        fbx.name = "PastoCentral";
        fbx.translateX(0);
        fbx.translateY(0);
        fbx.translateZ(0);
        fbx.scale.set(1, 1, 1);
        this.scene.add(fbx);
      },
      undefined,
      (error) => {
        console.log(error);
      }
    );

    this.mLoader.load(
      "../../assets/modelos/PistaCircuito/PastoExteriorFBX/PastoExterior.fbx",
      (fbx) => {
        let color = this.tLoader.load(
          "../../assets/modelos/PistaCircuito/PastoCentralTextures/PastoCentral_BaseColor.png"
        );

        let texture = new THREE.MeshStandardMaterial({
          map: color,
        });

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.material = texture;
          }
        });

        fbx.name = "PastoCentral";
        fbx.translateX(0);
        fbx.translateY(0);
        fbx.translateZ(0);
        fbx.scale.set(1, 1, 1);
        this.scene.add(fbx);
      },
      undefined,
      (error) => {
        console.log(error);
      }
    );
  }

  cargaKart() {
    this.mLoader.load(
      "../../assets/modelos/GoKartTest/GoKartTest.fbx",
      (fbx) => {
        let color = this.tLoader.load(
          "../../assets/modelos/GoKartTest/Kart_BaseColor.png"
        );

        let texture = new THREE.MeshStandardMaterial({
          map: color,
        });

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.material = texture;
          }
        });

        fbx.add(this.camera);
        fbx.name = "Kart";
        //this.kart = fbx;
        this.camera.rotation.y = THREE.Math.degToRad(180);
        fbx.translateX(0);
        fbx.translateY(0);
        fbx.translateZ(0);
        fbx.scale.set(1, 1, 1);
        this.kart = fbx;
        this.scene.add(fbx);
      },
      undefined,
      (error) => {
        console.log(error);
      }
    );
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    //console.log(this.kart);
    //this.updatePhysics(this.world, this.kart, this.dt);
    this.delta = this.clock.getDelta();
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);

    this.kb.keys.forEach((e) => {
      if (e.pressed && e.code == 87) {
        //var kart = this.scene.getObjectByName("Kart");
        //kart.translateX();
        //this.kart.translateZ(100 * this.delta);
      }
      if (e.pressed && e.code == 83) {
        //this.kart.translateZ(-1 * 100 * this.delta);
      }
      if (e.pressed && e.code == 65) {
        //this.kart.translateX(100 * this.delta);
      }
      if (e.pressed && e.code == 68) {
        //this.kart.translateX(-1 * 100 * this.delta);
      }
    });
    if (this.world) {
      this.updatePhysics(this.world, this.kart, this.dt, this.chassisBody);
    }
  }

  updatePhysics(world, kart, dt, chassisBody, chassisShape) {
    //console.log(chassisBody.position);
    world.step(dt);
    // update the chassis position
    var v3 = new THREE.Vector3(
      chassisBody.position.x,
      chassisBody.position.y,
      chassisBody.position.z
    );
    //console.log(kart.position, v3);
    if (v3) {
      kart.position.copy(v3);
      kart.copy(chassisBody.quaternion);
    } else {
      console.log(v3);
    }
  }

  onKeyDown(event) {
    let k = event.keyCode;
    let i = this.kb.keys.findIndex((e) => e.code == k);
    if (i != -1) this.kb.setKey(i, true);
  }
  onKeyUp(event) {
    let k = event.keyCode;
    let i = this.kb.keys.findIndex((e) => e.code == k);
    if (i != -1) this.kb.setKey(i, false);
  }
}

export const InicializaEventos = () => {
  $(window).on("keydown", (e) => {
    var code = e.keyCode || e.which;
    if (code == 38) {
      console.log("arrowUp");
      // var kart = scene.getObjectByName("Kart");
      // kart.translateX();
    }
    if (code == 40) {
      console.log("arrowDown");
    }

    if (code == 37) {
      console.log("arrowLeft");
    }

    if (code == 39) {
      console.log("arrowRight");
    }
  });
};

export { Init };
