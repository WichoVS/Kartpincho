var gamepads = navigator.getGamepads();

window.addEventListener("gamepadconnected", (event) => {
  console.log("A gamepad connected:");
  gamepads = navigator.getGamepads();
  console.log(gamepads);
  console.log(event.gamepad);
});

window.addEventListener("gamepaddisconnected", (event) => {
  console.log("A gamepad disconnected:");
  console.log(event.gamepad);
});

const CheckModelsLoaded = (pModelos, pJugadores, pTerreno) => {
  let checkerModelos = false;
  let checkerJugadores = false;
  let checkerTerrain = false;

  checkerModelos = !pModelos.some((e) => e.worldReady === false);
  checkerJugadores = !pJugadores.some((e) => e.worldReady === false);
  checkerTerrain = pTerreno.worldReady;
  if (checkerModelos && checkerJugadores && checkerTerrain) {
    $("#div-loading").addClass("loaded");
    $("#div-loading").removeClass("loading");
  }

  return checkerModelos && checkerJugadores && checkerTerrain;
};

const InicializaEventos = (manager) => {
  gamepads = navigator.getGamepads();
  $(window).on("keydown", (e) => {
    var code = e.keyCode || e.which;
    if (code == 38 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.applyEngineForce(-p.engineForce, 2);
          p.vehicle.applyEngineForce(-p.engineForce, 3);
        }
      }
    }
    if (code == 40 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.applyEngineForce(p.engineForce, 2);
          p.vehicle.applyEngineForce(p.engineForce, 3);
        }
      }
    }

    if (code == 37 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setSteeringValue(p.maxSteerVal, 2);
          p.vehicle.setSteeringValue(p.maxSteerVal, 3);
        }
      }
    }

    if (code == 39 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setSteeringValue(-p.maxSteerVal, 2);
          p.vehicle.setSteeringValue(-p.maxSteerVal, 3);
        }
      }
    }

    if (code == 32 && worldLoaded && manager.isGameStarted) {
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

    if (code == 38 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.applyEngineForce(0, 2);
          p.vehicle.applyEngineForce(0, 3);
        }
      }
    }
    if (code == 40 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.applyEngineForce(0, 2);
          p.vehicle.applyEngineForce(0, 3);
        }
      }
    }

    if (code == 37 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setSteeringValue(0, 2);
          p.vehicle.setSteeringValue(0, 3);
        }
      }
    }

    if (code == 39 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setSteeringValue(0, 2);
          p.vehicle.setSteeringValue(0, 3);
        }
      }
    }

    if (code == 32 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let p = manager.jugadores[0];
        if (p.loaded) {
          p.vehicle.setBrake(0, 2);
          p.vehicle.setBrake(0, 3);
        }
      }
    }
  });
};

const GamepadsEvent = (_manager) => {
  gamepads = navigator.getGamepads();
  gamepads.forEach((c) => {
    if (c !== null) {
      if (c.axes[0] > 0.1 || c.axes[0] < -0.1) {
        let p = _manager.jugadores[1];
        if (p.loaded) {
          p.vehicle.setSteeringValue(-p.maxSteerVal * c.axes[0], 2);
          p.vehicle.setSteeringValue(-p.maxSteerVal * c.axes[0], 3);
        }
      } else {
        let p = _manager.jugadores[1];
        if (p.loaded) {
          p.vehicle.setSteeringValue(-p.maxSteerVal * 0, 2);
          p.vehicle.setSteeringValue(-p.maxSteerVal * 0, 3);
        }
      }

      c.buttons.forEach((b, i) => {
        let p = _manager.jugadores[1];
        if (p.loaded) {
          if (b.pressed) {
            if (i == 7) {
              p.vehicle.applyEngineForce(-p.engineForce * b.value, 2);
              p.vehicle.applyEngineForce(-p.engineForce * b.value, 3);
            }
            if (i == 6) {
              p.vehicle.applyEngineForce(p.engineForce * b.value, 2);
              p.vehicle.applyEngineForce(p.engineForce * b.value, 3);
            }
            if (i == 1) {
              p.vehicle.setBrake(2, 2);
              p.vehicle.setBrake(2, 3);
            }
          } else {
            //Reseteamos todos los eventos (Mejorar la lógica de los botónes luego).
            if (i == 7 && !c.buttons[6].pressed) {
              p.vehicle.applyEngineForce(0, 2);
              p.vehicle.applyEngineForce(0, 3);
            }
            if (i == 1) {
              p.vehicle.setBrake(0, 2);
              p.vehicle.setBrake(0, 3);
            }
          }
        }
      });
    }
  });
};
