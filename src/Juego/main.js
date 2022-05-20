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
    j.AddTimeCheckp(_manager)
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
      0, 0, 0,
      1/2, 1/2, 1/2
    )

    var shellbody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
      position: new CANNON.Vec3(0,0,0)
    })

    shell.body = shellbody

    shell.body.addEventListener("collide", (e) => {
      if(e.body.userData != undefined) {
        let owner = pManager.jugadores.find(
          (owner) => shell.owner === owner.name
        );

        let player = pManager.jugadores.find(
          (p) => p.name === e.body.userData.name
        );
        
        if(e.body.userData.name != shell.owner) {
            owner.deleteShell()
            var playerDefeated = player.Hit();
            player.isStuned = true;
            player.stunTime = 180;
            if(playerDefeated) {
              owner.kills += 1
              playersLeft -= 1;
            }
            checkPlacements(pManager)
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
  if(mode == "Eliminación") factor = -1000


  var metaTrigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 1, 1)),
  });
  metaTrigger.position.set(20, 0+factor, -127.5);
  metaTrigger.collisionResponse = false;
  var totalCheckpoints = 4;
  metaTrigger.addEventListener("collide", (e) => {
    if(e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );

      if (!player.flagTrigger) {
        player.AddVuelta(totalCheckpoints);
        player.flagTrigger = true;
        player.FlagCollisionReset();
        player.checkpTime -= 1;
        checkPlacements(pManager)
        player.checkpTime = 0;
      }
    }
  });
  pManager.world.add(metaTrigger);

  //#region Inicio Bloque de Código que genera los checkpoints de la Pista

  var triggerChecker4 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 1, 1)),
  });
  triggerChecker4.position.set(20, 0+factor, -200);
  triggerChecker4.collisionResponse = false;
  triggerChecker4.addEventListener("collide", (e) => {
    if(e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );
      if (player.checkpoints === 3) {
        player.checkpoints = 4;
        player.checkpTime -= 1;
        checkPlacements(pManager)
        player.checkpTime = 0;
      }
    }
  });
  pManager.world.add(triggerChecker4);

  var triggerChecker3 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 1, 1)),
  });
  triggerChecker3.position.set(100, 0+factor, -273);
  triggerChecker3.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0, 1, 0),
    THREE.MathUtils.degToRad(90)
  );
  triggerChecker3.collisionResponse = false;
  triggerChecker3.addEventListener("collide", (e) => {
    if(e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );
      if (player.checkpoints === 2) {
        player.checkpoints = 3;
        player.checkpTime -= 1;
        checkPlacements(pManager)
        player.checkpTime = 0;
      }
    }
  });
  pManager.world.add(triggerChecker3);

  var triggerChecker2 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 1, 1)),
  });
  triggerChecker2.position.set(150, 0+factor, -130);
  triggerChecker2.collisionResponse = false;
  triggerChecker2.addEventListener("collide", (e) => {
    if(e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );
      if (player.checkpoints === 1) {
        player.checkpoints = 2;
        player.checkpTime -= 1;
        checkPlacements(pManager)
        player.checkpTime = 0;
      }
    }
  });
  pManager.world.add(triggerChecker2);

  var triggerChecker1 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 1, 1)),
  });
  triggerChecker1.position.set(100, 0+factor, 13);
  triggerChecker1.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0, 1, 0),
    THREE.MathUtils.degToRad(90)
  );
  triggerChecker1.collisionResponse = false;
  triggerChecker1.addEventListener("collide", (e) => {
    if(e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );
      if (player.checkpoints === 0) {
        player.checkpoints = 1;
        player.checkpTime -= 1;
        checkPlacements(pManager)
        player.checkpTime = 0;
      }
    }
  });
  pManager.world.add(triggerChecker1);

  //#endregion Fin del bloque que genera los checkpoints de la pista

  //#region Comienzan triggers de ITEM BLOCKS

  var ITEMS = ["STUN_ITEM", "SLOW_ITEM", "DRUNK_ITEM"]

  var itembox1Trigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  });
  itembox1Trigger.collisionResponse = false
  itembox1Trigger.position.set(20,0,-200)
  itembox1Trigger.addEventListener("collide", (e) => {
    if(e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );

      if(player.item == "NONE") {
        var i = randomIntFromInterval(1,3)-1
        player.item = ITEMS[i]
      }
    }
  });
  pManager.world.add(itembox1Trigger);

  // 2
  var itembox2Trigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  });
  itembox2Trigger.collisionResponse = false
  itembox2Trigger.position.set(100,0,13)
  itembox2Trigger.addEventListener("collide", (e) => {
    
    if(e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );

      if(player.item == "NONE") {
        var i = randomIntFromInterval(1,3)-1
        player.item = ITEMS[i]
      }
    }

    });
  pManager.world.add(itembox2Trigger);

  // 3
  var itembox3Trigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  });
  itembox3Trigger.collisionResponse = false
  itembox3Trigger.position.set(140,0,-130)
  itembox3Trigger.addEventListener("collide", (e) => {
    
    if(e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );

      if(player.item == "NONE") {
        var i = randomIntFromInterval(1,3)-1
        player.item = ITEMS[i]
      }
    }

    });
  pManager.world.add(itembox3Trigger);

  // 4
  var itembox4Trigger = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  });
  itembox4Trigger.collisionResponse = false
  itembox4Trigger.position.set(155,0,-130)
  itembox4Trigger.addEventListener("collide", (e) => {
    
    if(e.body.userData != undefined) {
      let player = pManager.jugadores.find(
        (ele) => ele.name === e.body.userData.name
      );

      if(player.item == "NONE") {
        var i = randomIntFromInterval(1,3)-1
        player.item = ITEMS[i]
      }
    }

    });
  pManager.world.add(itembox4Trigger);

  //#endregion

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

  /* ITEM BOXES */
  var itembox1 = new Modelo(
    "../../assets/modelos/Itembox/itembox.fbx",
    "../../assets/modelos/Itembox/itembox.jpg",
    new CANNON.Vec3(1, 1, 1),
    "Itembox1",
    THREE.DoubleSide,
    20, 0, -200,      // (x, y, z) position
    0, 0, 0  // (x, y, z) scale
  )

  var itembox2 = new Modelo(
    "../../assets/modelos/Itembox/itembox.fbx",
    "../../assets/modelos/Itembox/itembox.jpg",
    new CANNON.Vec3(1, 1, 1),
    "Itembox1",
    THREE.DoubleSide,
    100, 0, 13,      // (x, y, z) position
    1/32, 1/32, 1/32  // (x, y, z) scale
  )

  var itembox3 = new Modelo(
    "../../assets/modelos/Itembox/itembox.fbx",
    "../../assets/modelos/Itembox/itembox.jpg",
    new CANNON.Vec3(1, 1, 1),
    "Itembox1",
    THREE.DoubleSide,
    140, 0, -130,      // (x, y, z) position
    1/32, 1/32, 1/32  // (x, y, z) scale
  )

  var itembox4 = new Modelo(
    "../../assets/modelos/Itembox/itembox.fbx",
    "../../assets/modelos/Itembox/itembox.jpg",
    new CANNON.Vec3(1, 1, 1),
    "Itembox1",
    THREE.DoubleSide,
    155, 0, -130,      // (x, y, z) position
    1/32, 1/32, 1/32  // (x, y, z) scale
  )

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
  if (partida.Pista == "624544f2558f73e5aa3d340f") LoadMapaNascar(manager);
};

const getGameMode = (manager) => {
  if(partida.Modalidad == "62453ce32e269b0dd8e45c89") mode = "Circuito"
  if(partida.Modalidad == "62453d552e269b0dd8e45c8c") {
    mode = "Eliminación"
    playersLeft = partida.Jugadores;
  }
}

const LoadMapaNascar = (manager) => {
  loadCollidersNascar(manager);
  loadTriggersNascar(manager);
  loadModelosNascar();
};

const LoadMapaMar = () => {};

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function checkPlacements(_pManager) {

  if(mode == "Eliminación") {
    //#region Placements Elimination
      var playersResults = [{}];
    _pManager.jugadores.forEach((player) => {
      playersResults.push({name:`${player.name}`, lives:`${player.lives}`, kills:`${player.kills}`})
    });

    playersResults.sort(function(a, b) {

      if(a.lives > b.lives) {
        return -2
      }
  
      if(a.lives < b.lives) {
        return 2
      }
  
      if(a.lives == b.lives) {
        if(a.kills > b.kills) {
          return -1
        }
  
        if(a.kills < b.kills) {
          return 1
        }
  
        if(a.kills == b.kills) {
          return 0
        }
      }
  
    })

    playersResults.forEach((playerRacing, i) => {
      if(playerRacing.name != undefined) {
        let thisPlayer = _pManager.jugadores.find(
          (player) => player.name === playerRacing.name
        );
        thisPlayer.placement = i
      }
    })

    if(playersLeft == 1) {
      let winner = _pManager.jugadores.find(
        (winner) => winner.isGameOver === false
      );
        // Si se encuentra, hay un ganador!
      if(winner != undefined && !winnerFound) {
        winnerFound = true;
        winner.isGameOver = true;
        $("body").append(`<div id="controllerSetup2" class="div-controller-setup"><div/>`)

        $("#controllerSetup2").append(`<h2 class='h2-controller-setup'>EL GANADOR ES: ${winner.name}</h2>`)
        $("#controllerSetup2").append(`<h4 class="h4-controller-setup">Felicidades\n Puntuación ${winner.kills} kills</h4>`)
        $("#controllerSetup2").append(`<h4 class="h4-controller-setup">Vidas Restantes ${winner.lives} ♥</h4>`)
        $("#controllerSetup2").append(`<div class="div-players-controller-setup">
                                        <div id="player1ControllerSetup" class="div-card-player-controller"></div>
    
                                        <div id="player2ControllerSetup" class="div-card-player-controller">
                                          <img id="p2ImgAsign" class="img-player-controller-setup" src="${winner.Imagen}" alt="">
                                          <label id="p2LabelName" class="label-player-controller-setup" for="">${winner.name}</label>
                                        </div>
                                        
                                        <div id="player4ControllerSetup" class="div-card-player-controller"></div>
                                      </div>`)
        $("#controllerSetup2").append(`<div> <button id="btnWinReturn" class="button-win-return" onclick="goToMainMenu();">Menú Principal</button> </div>`)
    
        console.log("El ganador es: " + winner.name)

      } else if(winner == undefined) {
        console.log("Ha ocurrido un error...")
      }
    }

    //#endregion
  }

  if(mode == "Circuito") {
  //#region Placements Race
  var playersResults = [{}];
  _pManager.jugadores.forEach((player) => {
    playersResults.push({name:`${player.name}`, laps:`${player.vueltas}`, checkpoints:`${player.checkpoints}`, checkpTime:`${player.checkpTime}`})
  });

  playersResults.sort(function(a, b) {

    if(a.laps > b.laps) {
      return -3
    }

    if(a.laps < b.laps) {
      return 3
    }

    if(a.laps == b.laps) {
      if(a.checkpoints > b.checkpoints) {
        return -2
      }

      if(a.checkpoints < b.checkpoints) {
        return 2
      }

      if(a.checkpoints == b.checkpoints) {
        if(a.checkpTime < b.checkpTime) {
          return -1
        }

        if(a.checkpTime > b.checkpTime) {
          return 1
        }

        if(a.checkpTime == b.checkpTime) {
          return 0
        }
      }
    }

  })

  playersResults.forEach((playerRacing, i) => {
    if(playerRacing.name != undefined) {
      let thisPlayer = _pManager.jugadores.find(
        (player) => player.name === playerRacing.name
      );
      thisPlayer.placement = i
    }
  })


  let winner = _pManager.jugadores.find(
    (winner) => winner.vueltas === partida.Vueltas
  );
    // Si se encuentra, hay un ganador!
  if(winner != undefined) {
    _pManager.jugadores.forEach((player) => {
      player.GameOver()
    });

    $("body").append(`<div id="controllerSetup2" class="div-controller-setup"><div/>`)

    $("#controllerSetup2").append(`<h2 class='h2-controller-setup'>EL GANADOR ES: ${winner.name}</h2>`)
    $("#controllerSetup2").append(`<h4 class="h4-controller-setup">Felicidades\nMejor tiempo ${winner.fastestTime}</h4>`)
    $("#controllerSetup2").append(`<div class="div-players-controller-setup">
                                    <div id="player1ControllerSetup" class="div-card-player-controller"></div>

                                    <div id="player2ControllerSetup" class="div-card-player-controller">
                                      <img id="p2ImgAsign" class="img-player-controller-setup" src="${winner.Imagen}" alt="">
                                      <label id="p2LabelName" class="label-player-controller-setup" for="">${winner.name}</label>
                                    </div>
                                    
                                    <div id="player4ControllerSetup" class="div-card-player-controller"></div>
                                  </div>`)
    $("#controllerSetup2").append(`<div> <button id="btnWinReturn" class="button-win-return" onclick="goToMainMenu();">Menú Principal</button> </div>`)

    console.log("El ganador es: " + winner.name)
  }
  //#endregion
  }
}

function goToMainMenu() {
  window.location.href = "../MenuInicio/Inicio.html";
}