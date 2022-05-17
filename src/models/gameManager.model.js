class GameManager {
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
    this.InitThree();
    this.InitCannon();
    this.isGameStarted = false;
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
