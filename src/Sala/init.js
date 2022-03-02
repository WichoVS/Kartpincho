var pasoActual = 1;
var opcionesJuego = {};

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

  $("#imgCircuito").on("click", () => {
    pasoActual = 2;
    $("#btnNext").css("display", "flex");
    $("#btnBack").text("Anterior");
    $("#divPaso1").removeClass("div-paso-actual");
    $("#divPaso1").addClass("div-paso-otro");
    $("#divPaso2").removeClass("div-paso-otro");
    $("#divPaso2").addClass("div-paso-actual");
    $("#paso1").css("display", "none");
    $("#paso2").css("display", "flex");
  });

  $("#imgEliminacion").on("click", () => {
    pasoActual = 2;
    $("#btnNext").css("display", "flex");
    $("#btnBack").text("Anterior");
    $("#divPaso1").removeClass("div-paso-actual");
    $("#divPaso1").addClass("div-paso-otro");
    $("#divPaso2").removeClass("div-paso-otro");
    $("#divPaso2").addClass("div-paso-actual");
    $("#paso1").css("display", "none");
    $("#paso2").css("display", "flex");
  });

  $("#imgReyPista").on("click", () => {
    pasoActual = 2;
    $("#btnNext").css("display", "flex");
    $("#btnBack").text("Anterior");
    $("#divPaso1").removeClass("div-paso-actual");
    $("#divPaso1").addClass("div-paso-otro");
    $("#divPaso2").removeClass("div-paso-otro");
    $("#divPaso2").addClass("div-paso-actual");
    $("#paso1").css("display", "none");
    $("#paso2").css("display", "flex");
  });
};

export { Init };
