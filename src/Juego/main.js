var partida = {};
var jugadoresData = {};
var countDownLabels = 3;

const JUGADORESGPO = 2;
const TRIGGERGPO = 4;

var controlesAsignados = 0;

var manager;
var terreno;

var rendererAerea;
var cameraAerea;

var modelos = [];
var colliders = [];
var worldLoaded = false;

const TimerTiempos = (_manager) => {
  _manager.jugadores.forEach((j) => {
    j.AddTimeVuelta(_manager);
  });
  setTimeout(TimerTiempos, 100, _manager);
};

const AsignaControles = () => {};

// Donde se Cargan los datos de la partida se cargan los jugadores y se almacenan en la variable jugadoresData
const LoadPlayers = (pManager) => {
  var arrayTypeKarts = [];
  jugadoresData.forEach((j, i) => {
    var p = new Jugador(
      j.Modelo,
      j.Modelo.replace("fbx", "png"),
      j.Nombre,
      pManager.wheelMaterial,
      pManager.world,
      150,
      partida.Jugadores,
      new CANNON.Vec3(15 + (i % 2) * 5, 1, -140 - (i % 2) * 5),
      j.Imagen
    );

    $(`#player${i + 1}ControllerSetup`).removeClass("display-none");

    arrayTypeKarts.push(p);
  });

  arrayTypeKarts.forEach((j) => {
    pManager.AddJugador(j);
  });
};

const CamaraParaAcomodarColliders = (pManager) => {
  cameraAerea = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    30000
  );

  cameraAerea.position.x = 80;
  cameraAerea.position.y = 200;
  cameraAerea.position.z = -100;

  cameraAerea.rotation.x = THREE.MathUtils.degToRad(-90);

  rendererAerea = new THREE.WebGLRenderer();
  rendererAerea.setSize(window.innerWidth, window.innerHeight);
  $(document.body).append(rendererAerea.domElement);

  pManager.scene.add(cameraAerea);
};

$(async () => {
  //Aqui una funcion para cargar los datos necesarios para la partida
  await GetPartida();
  manager = new GameManager();
  LoadPlayers(manager);

  var sb = new SkyBox(
    "../../assets/images/skybox/Dia/meadow_ft.jpg",
    "../../assets/images/skybox/Dia/meadow_bk.jpg",
    "../../assets/images/skybox/Dia/meadow_up.jpg",
    "../../assets/images/skybox/Dia/meadow_dn.jpg",
    "../../assets/images/skybox/Dia/meadow_rt.jpg",
    "../../assets/images/skybox/Dia/meadow_lf.jpg"
  );
  manager.scene.add(sb.skyBox);

  terreno = new Terreno(
    "../../assets/modelos/PistaNascar/TerrenoPistaNascar.fbx",
    "../../assets/modelos/PistaCircuito/PastoCentralTextures/PastoCentral_BaseColor.png",
    new CANNON.Vec3(400, 400, 0.01),
    "PastoCentral",
    manager.groundMaterial
  );
  LoadMap(manager);

  setTimeout(TimerTiempos, 100, manager);

  InicializaEventos(manager);
  render();
});

const render = () => {
  GamepadsEvent(manager);
  var countPlayers = 0;
  if (manager) {
    //rendererAerea.render(manager.scene, cameraAerea);
    manager.jugadores.forEach((e) => {
      e.renderer.render(manager.scene, e.camera);
      e.UpdateUIPlayer();
    });
    manager.cannonDebugRenderer.update();
    if (terreno.isLoaded) {
      terreno.isLoaded = false;
      manager.scene.add(terreno.mesh);
      manager.world.add(terreno.body);
      terreno.worldReady = true;
    }

    manager.jugadores.forEach((e) => {
      if (e.isLoaded) {
        e.isLoaded = false;
        e.loaded = true;
        manager.scene.add(e.mesh);
        e.wheelsVisual.forEach((w) => {
          manager.scene.add(w);
        });
        e.worldReady = true;
        countPlayers++;
      } else if (e.loaded) {
        countPlayers++;
      }
    });
    if (countPlayers > 0) updatePhysics();
    modelos.forEach((m) => {
      if (m.isLoaded) {
        manager.scene.add(m.mesh);
        if (m.body !== undefined && m.body !== null) manager.world.add(m.body);
        m.isLoaded = false;
        m.worldReady = true;
      }
    });
  }

  if (!worldLoaded) {
    worldLoaded = CheckModelsLoaded(modelos, manager.jugadores, terreno);
  }
  requestAnimationFrame(render);
};

//Cada Kart tendrá su propio metodo o tal vez no
const updatePhysics = () => {
  manager.world.step(manager.worldStep);
  // update the chassis position
  manager.jugadores.forEach((j) => {
    if (j.loaded) {
      j.mesh.position.copy(j.vehicle.chassisBody.position);
      j.mesh.quaternion.copy(j.vehicle.chassisBody.quaternion);
    }
  });
};

const loadCollidersNascar = (pManager) => {
  //Left
  var c = new Collider(
    new CANNON.Vec3(170, 0, -125),
    new CANNON.Vec3(1, 10, 200),
    pManager.world
  );

  //Forward
  var c2 = new Collider(
    new CANNON.Vec3(80, 0, 50),
    new CANNON.Vec3(200, 10, 1),
    pManager.world
  );
  //Behind
  var c3 = new Collider(
    new CANNON.Vec3(80, 0, -300),
    new CANNON.Vec3(200, 10, 1),
    pManager.world
  );

  //Right
  var c4 = new Collider(
    new CANNON.Vec3(-20, 0, -125),
    new CANNON.Vec3(5, 10, 200),
    pManager.world
  );

  //inner collider right
  var iCR = new Collider(
    new CANNON.Vec3(41, 0, -125),
    new CANNON.Vec3(5, 10, 50),
    pManager.world
  );

  //inner collider left
  var iCL = new Collider(
    new CANNON.Vec3(125, 0, -125),
    new CANNON.Vec3(5, 10, 50),
    pManager.world
  );

  var iCL1 = new Collider(
    new CANNON.Vec3(120, 0, -195),
    new CANNON.Vec3(5, 10, 25),
    pManager.world
  );
  iCL1.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(8));

  var iCL2 = new Collider(
    new CANNON.Vec3(115, 0, -220),
    new CANNON.Vec3(5, 10, 10),
    pManager.world
  );
  iCL2.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(25));
  //innerColliderVuelta
  var iCV1 = new Collider(
    new CANNON.Vec3(110, 0, -230),
    new CANNON.Vec3(5, 10, 5),
    pManager.world
  );
  iCV1.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(40));

  var iCV2 = new Collider(
    new CANNON.Vec3(103, 0, -234),
    new CANNON.Vec3(5, 10, 7),
    pManager.world
  );
  iCV2.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(75));

  var iCV3 = new Collider(
    new CANNON.Vec3(95, 0, -235),
    new CANNON.Vec3(5, 10, 5),
    pManager.world
  );
  iCV3.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(80));

  var iCV4 = new Collider(
    new CANNON.Vec3(79, 0, -233),
    new CANNON.Vec3(5, 10, 15),
    pManager.world
  );
  iCV4.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(100));

  var iCV5 = new Collider(
    new CANNON.Vec3(58, 0, -223),
    new CANNON.Vec3(5, 10, 15),
    pManager.world
  );
  iCV5.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(130));

  var iCR1 = new Collider(
    new CANNON.Vec3(45, 0, -190),
    new CANNON.Vec3(5, 10, 25),
    pManager.world
  );
  iCR1.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(-10));

  var iCR2 = new Collider(
    new CANNON.Vec3(47, 0, -60),
    new CANNON.Vec3(5, 10, 20),
    pManager.world
  );
  iCR2.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(10));

  var iCV6 = new Collider(
    new CANNON.Vec3(55, 0, -40),
    new CANNON.Vec3(5, 10, 15),
    pManager.world
  );
  iCV6.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(30));

  var iCV7 = new Collider(
    new CANNON.Vec3(65, 0, -26),
    new CANNON.Vec3(5, 10, 5),
    pManager.world
  );
  iCV7.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(60));

  var iCV7 = new Collider(
    new CANNON.Vec3(78, 0, -25),
    new CANNON.Vec3(5, 10, 15),
    pManager.world
  );
  iCV7.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(90));

  var iCV8 = new Collider(
    new CANNON.Vec3(104, 0, -35),
    new CANNON.Vec3(5, 10, 18),
    pManager.world
  );
  iCV8.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(-55));

  var iCL3 = new Collider(
    new CANNON.Vec3(120, 0, -60),
    new CANNON.Vec3(5, 10, 20),
    pManager.world
  );
  iCL3.Rota(new CANNON.Vec3(0, 1, 0), THREE.MathUtils.degToRad(-10));
};

const loadTriggersNascar = (pManager) => {
  var metaTrigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(16, 1, 1)),
  });
  metaTrigger.position.set(20, 0, -127.5);
  metaTrigger.collisionResponse = false;
  var totalCheckpoints = 4;
  metaTrigger.addEventListener("collide", (e) => {
    let player = pManager.jugadores.find(
      (ele) => ele.name === e.body.userData.name
    );

    if (!player.flagTrigger) {
      player.AddVuelta(totalCheckpoints);
      player.flagTrigger = true;
      player.FlagCollisionReset();
    }
  });
  pManager.world.add(metaTrigger);

  /* Inicio Bloque de Código que genera los checkpoints de la Pista*/

  var triggerChecker4 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(16, 1, 1)),
  });
  triggerChecker4.position.set(20, 0, -200);
  triggerChecker4.collisionResponse = false;
  triggerChecker4.addEventListener("collide", (e) => {
    let player = pManager.jugadores.find(
      (ele) => ele.name === e.body.userData.name
    );
    if (player.checkpoints === 3) player.checkpoints = 4;
    console.log(player.checkpoints);
  });
  pManager.world.add(triggerChecker4);

  var triggerChecker3 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(16, 1, 1)),
  });
  triggerChecker3.position.set(100, 0, -273);
  triggerChecker3.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0, 1, 0),
    THREE.MathUtils.degToRad(90)
  );
  triggerChecker3.collisionResponse = false;
  triggerChecker3.addEventListener("collide", (e) => {
    let player = pManager.jugadores.find(
      (ele) => ele.name === e.body.userData.name
    );
    if (player.checkpoints === 2) player.checkpoints = 3;
    console.log(player.checkpoints);
  });
  pManager.world.add(triggerChecker3);

  var triggerChecker2 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(16, 1, 1)),
  });
  triggerChecker2.position.set(150, 0, -130);
  triggerChecker2.collisionResponse = false;
  triggerChecker2.addEventListener("collide", (e) => {
    let player = pManager.jugadores.find(
      (ele) => ele.name === e.body.userData.name
    );
    if (player.checkpoints === 1) player.checkpoints = 2;
    console.log(player.checkpoints);
  });
  pManager.world.add(triggerChecker2);

  var triggerChecker1 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(16, 1, 1)),
  });
  triggerChecker1.position.set(100, 0, 13);
  triggerChecker1.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0, 1, 0),
    THREE.MathUtils.degToRad(90)
  );
  triggerChecker1.collisionResponse = false;
  triggerChecker1.addEventListener("collide", (e) => {
    let player = pManager.jugadores.find(
      (ele) => ele.name === e.body.userData.name
    );
    if (player.checkpoints === 0) player.checkpoints = 1;
    console.log(player.checkpoints);
  });
  pManager.world.add(triggerChecker1);

  /* Fin Bloque de Código que genera los checkpoints de la Pista*/
};

const loadModelosNascar = () => {
  var pista = new Modelo(
    "../../assets/modelos/PistaNascar/PistaNascar.fbx",
    "../../assets/modelos/PistaNascar/Pista_Color.png",
    new CANNON.Vec3(0, 0, 0),
    "PistaAsfalto",
    THREE.FrontSide
  );

  var arboles = new Modelo(
    "../../assets/modelos/PistaNascar/Arboles.fbx",
    "../../assets/modelos/PistaNascar/Arboles_Color.png",
    undefined,
    "Arboles",
    THREE.FrontSide
  );

  var meta = new Modelo(
    "../../assets/modelos/PistaNascar/Meta.fbx",
    "../../assets/modelos/PistaNascar/Meta_Color.png",
    undefined,
    "Meta",
    THREE.DoubleSide
  );

  var piedras1 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra1.fbx",
    "../../assets/modelos/PistaNascar/Piedra1_Color.jpg",
    undefined,
    "Piedras1",
    THREE.FrontSide
  );

  var piedras2 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra2.fbx",
    "../../assets/modelos/PistaNascar/Piedra2_Color.jpg",
    undefined,
    "Piedras2",
    THREE.FrontSide
  );

  var piedras3 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra3.fbx",
    "../../assets/modelos/PistaNascar/Piedra3_Color.jpg",
    undefined,
    "Piedras3",
    THREE.FrontSide
  );

  var piedras4 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra4.fbx",
    "../../assets/modelos/PistaNascar/Piedra4_Color.jpg",
    undefined,
    "Piedras4",
    THREE.FrontSide
  );
  var piedras5 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra5.fbx",
    "../../assets/modelos/PistaNascar/Piedra5_Color.jpg",
    undefined,
    "Piedras5",
    THREE.FrontSide
  );
  var piedras6 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra6.fbx",
    "../../assets/modelos/PistaNascar/Piedra6_Color.jpg",
    undefined,
    "Piedras6",
    THREE.FrontSide
  );

  modelos.push(piedras1);
  modelos.push(piedras2);
  modelos.push(piedras3);
  modelos.push(piedras4);
  modelos.push(piedras5);
  modelos.push(piedras6);
  modelos.push(arboles);
  modelos.push(pista);
  modelos.push(meta);
};

const LoadMap = (manager) => {
  if (partida.Pista == "624544f2558f73e5aa3d340f") LoadMapaNascar(manager);
};

const LoadMapaNascar = (manager) => {
  loadCollidersNascar(manager);
  loadTriggersNascar(manager);
  loadModelosNascar();
};

const LoadMapaMar = () => {};
