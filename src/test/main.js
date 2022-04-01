var manager;
//var p1;
var terreno;
//Mapa

var modelos = [];
var colliders = [];

$(() => {
  manager = new GameManager();
  var p1 = new Jugador(
    "../../assets/modelos/GoKartTest/GoKartTest.fbx",
    "../../assets/modelos/GoKartTest/Kart_BaseColor.png",
    "Player1",
    manager.wheelMaterial,
    manager.world,
    150
  );
  manager.AddJugador(p1);
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
    "PistaAsfalto"
  );

  modelos.push(pista);

  //Left
  var c = new Collider(
    new CANNON.Vec3(280, 0, -125),
    new CANNON.Vec3(1, 10, 200),
    manager.world
  );

  //Forward
  var c2 = new Collider(
    new CANNON.Vec3(80, 0, 75),
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
    new CANNON.Vec3(5, 10, 200),
    manager.world
  );

  var rampa = new Collider(
    new CANNON.Vec3(5, -0.5, 0),
    new CANNON.Vec3(5, 3, 1),
    manager.world
  );

  rampa.Rota(new CANNON.Vec3(1, 0, 0), 1.74533);

  InicializaEventos(manager);
  render();
  //HacerUnaFuncionParaGenerarLosEventos
});

const render = () => {
  GamepadsEvent(manager);
  var countPlayers = 0;
  if (manager) {
    requestAnimationFrame(render);
    manager.jugadores.forEach((e) => {
      e.renderer.render(manager.scene, e.camera);
    });
    manager.cannonDebugRenderer.update();
    if (terreno.isLoaded) {
      terreno.isLoaded = false;
      manager.scene.add(terreno.mesh);
      manager.world.add(terreno.body);
    }

    manager.jugadores.forEach((e) => {
      if (e.isLoaded) {
        e.isLoaded = false;
        e.loaded = true;
        manager.scene.add(e.mesh);
        e.wheelsVisual.forEach((w) => {
          manager.scene.add(w);
        });
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
      }
    });
  }
};

//Cada Kart tendrá su propio metodo
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
