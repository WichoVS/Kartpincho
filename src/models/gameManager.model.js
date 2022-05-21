class GameManager {
  molesPositions = [{}];
  world;
  scene;
  sunLight;
  ambientLight;
  cannonDebugRenderer;
  worldStep;
  groundMaterial;
  wheelMaterial;
  jugadores = [];
  gamePadsAsignados = [];
  isKeyboardAsignado = false;
  isGameStarted;
  isAsignandoControles = true;
  ItemsDisponibles = {
    STUN_ITEM: "STUN_ITEM",
    SLOW_ITEM: "SLOW_ITEM",
    DRUNK_ITEM: "DRUNK_ITEM",
  };
  constructor() {
    this.worldStep = 1 / 60;
    this.InitMolePos();
    this.InitThree();
    this.InitCannon();
    this.isGameStarted = false;
  }

  InitMolePos() {
    this.molesPositions = [
      {
        isFree: true,
        pos: {
          x: 33,
          y: 2.5,
          z: -90,
        }
      },
      {
        isFree: true,
        pos: {
          x: 20,
          y: 2.75,
          z: -60,
        }
      },
      {
        isFree: true,
        pos: {
          x: 35,
          y: 2.75,
          z: -10,
        }
      },
      {
        isFree: true,
        pos: {
          x: 11,
          y: 2.75,
          z: -115,
        }
      },
      {
        isFree: true,
        pos: {
          x: 27,
          y: 2.75,
          z: -160,
        }
      },
      {
        isFree: true,
        pos: {
          x: 40,
          y: 2.75,
          z: 6,
        }
      },
      {
        isFree: true,
        pos: {
          x: 50,
          y: 2.75,
          z: -5,
        }
      },
      {
        isFree: true,
        pos: {
          x: 90,
          y: 2.75,
          z: 13,
        }
      },
      {
        isFree: true,
        pos: {
          x: 142,
          y: 2.75,
          z: 27,
        }
      },
      {
        isFree: true,
        pos: {
          x: 140,
          y: 2.75,
          z: -48,
        }
      },
      {
        isFree: true,
        pos: {
          x: 155,
          y: 2.75,
          z: -125,
        }
      },
      {
        isFree: true,
        pos: {
          x: 147,
          y: 2.75,
          z: -165,
        }
      },
      {
        isFree: true,
        pos: {
          x: 130,
          y: 2.75,
          z: -204,
        }
      },
      {
        isFree: true,
        pos: {
          x: 135,
          y: 2.75,
          z: -246,
        }
      },
      {
        isFree: true,
        pos: {
          x: 121,
          y: 2.75,
          z: -270,
        }
      },
      {
        isFree: true,
        pos: {
          x: 71,
          y: 2.75,
          z: -265,
        }
      },
      {
        isFree: true,
        pos: {
          x: 25,
          y: 2.75,
          z: -250,
        }
      },
      {
        isFree: true,
        pos: {
          x: 20,
          y: 2.75,
          z: -200,
        }
      }
    ]
  }

  InitThree() {
    this.scene = this.CrearEscena();
    //$("#game").append(renderer.domElement);
    this.ambientLight = new THREE.AmbientLight(0x404040); // soft white light

    this.sunlight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.sunlight.position.set(-10, 10, 0);
    this.scene.add(this.sunlight);
    this.scene.add(this.ambientLight);
  }

  InitCannon() {
    this.world = new CANNON.World();
    this.cannonDebugRenderer = new THREE.CannonDebugRenderer(
      this.scene,
      this.world
    );
    //this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 5;
    this.world.gravity.set(0, -9.82, 0);
    this.world.defaultContactMaterial.friction = 0;

    this.groundMaterial = new CANNON.Material("groundMaterial");
    this.wheelMaterial = new CANNON.Material("wheelMaterial");
    var wheelGroundContactMaterial = new CANNON.ContactMaterial(
      this.wheelMaterial,
      this.groundMaterial,
      { friction: 0.3, restitution: 0, contactEquationStiffness: 1000 }
    );

    this.world.addContactMaterial(wheelGroundContactMaterial);
  }

  AddJugador(_player) {
    this.jugadores.push(_player);
  }

  AddTerreno() {}

  AddModel() {}

  AddCollider() {}

  CrearEscena() {
    return new THREE.Scene();
  }
}
