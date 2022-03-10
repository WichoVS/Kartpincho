import { KBInputs } from "../Controles/keyboard.js";

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
    "../../assets/modelos/PistaCircuito/PastoCentralFBX/PastoCentral.fbx",
    "../../assets/modelos/PistaCircuito/PastoCentralTextures/PastoCentral_BaseColor.png",
    new CANNON.Vec3(32, 34.5, 0.01),
    "PastoCentral",
    manager.groundMaterial
  );
  var m = new Modelo(
    "../../assets/modelos/PistaCircuito/PastoExteriorFBX/PastoExterior.fbx",
    "../../assets/modelos/PistaCircuito/PastoCentralTextures/PastoCentral_BaseColor.png",
    null,
    "PastoExterior"
  );
  modelos.push(m);
  var c = new Collider(
    new CANNON.Vec3(33, 0, 0),
    new CANNON.Vec3(1, 10, 35),
    manager.world
  );

  var c2 = new Collider(
    new CANNON.Vec3(0, 0, 35),
    new CANNON.Vec3(35, 10, 1),
    manager.world
  );
  var c3 = new Collider(
    new CANNON.Vec3(0, 0, -35),
    new CANNON.Vec3(35, 10, 1),
    manager.world
  );
  var c4 = new Collider(
    new CANNON.Vec3(-33, 1, 0),
    new CANNON.Vec3(5, 10, 35),
    manager.world
  );

  var rampa = new Collider(
    new CANNON.Vec3(5, -0.5, 0),
    new CANNON.Vec3(5, 3, 1),
    manager.world
  );

  rampa.Rota(new CANNON.Vec3(1, 0, 0), 1.74533);

  render();
  //HacerUnaFuncionParaGenerarLosEventos
  $(window).on("keydown", (e) => {
    var code = e.keyCode || e.which;
    if (code == 38) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.applyEngineForce(-p.engineForce, 2);
          p.vehicle.applyEngineForce(-p.engineForce, 3);
        }
      }
    }
    if (code == 40) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.applyEngineForce(p.engineForce, 2);
          p.vehicle.applyEngineForce(p.engineForce, 3);
        }
      }
    }

    if (code == 37) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setSteeringValue(p.maxSteerVal, 2);
          p.vehicle.setSteeringValue(p.maxSteerVal, 3);
        }
      }
    }

    if (code == 39) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setSteeringValue(-p.maxSteerVal, 2);
          p.vehicle.setSteeringValue(-p.maxSteerVal, 3);
        }
      }
    }

    if (code == 32) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setBrake(2, 2);
          p.vehicle.setBrake(2, 3);
        }
      }
    }
  });

  $(window).on("keyup", (e) => {
    var code = e.keyCode || e.which;

    if (code == 38) {
      console.log("arrowUp Up");
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.applyEngineForce(0, 2);
          p.vehicle.applyEngineForce(0, 3);
        }
      }
    }
    if (code == 40) {
      console.log("arrowDown Up");
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.applyEngineForce(0, 2);
          p.vehicle.applyEngineForce(0, 3);
        }
      }
    }

    if (code == 37) {
      console.log("arrowLeft Up");
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setSteeringValue(0, 2);
          p.vehicle.setSteeringValue(0, 3);
        }
      }
    }

    if (code == 39) {
      console.log("arrowRight Up");
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setSteeringValue(0, 2);
          p.vehicle.setSteeringValue(0, 3);
        }
      }
    }

    if (code == 32) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setBrake(0, 2);
          p.vehicle.setBrake(0, 3);
        }
      }
    }
  });
});

const render = () => {
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
