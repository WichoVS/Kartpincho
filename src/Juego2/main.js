var partida = {
  Modalidad: "",
  Pista: "",
  Ganador: "",
  Vueltas: 4,
  Bots: false,
  NoBots: 0,
  Jugadores: 2,
  Dificultad: 1,
  VueltaMasRapida: -1,
  Playlist: "",
};

var manager;
//var p1;
var terreno;
//Mapa

var modelos = [];
var colliders = [];

$(() => {
  //Aqui una funcion para cargar los datos necesarios para la partida

  manager = new GameManager();

  var sb = new SkyBox(
    "../../assets/images/skybox/Dia/meadow_ft.jpg",
    "../../assets/images/skybox/Dia/meadow_bk.jpg",
    "../../assets/images/skybox/Dia/meadow_up.jpg",
    "../../assets/images/skybox/Dia/meadow_dn.jpg",
    "../../assets/images/skybox/Dia/meadow_rt.jpg",
    "../../assets/images/skybox/Dia/meadow_lf.jpg"
  );

  var p1 = new Jugador(
    "../../assets/karts/Cuetazo.fbx",
    "../../assets/modelos/GoKartTest/Kart_BaseColor.png",
    "Player1",
    manager.wheelMaterial,
    manager.world,
    150,
    partida.Jugadores,
    new CANNON.Vec3(15, 1, -140)
  );

  var p2 = new Jugador(
    "../../assets/karts/Avocarro.fbx",
    "../../assets/karts/AvocarroTextLite.png",
    "Player2",
    manager.wheelMaterial,
    manager.world,
    150,
    partida.Jugadores,
    new CANNON.Vec3(20, 1, -140)
  );

  manager.scene.add(sb.skyBox);
  manager.AddJugador(p1);
  manager.AddJugador(p2);
  terreno = new Terreno(
    //"../../assets/modelos/PistaNascar/TerrenoPistaNascar.fbx",
    "../../assets/modelos/Pista2/PlanoPistaFaro.fbx",
    "../../assets/modelos/PistaCircuito/PastoCentralTextures/PastoCentral_BaseColor.png",
    new CANNON.Vec3(4000, 4000, 0.01),
    "PastoCentral",
    manager.groundMaterial
  );
  var pista = new Modelo(
    "../../assets/modelos/Pista2/PistaLarga.fbx",
    "../../assets/modelos/Pista2/STREET.png",
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

  /*var arboles = new Modelo(
    "../../assets/modelos/PistaNascar/Arboles.fbx",
    "../../assets/modelos/PistaNascar/Arboles_Color.png",
    undefined,
    "Arboles",
    THREE.FrontSide
  );*/

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

  /*var piedras1 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra1.fbx",
    "../../assets/modelos/PistaNascar/Piedra1_Color.jpg",
    undefined,
    "Piedras1"
  );

  var piedras2 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra2.fbx",
    "../../assets/modelos/PistaNascar/Piedra2_Color.jpg",
    undefined,
    "Piedras2"
  );

  var piedras3 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra3.fbx",
    "../../assets/modelos/PistaNascar/Piedra3_Color.jpg",
    undefined,
    "Piedras3"
  );

  var piedras4 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra4.fbx",
    "../../assets/modelos/PistaNascar/Piedra4_Color.jpg",
    undefined,
    "Piedras4"
  );
  var piedras5 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra5.fbx",
    "../../assets/modelos/PistaNascar/Piedra5_Color.jpg",
    undefined,
    "Piedras5"
  );
  var piedras6 = new Modelo(
    "../../assets/modelos/PistaNascar/Piedra6.fbx",
    "../../assets/modelos/PistaNascar/Piedra6_Color.jpg",
    undefined,
    "Piedras6"
  );*/

 /* modelos.push(piedras1);
  modelos.push(piedras2);
  modelos.push(piedras3);
  modelos.push(piedras4);
  modelos.push(piedras5);
  modelos.push(piedras6);
  modelos.push(arboles);*/
  modelos.push(CajasObs);
  modelos.push(Botes);
  modelos.push(RocasFaro);
  modelos.push(RocasObstaculo);
  modelos.push(pista);
  modelos.push(meta);
  modelos.push(faro);

  //Left
  var c = new Collider(
    new CANNON.Vec3(280, 0, -125),
    new CANNON.Vec3(1, 10, 200),
    manager.world
  );

  //Forward
  /*var c2 = new Collider(
    new CANNON.Vec3(80, 0, 75),
    new CANNON.Vec3(200, 10, 1),
    manager.world
  );*/
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
