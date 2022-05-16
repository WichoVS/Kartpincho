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
  $("#btnRetry").on("click", () => {});
  $("#btnStart").on("click", () => {
    $("#controllerSetup").addClass("display-none");
    CountDown(manager);
  });

  gamepads = navigator.getGamepads();
  $(window).on("keydown", (e) => {
    if (!manager.isGameStarted) {
      var code = e.keyCode || e.which;
      if (code == 32 && worldLoaded) {
        if (manager.isAsignandoControles) {
          var contador = 0;
          manager.jugadores.forEach((j, i) => {
            if (j.isKeyboardControl !== false || j.controllerIndex !== -1)
              contador++;
          });
          if (contador <= 3) {
            if (!manager.isKeyboardAsignado) {
              manager.jugadores[contador].isKeyboardControl = true;
              manager.isKeyboardAsignado = true;
              $(`#p${contador + 2}LabelPressBtn`).removeClass("display-none");
              $(`#p${contador + 1}LabelPressBtn`).addClass("display-none");
            }
          }
          contador = 0;
        }
      }
    }

    var code = e.keyCode || e.which;
    if (code == 38 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let playerController = -1;
        manager.jugadores.forEach((j, i) => {
          if (j.isKeyboardControl) {
            playerController = i;
          }
        });
        console.log(playerController);
        let p = manager.jugadores[playerController];
        console.log(p);
        if (p.loaded) {
          p.vehicle.applyEngineForce(-p.engineForce, 2);
          p.vehicle.applyEngineForce(-p.engineForce, 3);
        }
      }
    }
    if (code == 40 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let playerController = -1;
        manager.jugadores.forEach((j, i) => {
          if (j.isKeyboardControl) {
            playerController = i;
          }
        });
        let p = manager.jugadores[playerController];
        if (p.loaded) {
          p.vehicle.applyEngineForce(p.engineForce, 2);
          p.vehicle.applyEngineForce(p.engineForce, 3);
        }
      }
    }

    if (code == 37 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let playerController = -1;
        manager.jugadores.forEach((j, i) => {
          if (j.isKeyboardControl) {
            playerController = i;
          }
        });
        let p = manager.jugadores[playerController];
        if (p.loaded) {
          p.vehicle.setSteeringValue(p.maxSteerVal, 2);
          p.vehicle.setSteeringValue(p.maxSteerVal, 3);
        }
      }
    }

    if (code == 39 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let playerController = -1;
        manager.jugadores.forEach((j, i) => {
          if (j.isKeyboardControl) {
            playerController = i;
          }
        });
        let p = manager.jugadores[playerController];
        if (p.loaded) {
          p.vehicle.setSteeringValue(-p.maxSteerVal, 2);
          p.vehicle.setSteeringValue(-p.maxSteerVal, 3);
        }
      }
    }

    if (code == 32 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let playerController = -1;
        manager.jugadores.forEach((j, i) => {
          if (j.isKeyboardControl) {
            playerController = i;
          }
        });
        let p = manager.jugadores[playerController];
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
        let playerController = -1;
        manager.jugadores.forEach((j, i) => {
          if (j.isKeyboardControl) {
            playerController = i;
          }
        });
        let p = manager.jugadores[playerController];
        if (p.loaded) {
          p.vehicle.applyEngineForce(0, 2);
          p.vehicle.applyEngineForce(0, 3);
        }
      }
    }
    if (code == 40 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let playerController = -1;
        manager.jugadores.forEach((j, i) => {
          if (j.isKeyboardControl) {
            playerController = i;
          }
        });
        let p = manager.jugadores[playerController];
        if (p.loaded) {
          p.vehicle.applyEngineForce(0, 2);
          p.vehicle.applyEngineForce(0, 3);
        }
      }
    }

    if (code == 37 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let playerController = -1;
        manager.jugadores.forEach((j, i) => {
          if (j.isKeyboardControl) {
            playerController = i;
          }
        });
        let p = manager.jugadores[playerController];
        if (p.loaded) {
          p.vehicle.setSteeringValue(0, 2);
          p.vehicle.setSteeringValue(0, 3);
        }
      }
    }

    if (code == 39 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let playerController = -1;
        manager.jugadores.forEach((j, i) => {
          if (j.isKeyboardControl) {
            playerController = i;
          }
        });
        let p = manager.jugadores[playerController];
        if (p.loaded) {
          p.vehicle.setSteeringValue(0, 2);
          p.vehicle.setSteeringValue(0, 3);
        }
      }
    }

    if (code == 32 && worldLoaded && manager.isGameStarted) {
      if (manager.jugadores.length > 0) {
        let playerController = -1;
        manager.jugadores.forEach((j, i) => {
          if (j.isKeyboardControl) {
            playerController = i;
          }
        });
        let p = manager.jugadores[playerController];
        if (p.loaded) {
          p.vehicle.setBrake(0, 2);
          p.vehicle.setBrake(0, 3);
        }
      }
    }
  });

  //Aqui se carga la data del modal
  //Y se empiezan a asignar los controles
  if (manager.isAsignandoControles) {
    let contador = 0;
    manager.jugadores.forEach((j, i) => {
      if (j.isKeyboardControl !== false || j.controllerIndex !== -1) contador++;
      $(`#p${i + 1}ImgAsign`).attr("src", j.imagen);
      $(`#p${i + 1}LabelName`).text(j.name);
    });

    $(`#p${contador + 1}LabelPressBtn`).removeClass("display-none");
  }
};

const GamepadsEvent = (_manager) => {
  gamepads = navigator.getGamepads();
  gamepads.forEach((c) => {
    if (c != null) {
      var playerController = 0;
      if (!_manager.isAsignandoControles)
        _manager.jugadores.forEach((j, i) => {
          if (j.controllerIndex !== -1) {
            if (c.index === j.controllerIndex) {
              playerController = i;
            }
          }
        });

      if (c.axes[0] > 0.1 || c.axes[0] < -0.1) {
        let p = _manager.jugadores[playerController];
        if (p.loaded) {
          p.vehicle.setSteeringValue(-p.maxSteerVal * c.axes[0], 2);
          p.vehicle.setSteeringValue(-p.maxSteerVal * c.axes[0], 3);
        }
      } else {
        let p = _manager.jugadores[playerController];
        if (p.loaded) {
          p.vehicle.setSteeringValue(-p.maxSteerVal * 0, 2);
          p.vehicle.setSteeringValue(-p.maxSteerVal * 0, 3);
        }
      }

      c.buttons.forEach((b, i) => {
        let p = _manager.jugadores[playerController];
        if (p.loaded) {
          if (b.pressed) {
            if (i == 7 && _manager.isGameStarted) {
              p.vehicle.applyEngineForce(-p.engineForce * b.value, 2);
              p.vehicle.applyEngineForce(-p.engineForce * b.value, 3);
            }
            if (i == 6 && _manager.isGameStarted) {
              p.vehicle.applyEngineForce(p.engineForce * b.value, 2);
              p.vehicle.applyEngineForce(p.engineForce * b.value, 3);
            }
            if (i == 1 && _manager.isGameStarted) {
              p.vehicle.setBrake(2, 2);
              p.vehicle.setBrake(2, 3);
            }
            if (i == 0) {
              if (_manager.isAsignandoControles) {
                var contador = 0;
                _manager.jugadores.forEach((j, i) => {
                  if (j.isKeyboardControl !== false || j.controllerIndex !== -1)
                    contador++;
                });
                if (contador <= 3) {
                  var isAsignado = false;
                  _manager.gamePadsAsignados.forEach((gP) => {
                    if (c.index == gP) isAsignado = true;
                  });
                  if (!isAsignado) {
                    _manager.jugadores[contador].controllerIndex = c.index;
                    _manager.gamePadsAsignados.push(c.index);
                    $(`#p${contador + 2}LabelPressBtn`).removeClass(
                      "display-none"
                    );
                    $(`#p${contador + 1}LabelPressBtn`).addClass(
                      "display-none"
                    );
                  }
                }
                contador = 0;
                console.log(_manager.jugadores);
              }
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

const CountDown = (manager) => {
  $("#divCountdown").removeClass("display-none");
  switch (countDownLabels) {
    case 3:
      $("#countDownH1").text("3");
      break;
    case 2:
      $("#countDownH1").text("2");
      break;
    case 1:
      $("#countDownH1").text("1");
      break;
    case 0:
      $("#countDownH1").text("YA!");
      break;
  }

  if (countDownLabels === 0) {
    manager.isGameStarted = true;
    manager.isAsignandoControles = false;
    if (player) player.playVideo();
  }
  if (countDownLabels === -1) {
    $("#divCountdown").addClass("display-none");
    return;
  }
  countDownLabels--;
  setTimeout(CountDown, 1000, manager);
};
