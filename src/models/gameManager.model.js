class GameManager {
  world;
  scene;
  sunLight;
  cannonDebugRenderer;
  worldStep;
  groundMaterial;
  wheelMaterial;
  jugadores = [];
  constructor() {
    this.worldStep = 1 / 60;
    this.InitThree();
    this.InitCannon();
  }

  InitThree() {
    this.scene = this.CrearEscena();
    //$("#game").append(renderer.domElement);
    this.sunlight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.sunlight.position.set(-10, 10, 0);
    this.scene.add(this.sunlight);
  }

  InitCannon() {
    this.world = new CANNON.World();
    this.cannonDebugRenderer = new THREE.CannonDebugRenderer(
      this.scene,
      this.world
    );
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
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