var partida = {};
var jugadoresData = {};
var countDownLabels = 3;

const JUGADORESGPO = 2;
const TRIGGERGPO = 4;

var controlesAsignados = 0;
var Moles = []

var manager;
var terreno;
var mode;
var playersLeft;
var winnerFound = false;

var rendererAerea;
var cameraAerea;

var modelos = [];
var colliders = [];
var worldLoaded = false;

const TimerTiempos = (_manager) => {
  _manager.jugadores.forEach((j) => {
    j.AddTimeVuelta(_manager);
    j.AddTimeCheckp(_manager);
  });
  setTimeout(TimerTiempos, 100, _manager);
};

const AsignaControles = () => {};

// Donde se Cargan los datos de la partida se cargan los jugadores y se almacenan en la variable jugadoresData
const LoadPlayers = (pManager) => {
  var arrayTypeKarts = [];
  jugadoresData.forEach((j, i) => {
    var shell = new Modelo(
      "../../assets/modelos/items/untitled.fbx",
      "../../assets/modelos/items/Shell.png",
      undefined,
      `${j.Nombre}Shell`,
      THREE.DoubleSide,
      0,
      0,
      0,
      1 / 2,
      1 / 2,
      1 / 2
    );

    var shellbody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
      position: new CANNON.Vec3(0, 0, 0),
    });

    shell.body = shellbody;

    shell.body.addEventListener("collide", (e) => {
      if (e.body.userData != undefined) {
        let owner = pManager.jugadores.find(
          (owner) => shell.owner === owner.name
        );

        let player = pManager.jugadores.find(
          (p) => p.name === e.body.userData.name
        );

        if (e.body.userData.name != shell.owner) {
          owner.deleteShell();
          var playerDefeated = player.Hit();
          player.isStuned = true;
          player.stunTime = 180;
          if (playerDefeated) {
            owner.kills += 1;
            playersLeft -= 1;
          }
          checkPlacements(pManager);
        }
      }
    });

    var p = new Jugador(
      j.Modelo,
      j.Modelo.replace("fbx", "png"),
      j.Nombre,
      pManager.wheelMaterial,
      pManager.world,
      150,
      partida.Jugadores,
      new CANNON.Vec3(15 + (i % 2) * 5, 1, -140 - (i % 2) * 5),
      j.Imagen,
      manager,
      shell,
      mode
    );

    $(`#player${i + 1}ControllerSetup`).removeClass("display-none");

    arrayTypeKarts.push(p);

    //#region Moles
    var sc = 0.25

    var mole1 = new Mole(
      "../../assets/modelos/Mole/mole.fbx",
      "../../assets/modelos/Mole/mole.png",
      undefined,
      "Mole1",
      THREE.DoubleSide,
      -20, 2.75, 100,       // (x, y, z) position
      sc, sc, sc            // (x, y, z) scale
    )
    var mole1body = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
      position: new CANNON.Vec3(-20, 2.75, 100)
    })
    mole1.body = mole1body

    if(!mole1.isListed) {
      Moles.push(mole1)
      mole1.isListed = true
    }

    //#endregion

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
  getGameMode();
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

    Moles.forEach((mole) => {
      mole.UpdateMole();
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

    Moles.forEach((mole) => {
      if (mole.isLoaded) {
        mole.isLoaded = false
        mole.body.position.set = new CANNON.Vec3(0,2.75,0)

        manager.scene.add(mole.mesh);
        manager.world.add(mole.body);
        mole.worldReady = true;
      }
    })

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
  var factor = 0;
  if (mode == "Eliminación") factor = -1000;

  var metaTrigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 1, 1)),
  });
  metaTrigger.position.set(20, 0 + factor, -127.5);
  metaTrigger.collisionResponse = false;
  var totalCheckpoints = 4;
  metaTrigger.addEventListener("collide", (e) => {
    if (e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );

      if (!player.flagTrigger) {
        player.AddVuelta(totalCheckpoints);
        player.flagTrigger = true;
        player.FlagCollisionReset();
        player.checkpTime -= 1;
        checkPlacements(pManager);
        player.checkpTime = 0;
      }
    }
  });
  pManager.world.add(metaTrigger);

  //#region Inicio Bloque de Código que genera los checkpoints de la Pista

  var triggerChecker4 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 1, 1)),
  });
  triggerChecker4.position.set(20, 0 + factor, -200);
  triggerChecker4.collisionResponse = false;
  triggerChecker4.addEventListener("collide", (e) => {
    if (e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );
      if (player.checkpoints === 3) {
        player.checkpoints = 4;
        player.checkpTime -= 1;
        checkPlacements(pManager);
        player.checkpTime = 0;
      }
    }
  });
  pManager.world.add(triggerChecker4);

  var triggerChecker3 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 1, 1)),
  });
  triggerChecker3.position.set(100, 0 + factor, -273);
  triggerChecker3.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0, 1, 0),
    THREE.MathUtils.degToRad(90)
  );
  triggerChecker3.collisionResponse = false;
  triggerChecker3.addEventListener("collide", (e) => {
    if (e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );
      if (player.checkpoints === 2) {
        player.checkpoints = 3;
        player.checkpTime -= 1;
        checkPlacements(pManager);
        player.checkpTime = 0;
      }
    }
  });
  pManager.world.add(triggerChecker3);

  var triggerChecker2 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 1, 1)),
  });
  triggerChecker2.position.set(150, 0 + factor, -130);
  triggerChecker2.collisionResponse = false;
  triggerChecker2.addEventListener("collide", (e) => {
    if (e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );
      if (player.checkpoints === 1) {
        player.checkpoints = 2;
        player.checkpTime -= 1;
        checkPlacements(pManager);
        player.checkpTime = 0;
      }
    }
  });
  pManager.world.add(triggerChecker2);

  var triggerChecker1 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 1, 1)),
  });
  triggerChecker1.position.set(100, 0 + factor, 13);
  triggerChecker1.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0, 1, 0),
    THREE.MathUtils.degToRad(90)
  );
  triggerChecker1.collisionResponse = false;
  triggerChecker1.addEventListener("collide", (e) => {
    if (e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );
      if (player.checkpoints === 0) {
        player.checkpoints = 1;
        player.checkpTime -= 1;
        checkPlacements(pManager);
        player.checkpTime = 0;
      }
    }
  });
  pManager.world.add(triggerChecker1);

  //#endregion Fin del bloque que genera los checkpoints de la pista

  //#region Comienzan triggers de ITEM BLOCKS

  var ITEMS = ["STUN_ITEM", "SLOW_ITEM", "DRUNK_ITEM"];

  var itembox1Trigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  });
  itembox1Trigger.collisionResponse = false;
  itembox1Trigger.position.set(20, 0, -200);
  itembox1Trigger.addEventListener("collide", (e) => {
    if (e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );

      if (player.item == "NONE") {
        var i = randomIntFromInterval(1, 3) - 1;
        player.item = ITEMS[i];
      }
    }
  });
  pManager.world.add(itembox1Trigger);

  // 2
  var itembox2Trigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  });
  itembox2Trigger.collisionResponse = false;
  itembox2Trigger.position.set(100, 0, 13);
  itembox2Trigger.addEventListener("collide", (e) => {
    if (e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );

      if (player.item == "NONE") {
        var i = randomIntFromInterval(1, 3) - 1;
        player.item = ITEMS[i];
      }
    }
  });
  pManager.world.add(itembox2Trigger);

  // 3
  var itembox3Trigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  });
  itembox3Trigger.collisionResponse = false;
  itembox3Trigger.position.set(140, 0, -130);
  itembox3Trigger.addEventListener("collide", (e) => {
    if (e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );

      if (player.item == "NONE") {
        var i = randomIntFromInterval(1, 3) - 1;
        player.item = ITEMS[i];
      }
    }
  });
  pManager.world.add(itembox3Trigger);

  // 4
  var itembox4Trigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  });
  itembox4Trigger.collisionResponse = false;
  itembox4Trigger.position.set(155, 0, -130);
  itembox4Trigger.addEventListener("collide", (e) => {
    if (e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );

      if (player.item == "NONE") {
        var i = randomIntFromInterval(1, 3) - 1;
        player.item = ITEMS[i];
      }
    }
  });
  pManager.world.add(itembox4Trigger);

  //#endregion
};

const loadModelosNascar = () => {
  terreno = new Terreno(
    "../../assets/modelos/PistaNascar/TerrenoPistaNascar.fbx",
    "../../assets/modelos/PistaCircuito/PastoCentralTextures/PastoCentral_BaseColor.png",
    new CANNON.Vec3(400, 400, 0.01),
    "PastoCentral",
    manager.groundMaterial
  );

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

  /* ITEM BOXES */
  var itembox1 = new Modelo(
    "../../assets/modelos/Itembox/itembox.fbx",
    "../../assets/modelos/Itembox/itembox.jpg",
    new CANNON.Vec3(1, 1, 1),
    "Itembox1",
    THREE.DoubleSide,
    20,
    0,
    -200, // (x, y, z) position
    1 / 32,
    1 / 32,
    1 / 32 // (x, y, z) scale
  );

  var itembox2 = new Modelo(
    "../../assets/modelos/Itembox/itembox.fbx",
    "../../assets/modelos/Itembox/itembox.jpg",
    new CANNON.Vec3(1, 1, 1),
    "Itembox1",
    THREE.DoubleSide,
    100,
    0,
    13, // (x, y, z) position
    1 / 32,
    1 / 32,
    1 / 32 // (x, y, z) scale
  );

  var itembox3 = new Modelo(
    "../../assets/modelos/Itembox/itembox.fbx",
    "../../assets/modelos/Itembox/itembox.jpg",
    new CANNON.Vec3(1, 1, 1),
    "Itembox1",
    THREE.DoubleSide,
    140,
    0,
    -130, // (x, y, z) position
    1 / 32,
    1 / 32,
    1 / 32 // (x, y, z) scale
  );

  var itembox4 = new Modelo(
    "../../assets/modelos/Itembox/itembox.fbx",
    "../../assets/modelos/Itembox/itembox.jpg",
    new CANNON.Vec3(1, 1, 1),
    "Itembox1",
    THREE.DoubleSide,
    155,
    0,
    -130, // (x, y, z) position
    1 / 32,
    1 / 32,
    1 / 32 // (x, y, z) scale
  );

  modelos.push(piedras1);
  modelos.push(piedras2);
  modelos.push(piedras3);
  modelos.push(piedras4);
  modelos.push(piedras5);
  modelos.push(piedras6);

  modelos.push(itembox1);
  modelos.push(itembox2);
  modelos.push(itembox3);
  modelos.push(itembox4);

  modelos.push(arboles);
  modelos.push(pista);
  modelos.push(meta);
};

const LoadMap = (manager) => {
  if (partida.Pista == "624544f2558f73e5aa3d340f") {
    LoadMapaNascar(manager);
  } else {
    console.log(partida.Pista);
    LoadMapaMar(manager);
  }
};

const getGameMode = (manager) => {
  if (partida.Modalidad == "62453ce32e269b0dd8e45c89") mode = "Circuito";
  if (partida.Modalidad == "62453d552e269b0dd8e45c8c") {
    mode = "Eliminación";
    playersLeft = partida.Jugadores;
  }
};

const LoadMapaNascar = (manager) => {
  loadCollidersNascar(manager);
  loadTriggersNascar(manager);
  loadModelosNascar();
};

const LoadMapaMar = (manager) => {
  loadCollidersMar(manager);
  loadTriggersMar(manager);
  loadModelosMar();
};

const loadCollidersMar = (manager) => {
  /////////////////////////////////////
  ///////////Limites Mapa//////////////
  /////////////////////////////////////

  //Left
  var c = new Collider(
    new CANNON.Vec3(100, 0, -125),
    new CANNON.Vec3(1, 10, 200),
    manager.world
  );

  //Forward
  var c2 = new Collider(
    new CANNON.Vec3(80, 0, 160),
    new CANNON.Vec3(200, 10, 1),
    manager.world
  );

  //Behind
  var c3 = new Collider(
    new CANNON.Vec3(80, 0, -325),
    new CANNON.Vec3(200, 10, 1),
    manager.world
  );

  //Right
  var c4 = new Collider(
    new CANNON.Vec3(-120, 0, -125),
    new CANNON.Vec3(1, 10, 200),
    manager.world
  );

  /////////////////////////////////////
  ///////////Colliders Pista///////////
  /////////////////////////////////////

  var c5 = new Collider(
    new CANNON.Vec3(-43, 0, -10),
    new CANNON.Vec3(1, 10, 80),
    manager.world
  );

  var c6 = new Collider(
    new CANNON.Vec3(-54, 0, -19),
    new CANNON.Vec3(1, 10, 68),
    manager.world
  );

  var c7 = new Collider(
    new CANNON.Vec3(-18, 0, 45),
    new CANNON.Vec3(1, 10, 44),
    manager.world
  );

  var c8 = new Collider(
    new CANNON.Vec3(-29, 0, 45),
    new CANNON.Vec3(1, 10, 55),
    manager.world
  );

  var c9 = new Collider(
    new CANNON.Vec3(-10, 0, 115),
    new CANNON.Vec3(40, 10, 1),
    manager.world
  );
  var c10 = new Collider(
    new CANNON.Vec3(-5, 0, 104.5),
    new CANNON.Vec3(42, 10, 1),
    manager.world
  );

  var c11 = new Collider(
    new CANNON.Vec3(-67, 0, 82),
    new CANNON.Vec3(1, 10, 25),
    manager.world
  );

  var c11 = new Collider(
    new CANNON.Vec3(-55.8, 0, 81),
    new CANNON.Vec3(1, 10, 14.8),
    manager.world
  );

  var c12 = new Collider(
    new CANNON.Vec3(7, 0, 100),
    new CANNON.Vec3(37, 10, 1),
    manager.world
  );

  var c13 = new Collider(
    new CANNON.Vec3(9, 0, 89),
    new CANNON.Vec3(28, 10, 1),
    manager.world
  );

  var c14 = new Collider(
    new CANNON.Vec3(33.5, 0, -92),
    new CANNON.Vec3(1, 10, 27),
    manager.world
  );

  var c15 = new Collider(
    new CANNON.Vec3(44, 0, -93),
    new CANNON.Vec3(1, 10, 32),
    manager.world
  );

  var c16 = new Collider(
    new CANNON.Vec3(-47.5, 0, -115),
    new CANNON.Vec3(1, 10, 20),
    manager.world
  );

  var c17 = new Collider(
    new CANNON.Vec3(-58.5, 0, -115),
    new CANNON.Vec3(1, 10, 25),
    manager.world
  );

  var c18 = new Collider(
    new CANNON.Vec3(85.2, 0, 108),
    new CANNON.Vec3(1, 10, 7),
    manager.world
  );

  var c19 = new Collider(
    new CANNON.Vec3(96.2, 0, 108),
    new CANNON.Vec3(1, 10, 11),
    manager.world
  );

  var c20 = new Collider(
    new CANNON.Vec3(65.5, 0, 95.5),
    new CANNON.Vec3(13.5, 10, 1),
    manager.world
  );

  var c21 = new Collider(
    new CANNON.Vec3(65.5, 0, 84.5),
    new CANNON.Vec3(18, 10, 1),
    manager.world
  );

  var c22 = new Collider(
    new CANNON.Vec3(-15.3, 0, -156),
    new CANNON.Vec3(11.1, 10, 1),
    manager.world
  );

  var c23a = new Collider(
    new CANNON.Vec3(-15.3, 0, -167),
    new CANNON.Vec3(15.5, 10, 1),
    manager.world
  );

  var c23b = new Collider(
    new CANNON.Vec3(65.5, 0, 139),
    new CANNON.Vec3(11, 10, 1),
    manager.world
  );
  var c23c = new Collider(
    new CANNON.Vec3(65.5, 0, 127.9),
    new CANNON.Vec3(7, 10, 1),
    manager.world
  );
  //////////////girados/////////////
  var c24 = new Collider(
    new CANNON.Vec3(13.5, 0, -30.2),
    new CANNON.Vec3(1, 10, 44.5),
    manager.world
  );
  c24.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-45));
  var c25 = new Collider(
    new CANNON.Vec3(2, 0, -34),
    new CANNON.Vec3(1, 10, 45),
    manager.world
  );
  c25.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-45));
  var c26 = new Collider(
    new CANNON.Vec3(82.5, 0, 98.5),
    new CANNON.Vec3(4, 10, 1),
    manager.world
  );
  c26.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-45));
  var c27 = new Collider(
    new CANNON.Vec3(90, 0, 91),
    new CANNON.Vec3(8, 10, 1),
    manager.world
  );
  c27.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-45));

  var c28 = new Collider(
    new CANNON.Vec3(46.7, 0, 98),
    new CANNON.Vec3(6, 10, 1),
    manager.world
  );
  c28.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(24));
  var c29 = new Collider(
    new CANNON.Vec3(45, 0, 85.7),
    new CANNON.Vec3(8, 10, 1),
    manager.world
  );
  c29.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(24));

  var c30 = new Collider(
    new CANNON.Vec3(15, 0, -137),
    new CANNON.Vec3(26, 10, 1),
    manager.world
  );
  c30.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-45));
  var c31 = new Collider(
    new CANNON.Vec3(-4, 0, -155),
    new CANNON.Vec3(1, 10, 1),
    manager.world
  );
  c31.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(45));
  var c32 = new Collider(
    new CANNON.Vec3(20, 0, -147.5),
    new CANNON.Vec3(40, 10, 1),
    manager.world
  );
  c32.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-45));

  var c33 = new Collider(
    new CANNON.Vec3(-44.2, 0, -91.8),
    new CANNON.Vec3(5, 10, 1),
    manager.world
  );
  c33.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-45));
  var c34 = new Collider(
    new CANNON.Vec3(-57.3, 0, -89),
    new CANNON.Vec3(5, 10, 1),
    manager.world
  );
  c34.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-45));

  var c35 = new Collider(
    new CANNON.Vec3(-57.3, 0, 108.7),
    new CANNON.Vec3(20, 10, 1),
    manager.world
  );
  c35.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-42));
  var c36 = new Collider(
    new CANNON.Vec3(-51.1, 0, 100),
    new CANNON.Vec3(6.8, 10, 1),
    manager.world
  );
  c36.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-45));

  var c37 = new Collider(
    new CANNON.Vec3(-48, 0, 58.5),
    new CANNON.Vec3(11.4, 10, 1),
    manager.world
  );
  c37.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(45));
  var c38 = new Collider(
    new CANNON.Vec3(-60, 0, 54.6),
    new CANNON.Vec3(8.9, 10, 1),
    manager.world
  );
  c38.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(45));

  var c39 = new Collider(
    new CANNON.Vec3(43, 0, 127.8),
    new CANNON.Vec3(18.8, 10, 1),
    manager.world
  );
  c39.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-44));
  var c40 = new Collider(
    new CANNON.Vec3(45, 0, 114.5),
    new CANNON.Vec3(19.7, 10, 1),
    manager.world
  );
  c40.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-44));

  var c41 = new Collider(
    new CANNON.Vec3(85, 0, 130),
    new CANNON.Vec3(15, 10, 1),
    manager.world
  );
  c41.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(45));
  var c42 = new Collider(
    new CANNON.Vec3(78.5, 0, 121.5),
    new CANNON.Vec3(9.5, 10, 1),
    manager.world
  );
  c42.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(45));

  var c43 = new Collider(
    new CANNON.Vec3(-37.2, 0, -144.9),
    new CANNON.Vec3(15, 10, 1),
    manager.world
  );
  c43.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(45));
  var c44 = new Collider(
    new CANNON.Vec3(-34, 0, -148),
    new CANNON.Vec3(11.5, 10, 1),
    manager.world
  );
  c44.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(45));
  var c45 = new Collider(
    new CANNON.Vec3(-43, 0, -154.5),
    new CANNON.Vec3(25, 10, 1),
    manager.world
  );
  c45.Rota(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(45));
  /////////////////////////////////////
  //////////////Obstaculos/////////////
  /////////////////////////////////////

  var c23 = new Collider(
    new CANNON.Vec3(-24.5, 0, 107),
    new CANNON.Vec3(1, 10, 1),
    manager.world
  );
  var c23 = new Collider(
    new CANNON.Vec3(-9.8, 0, 112.8),
    new CANNON.Vec3(1, 10, 1),
    manager.world
  );
  var c23 = new Collider(
    new CANNON.Vec3(1.5, 0, 108.2),
    new CANNON.Vec3(1, 10, 1),
    manager.world
  );
  var c23 = new Collider(
    new CANNON.Vec3(22.3, 0, 113.8),
    new CANNON.Vec3(1, 10, 1),
    manager.world
  );
  var c23 = new Collider(
    new CANNON.Vec3(-7, 0, 97.3),
    new CANNON.Vec3(1, 10, 1),
    manager.world
  );
  var c23 = new Collider(
    new CANNON.Vec3(38.5, 0, 92),
    new CANNON.Vec3(1, 10, 1),
    manager.world
  );
  var c23 = new Collider(
    new CANNON.Vec3(-28.7, 0, 63.5),
    new CANNON.Vec3(1, 10, 1),
    manager.world
  );
  var c23 = new Collider(
    new CANNON.Vec3(-27.3, 0, 37),
    new CANNON.Vec3(1, 10, 1),
    manager.world
  );
  var c23 = new Collider(
    new CANNON.Vec3(-19.5, 0, 16),
    new CANNON.Vec3(1, 10, 1),
    manager.world
  );

  /////////////////////////////////////
  ///////////////RAMPAS////////////////
  /////////////////////////////////////

  var rampa0 = new Collider(
    new CANNON.Vec3(-48, -1, -2),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );
  rampa0.Rota(new CANNON.Vec3(1, 0, 0), 1.0472);

  var rampa1 = new Collider(
    new CANNON.Vec3(-48, -1, 21.5),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );
  rampa1.Rota(new CANNON.Vec3(1, 0, 0), 1.0472);

  var rampa2 = new Collider(
    new CANNON.Vec3(-61.5, -1, 78.5),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );
  rampa2.Rota(new CANNON.Vec3(1, 0, 0), 1.0472);

  var rampa3 = new Collider(
    new CANNON.Vec3(-2 /*-50*/, -1, -22),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );

  var rampa4 = new Collider(
    new CANNON.Vec3(18 /*-50*/, -1, -42),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );

  var rampa5 = new Collider(
    new CANNON.Vec3(30 /*-50*/, -1, -55),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );

  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  var quatZ = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), THREE.Math.degToRad(-45));
  quatY.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), THREE.Math.degToRad(45));
  quatZ.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), THREE.Math.degToRad(35));
  var quaternion = quatY.mult(quatX.mult(quatZ));
  quaternion.normalize();
  rampa5.body.quaternion.copy(quaternion);
  rampa4.body.quaternion.copy(quaternion);
  rampa3.body.quaternion.copy(quaternion);

  var rampa5 = new Collider(
    new CANNON.Vec3(38 /*-50*/, -1, -92),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );
  rampa5.Rota(new CANNON.Vec3(1, 0, 0), -1.0472);

  var rampa6 = new Collider(
    new CANNON.Vec3(-53, -1, -107),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );
  rampa6.Rota(new CANNON.Vec3(1, 0, 0), 1.0472);
};
const loadTriggersMar = (manager) => {};
const loadModelosMar = () => {
  terreno = new Terreno(
    //"../../assets/modelos/PistaNascar/TerrenoPistaNascar.fbx",
    "../../assets/modelos/Pista2/PlanoPistaFaro.fbx",
    "../../assets/modelos/PistaCircuito/PastoCentralTextures/PastoCentral_BaseColor.png",
    new CANNON.Vec3(4000, 4000, 0.01),
    "PastoCentral",
    manager.groundMaterial
  );

  var pista = new Modelo(
    "../../assets/modelos/Pista2/PistaLarga3.fbx",
    "../../assets/modelos/Pista2/STREET2.png",
    new CANNON.Vec3(0, 0, 0),
    "PistaAsfalto",
    THREE.FrontSide
  );

  var faro = new Modelo(
    "../../assets/modelos/Pista2/Faro.fbx",
    "../../assets/modelos/Pista2/Faro.png",
    undefined,
    "Faro",
    THREE.FrontSide
  );

  var agua = new Modelo(
    "../../assets/modelos/Pista2/Agua.fbx",
    "../../assets/modelos/Pista2/Agua.png",
    undefined,
    "Faro",
    THREE.FrontSide
  );

  var meta = new Modelo(
    "../../assets/modelos/Pista2/Meta.fbx",
    "../../assets/modelos/Pista2/Meta.png",
    undefined,
    "Meta",
    THREE.DoubleSide
  );

  var RocasFaro = new Modelo(
    "../../assets/modelos/Pista2/RocasFaro.fbx",
    "../../assets/modelos/PistaNascar/Piedra1_Color.jpg",
    undefined,
    "Piedras"
  );

  var RocasObstaculo = new Modelo(
    "../../assets/modelos/Pista2/RocasObstaculos.fbx",
    "../../assets/modelos/PistaNascar/Piedra1_Color.jpg",
    undefined,
    "Piedras2"
  );

  var CajasObs = new Modelo(
    "../../assets/modelos/Pista2/CajasObstaculos.fbx",
    "../../assets/modelos/PistaNascar/Piedra1_Color.jpg",
    undefined,
    "Cajas"
  );

  var Botes = new Modelo(
    "../../assets/modelos/Pista2/Botes.fbx",
    "../../assets/modelos/PistaNascar/Piedra1_Color.jpg",
    undefined,
    "BotesCarga"
  );

  var Rampas = new Modelo(
    "../../assets/modelos/Pista2/Rampas.fbx",
    "../../assets/modelos/PistaNascar/Piedra1_Color.jpg",
    undefined,
    "Rampita"
  );

  modelos.push(pista);
  modelos.push(faro);
  modelos.push(meta);
  modelos.push(agua);
  modelos.push(RocasFaro);
  modelos.push(RocasObstaculo);
  modelos.push(CajasObs);
  modelos.push(Botes);
  modelos.push(Rampas);
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkPlacements(_pManager) {
  if (mode == "Eliminación") {
    //#region Placements Elimination
    var playersResults = [{}];
    _pManager.jugadores.forEach((player) => {
      playersResults.push({
        name: `${player.name}`,
        lives: `${player.lives}`,
        kills: `${player.kills}`,
      });
    });

    playersResults.sort(function (a, b) {
      if (a.lives > b.lives) {
        return -2;
      }

      if (a.lives < b.lives) {
        return 2;
      }

      if (a.lives == b.lives) {
        if (a.kills > b.kills) {
          return -1;
        }

        if (a.kills < b.kills) {
          return 1;
        }

        if (a.kills == b.kills) {
          return 0;
        }
      }
    });

    playersResults.forEach((playerRacing, i) => {
      if (playerRacing.name != undefined) {
        let thisPlayer = _pManager.jugadores.find(
          (player) => player.name === playerRacing.name
        );
        thisPlayer.placement = i;
      }
    });

    if (playersLeft == 1) {
      let winner = _pManager.jugadores.find(
        (winner) => winner.isGameOver === false
      );
      // Si se encuentra, hay un ganador!
      if (winner != undefined && !winnerFound) {
        winnerFound = true;
        winner.isGameOver = true;
        $("body").append(
          `<div id="controllerSetup2" class="div-controller-setup"><div/>`
        );

        $("#controllerSetup2").append(
          `<h2 class='h2-controller-setup'>EL GANADOR ES: ${winner.name}</h2>`
        );
        $("#controllerSetup2").append(
          `<h4 class="h4-controller-setup">Felicidades\n Puntuación ${winner.kills} kills</h4>`
        );
        $("#controllerSetup2").append(
          `<h4 class="h4-controller-setup">Vidas Restantes ${winner.lives} ♥</h4>`
        );
        $("#controllerSetup2")
          .append(`<div class="div-players-controller-setup">
                                        <div id="player1ControllerSetup" class="div-card-player-controller"></div>
    
                                        <div id="player2ControllerSetup" class="div-card-player-controller">
                                          <img id="p2ImgAsign" class="img-player-controller-setup" src="${winner.Imagen}" alt="">
                                          <label id="p2LabelName" class="label-player-controller-setup" for="">${winner.name}</label>
                                        </div>
                                        
                                        <div id="player4ControllerSetup" class="div-card-player-controller"></div>
                                      </div>`);
        $("#controllerSetup2").append(
          `<div> <button id="btnWinReturn" class="button-win-return" onclick="goToMainMenu();">Menú Principal</button> </div>`
        );

        console.log("El ganador es: " + winner.name);
      } else if (winner == undefined) {
        console.log("Ha ocurrido un error...");
      }
    }

    //#endregion
  }

  if (mode == "Circuito") {
    //#region Placements Race
    var playersResults = [{}];
    _pManager.jugadores.forEach((player) => {
      playersResults.push({
        name: `${player.name}`,
        laps: `${player.vueltas}`,
        checkpoints: `${player.checkpoints}`,
        checkpTime: `${player.checkpTime}`,
      });
    });

    playersResults.sort(function (a, b) {
      if (a.laps > b.laps) {
        return -3;
      }

      if (a.laps < b.laps) {
        return 3;
      }

      if (a.laps == b.laps) {
        if (a.checkpoints > b.checkpoints) {
          return -2;
        }

        if (a.checkpoints < b.checkpoints) {
          return 2;
        }

        if (a.checkpoints == b.checkpoints) {
          if (a.checkpTime < b.checkpTime) {
            return -1;
          }

          if (a.checkpTime > b.checkpTime) {
            return 1;
          }

          if (a.checkpTime == b.checkpTime) {
            return 0;
          }
        }
      }
    });

    playersResults.forEach((playerRacing, i) => {
      if (playerRacing.name != undefined) {
        let thisPlayer = _pManager.jugadores.find(
          (player) => player.name === playerRacing.name
        );
        thisPlayer.placement = i;
      }
    });

    let winner = _pManager.jugadores.find(
      (winner) => winner.vueltas === partida.Vueltas
    );
    // Si se encuentra, hay un ganador!
    if (winner != undefined) {
      _pManager.jugadores.forEach((player) => {
        player.GameOver();
      });

      $("body").append(
        `<div id="controllerSetup2" class="div-controller-setup"><div/>`
      );

      $("#controllerSetup2").append(
        `<h2 class='h2-controller-setup'>EL GANADOR ES: ${winner.name}</h2>`
      );
      $("#controllerSetup2").append(
        `<h4 class="h4-controller-setup">Felicidades\nMejor tiempo ${winner.fastestTime}</h4>`
      );
      $("#controllerSetup2").append(`<div class="div-players-controller-setup">
                                    <div id="player1ControllerSetup" class="div-card-player-controller"></div>

                                    <div id="player2ControllerSetup" class="div-card-player-controller">
                                      <img id="p2ImgAsign" class="img-player-controller-setup" src="${winner.Imagen}" alt="">
                                      <label id="p2LabelName" class="label-player-controller-setup" for="">${winner.name}</label>
                                    </div>
                                    
                                    <div id="player4ControllerSetup" class="div-card-player-controller"></div>
                                  </div>`);
      $("#controllerSetup2").append(
        `<div> <button id="btnWinReturn" class="button-win-return" onclick="goToMainMenu();">Menú Principal</button> </div>`
      );

      console.log("El ganador es: " + winner.name);
    }
    //#endregion
  }
}

function goToMainMenu() {
  window.location.href = "../MenuInicio/Inicio.html";
}
