var pasoActual = 1;
var playersSkin = [];

const Init = () => {
  for (let index = 0; index < 4; index++) {
    var playerSkin = {
      kart: 1,
      corredor: 1,
    };
    playersSkin.push(playerSkin);
  }

  $("#selMapa").on("change", (e) => {
    var opt = $("#selMapa option:selected").attr("attr-imagen");
    $("#imgMapa").attr("src", opt);
  });

  $("#btnBack").on("click", () => {
    switch (pasoActual) {
      case 1:
        window.location.href = "../MenuInicio/Inicio.html";
        break;

      case 2:
        $("#paso1").css("display", "flex");
        $("#paso2").css("display", "none");
        $("#paso3").css("display", "none");
        $("#btnBack").text("Menú");
        $("#divPaso1").addClass("div-paso-actual");
        $("#divPaso1").removeClass("div-paso-otro");
        $("#divPaso2").addClass("div-paso-otro");
        $("#divPaso2").removeClass("div-paso-actual");
        $("#btnNext").css("display", "none");
        var opt = $("#selMapa option:selected").attr("attr-imagen");
        $("#imgMapa").attr("src", opt);
        pasoActual = 1;
        break;

      case 3:
        var opt = $("#selMapa option:selected").attr("attr-imagen");
        $("#imgMapa").attr("src", opt);
        $("#paso1").css("display", "none");
        $("#paso2").css("display", "flex");
        $("#paso3").css("display", "none");
        $("#divPaso2").addClass("div-paso-actual");
        $("#divPaso2").removeClass("div-paso-otro");
        $("#divPaso3").addClass("div-paso-otro");
        $("#divPaso3").removeClass("div-paso-actual");
        $("#btnNext").text("Siguiente");
        pasoActual = 2;
        break;

      default:
        break;
    }
  });

  $("#btnNext").on("click", () => {
    switch (pasoActual) {
      case 2:
        //Se pasa al paso 3
        var _pista = $("#selMapa").val();
        var _jugadores = parseInt($("#selJugadores").val());
        var _vueltas = parseInt($("#inpVueltas").val());
        var _dificultad = parseInt($("#selDificultad").val());

        opcionesJuego.Pista = _pista;
        opcionesJuego.Jugadores = _jugadores;
        opcionesJuego.Vueltas = _vueltas;
        opcionesJuego.Dificultad = _dificultad;

        $("#divPlayers").empty();
        for (let index = 0; index < opcionesJuego.Jugadores; index++) {
          $("#divPlayers").append(
            `
          <div class="div-player-selection">
            <div style="background-color: gray; width: 200px; height: 150px">
              <img
                id="${index}-skin"
                style="width: 100%; height: 100%"
                src="../../assets/images/playersStyles/opt${playersSkin[index].kart}_${playersSkin[index].corredor}.png"
                alt=""
              />
            </div>
            <label class="lbl-playername">Jugador Prueba</label>
            <label class="lbl-playersettings">Kart</label>
            <div class="div-player-buttons">
              <button id="${index}-kb" class="btn-player-back">Anterior</button>
              <button id="${index}-kn" class="btn-player-next">Siguiente</button>
            </div>
            <label style="margin-top: 10px" class="lbl-playersettings"
              >Corredor</label
            >
            <div class="div-player-buttons">
              <button id="${index}-cb" class="btn-player-back">Anterior</button>
              <button id="${index}-cn" class="btn-player-next">Siguiente</button>
            </div>
          </div>
          `
          );

          $(`#${index}-kb`).on("click", () => {
            if (playersSkin[index].kart == 1) {
              playersSkin[index].kart = 3;
            } else {
              playersSkin[index].kart--;
            }
            console.log(playersSkin[index]);
            $(`#${index}-skin`).attr(
              "src",
              `../../assets/images/playersStyles/opt${playersSkin[index].kart}_${playersSkin[index].corredor}.png`
            );
          });
          $(`#${index}-kn`).on("click", () => {
            if (playersSkin[index].kart == 3) {
              playersSkin[index].kart = 1;
            } else {
              playersSkin[index].kart++;
            }
            console.log(playersSkin[index]);
            $(`#${index}-skin`).attr(
              "src",
              `../../assets/images/playersStyles/opt${playersSkin[index].kart}_${playersSkin[index].corredor}.png`
            );
          });
          $(`#${index}-cb`).on("click", () => {
            if (playersSkin[index].corredor == 1) {
              playersSkin[index].corredor = 3;
            } else {
              playersSkin[index].corredor--;
            }
            console.log(playersSkin[index]);
            $(`#${index}-skin`).attr(
              "src",
              `../../assets/images/playersStyles/opt${playersSkin[index].kart}_${playersSkin[index].corredor}.png`
            );
          });
          $(`#${index}-cn`).on("click", () => {
            if (playersSkin[index].corredor == 3) {
              playersSkin[index].corredor = 1;
            } else {
              playersSkin[index].corredor++;
            }
            console.log(playersSkin[index]);
            $(`#${index}-skin`).attr(
              "src",
              `../../assets/images/playersStyles/opt${playersSkin[index].kart}_${playersSkin[index].corredor}.png`
            );
          });
        }

        $("#paso2").css("display", "none");
        $("#paso3").css("display", "flex");
        $("#divPaso2").removeClass("div-paso-actual");
        $("#divPaso2").addClass("div-paso-otro");
        $("#divPaso3").removeClass("div-paso-otro");
        $("#divPaso3").addClass("div-paso-actual");
        $("#btnNext").text("Crear");
        pasoActual = 3;
        break;
      case 3:
        opcionesJuego.Playlist = $("#selPlaylist").val();
        opcionesJuego.CreadaPor = localStorage.getItem("UsuarioLog");

        for (let index = 0; index < opcionesJuego.Jugadores; index++) {
          let jugador = {
            Partida: "",
            JugadorLogeado: localStorage.getItem("UsuarioLog"),
            Imagen: GetUrlImagen(
              playersSkin[index].kart,
              playersSkin[index].corredor
            ),
            Modelo: GetUrlModelo(
              playersSkin[index].kart,
              playersSkin[index].corredor
            ),
            Nombre: `Jugador${index + 1}`,
          };

          jugadoresArray.push(jugador);
        }

        CrearPartida(opcionesJuego, jugadoresArray);
        break;
      default:
        break;
    }
  });

  $("input[name='sel-bots']").on("change", (e) => {
    let _id = e.target.id;
    if (_id === "radioBotsTrue") {
      $("#selBots").prop("disabled", false);
    } else {
      $("#selBots").prop("disabled", true);
    }
  });
};

const GetUrlImagen = (_kart, _corredor) => {
  return `../../assets/images/playersStyles/opt${_kart}_${_corredor}.png`;
};

const GetUrlModelo = (_kart, _corredor) => {
  return `../../assets/modelos/players/player${_kart}_${_corredor}.fbx`;
};
