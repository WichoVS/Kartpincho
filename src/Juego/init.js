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
    // En este pedazo de código es del modal donde se configura de que jugador es que control.
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
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------

    var playerController = -1;
    manager.jugadores.forEach((j, i) => {
      if (j.isKeyboardControl) {
        playerController = i;
      }
    });

    var p = manager.jugadores[playerController];

    if (playerController == -1) return;
    var code = e.keyCode || e.which;
    if (manager.jugadores.length > 0) {
      if (code == 38 && worldLoaded && manager.isGameStarted) {
        p.AccelerateOn();
      }
      if (code == 40 && worldLoaded && manager.isGameStarted) {
        p.ReverseOn();
      }

      if (code == 37 && worldLoaded && manager.isGameStarted) {
        p.TurnLeftOn();
      }

      if (code == 39 && worldLoaded && manager.isGameStarted) {
        p.TurnRightOn();
      }

      if (code == 32 && worldLoaded && manager.isGameStarted) {
        p.BrakeOn();
      }
      if (code == 49 && worldLoaded && manager.isGameStarted) {
        p.ResetPosition();
      }

      if (code == 69 && worldLoaded && manager.isGameStarted) {
        switch (p.item) {
          case "STUN_ITEM":
            p.ActiveItem();
            /*manager.jugadores.forEach(otherPlayer => {
              if (otherPlayer.name != p.name) {
                otherPlayer.isStuned = true;
                otherPlayer.stunTime = 180;
              }
            });*/
            break;

          case "SLOW_ITEM":
            manager.jugadores.forEach((otherPlayer) => {
              if (otherPlayer.name != p.name) {
                otherPlayer.slowDownFactor = 0.2;
                otherPlayer.slowDownTime = 560;
              }
            });
            break;

          case "DRUNK_ITEM":
            manager.jugadores.forEach((otherPlayer) => {
              if (otherPlayer.name != p.name) {
                otherPlayer.isDrunk = true;
                otherPlayer.drunkTime = 560;
              }
            });
            break;

          default:
            break;
        }

        p.item = "NONE";
      }
    }
  });

  $(window).on("keyup", (e) => {
    var code = e.keyCode || e.which;

    var playerController = -1;
    manager.jugadores.forEach((j, i) => {
      if (j.isKeyboardControl) {
        playerController = i;
      }
    });
    var p = manager.jugadores[playerController];

    if (manager.jugadores.length > 0) {
      if (code == 38 && worldLoaded && manager.isGameStarted) {
        p.AccelerateOff();
      }
      if (code == 40 && worldLoaded && manager.isGameStarted) {
        p.ReverseOff();
      }

      if (code == 37 && worldLoaded && manager.isGameStarted) {
        p.TurnLeftOff();
      }

      if (code == 39 && worldLoaded && manager.isGameStarted) {
        p.TurnRightOff();
      }

      if (code == 32 && worldLoaded && manager.isGameStarted) {
        p.BrakeOff();
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

      var p = _manager.jugadores[playerController];
      if (c.axes[0] > 0.1 || c.axes[0] < -0.1) {
        if (p.loaded) {
          p.TurnRightOn(c.axes[0]);
        }
      } else {
        if (p.loaded) {
          p.TurnRightOff();
        }
      }

      c.buttons.forEach((b, i) => {
        if (p.loaded) {
          if (b.pressed) {
            if (i == 7 && _manager.isGameStarted) {
              p.AccelerateOn(b.value);
              c.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 0.5,
                strongMagnitude: 0.7,
              });
            }
            if (i == 6 && _manager.isGameStarted) {
              p.ReverseOn(b.value);
              c.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 0.5,
                strongMagnitude: 0.7,
              });
            }
            if (i == 1 && _manager.isGameStarted) {
              p.BrakeOn();
              c.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 0.6,
                strongMagnitude: 0.1,
              });
            }

            if (i == 3 && _manager.isGameStarted) {
              p.ResetPosition();
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
              }

              if (_manager.isGameStarted) {
                p.willActivateItem = true;
              }
            }
          } else {
            if (i == 0 && p.willActivateItem) {
              p.willActivateItem = false;

              switch (p.item) {
                case "STUN_ITEM":
                  p.ActiveItem();
                  /*manager.jugadores.forEach(otherPlayer => {
                    if (otherPlayer.name != p.name) {
                      otherPlayer.isStuned = true;
                      otherPlayer.stunTime = 180;
                    }
                  });*/
                  break;

                case "SLOW_ITEM":
                  manager.jugadores.forEach((otherPlayer) => {
                    if (otherPlayer.name != p.name) {
                      otherPlayer.slowDownFactor = 0.2;
                      otherPlayer.slowDownTime = 560;
                    }
                  });
                  break;

                case "DRUNK_ITEM":
                  manager.jugadores.forEach((otherPlayer) => {
                    if (otherPlayer.name != p.name) {
                      otherPlayer.isDrunk = true;
                      otherPlayer.drunkTime = 560;
                    }
                  });
                  break;

                default:
                  break;
              }

              p.item = "NONE";
            }

            //Reseteamos todos los eventos (Mejorar la lógica de los botónes luego).
            if (i == 7 && !c.buttons[6].pressed) {
              p.AccelerateOff();
            }
            if (i == 1) {
              p.BrakeOff();
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

const IsAsignandoControles = () => {};

const IsGameStarted = () => {};
