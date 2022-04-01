var pasoActual = 1;

const Init = () => {
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
        pasoActual = 1;
        break;

      case 3:
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
        var _vueltas = parseInt($("#selVueltas").val());
        var _dificultad = parseInt($("#selDificultad").val());
        var _bots = Boolean(
          parseInt($("input[name='sel-bots']:checked").val())
        );
        var _noBots = parseInt($("#selBots").val());

        opcionesJuego.Pista = _pista;
        opcionesJuego.Jugadores = _jugadores;
        opcionesJuego.Vueltas = _vueltas;
        opcionesJuego.Dificultad = _dificultad;
        opcionesJuego.Bots = _bots;
        opcionesJuego.NoBots = _noBots;

        $("#divPlayers").empty();
        for (let index = 0; index < opcionesJuego.Jugadores; index++) {
          $("#divPlayers").append(
            `
          <div class="div-player-selection">
            <div style="background-color: gray; width: 200px; height: 150px">
              J${index + 1}
            </div>
            <label class="lbl-playername">Jugador ${index + 1}</label>
          </div>
          `
          );
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
        window.location.href = "../Juego/Juego.html";
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
