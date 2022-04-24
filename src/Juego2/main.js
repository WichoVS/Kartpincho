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
    new CANNON.Vec3(-5/*-50*/, 1, 80/*-75*/)
  );

  var p2 = new Jugador(
    "../../assets/karts/Avocarro.fbx",
    "../../assets/karts/AvocarroTextLite.png",
    "Player2",
    manager.wheelMaterial,
    manager.world,
    150,
    partida.Jugadores,
    new CANNON.Vec3(-46, 1, -75)
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
  modelos.push(agua);
  modelos.push(Rampas);

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
  
  

  //c4.Rota(new CANNON.Vec3(0, 1, 0), 1);


    ///Colliders Pista///

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
      new CANNON.Vec3(40, 10, 1),
      manager.world
    );
    
    var c11 = new Collider(
      new CANNON.Vec3(-67, 0, 82),
      new CANNON.Vec3(1, 10, 25),
      manager.world
    );

    var c11 = new Collider(
      new CANNON.Vec3(-55.8, 0, 81),
      new CANNON.Vec3(1, 10, 14.5),
      manager.world
    );

    var c12 = new Collider(
      new CANNON.Vec3(7, 0, 100),
      new CANNON.Vec3(35, 10, 1),
      manager.world
    );

    var c13 = new Collider(
      new CANNON.Vec3(9, 0, 89),
      new CANNON.Vec3(28, 10, 1),
      manager.world
    );
    
    //////////RAMPAS///////////

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
    new CANNON.Vec3(-2/*-50*/, -1, -22),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );

  var rampa4 = new Collider(
    new CANNON.Vec3(18/*-50*/, -1, -42),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );

  var rampa5 = new Collider(
    new CANNON.Vec3(30/*-50*/, -1, -55),
    new CANNON.Vec3(5, 1, 1),
    manager.world
  );

  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  var quatZ = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(0,1,0),THREE.Math.degToRad(-45));
  quatY.setFromAxisAngle(new CANNON.Vec3(1,0,0),THREE.Math.degToRad(45));
  quatZ.setFromAxisAngle(new CANNON.Vec3(0,0,1),THREE.Math.degToRad(35));
  var quaternion = quatY.mult(quatX.mult(quatZ));
  quaternion.normalize();
  rampa5.body.quaternion.copy(quaternion);
  rampa4.body.quaternion.copy(quaternion);
  rampa3.body.quaternion.copy(quaternion);

  
  //var ramp4 = rampa4//.Rota(new CANNON.Vec3(0, 1, 0), -1.0472);
  //ramp4.Rota(new CANNON.Vec3(1, 0, 0), -1.0472);
  //rampa4.Rota(new CANNON.Vec3(1, 0, 0), -1.0472);


  var rampa5 = new Collider(
    new CANNON.Vec3(38/*-50*/, -1, -92),
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
