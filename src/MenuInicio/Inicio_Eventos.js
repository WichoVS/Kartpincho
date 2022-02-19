import { clock, delta } from "./Inicio.js";

var opcionMenu = 0;
var canInput = true;
var gamepads = {};

function gamepadHandler(event, connecting) {
  var gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if (connecting) {
    gamepads[gamepad.index] = gamepad;
  } else {
    delete gamepads[gamepad.index];
  }
}

window.addEventListener(
  "gamepadconnected",
  function (e) {
    gamepadHandler(e, true);
  },
  false
);
window.addEventListener(
  "gamepaddisconnected",
  function (e) {
    gamepadHandler(e, false);
  },
  false
);

const GeneraEventos = () => {
  $("#btnCrearSala").on("mouseover", () => {
    $("#btnCrearSala").addClass("btnHover-Active");
    $("#btnCrearSala").removeClass("btnNotHover-Active");
  });

  $("#btnCrearSala").on("mouseleave", () => {
    $("#btnCrearSala").removeClass("btnHover-Active");
    $("#btnCrearSala").addClass("btnNotHover-Active");
  });

  $(window).on("keydown", (e) => {
    var code = e.keyCode || e.which;
    if (code == 38) {
      //Enter keycode
      //Do something
      console.log("arrowUp");
      ActualizaBotonFocus(-1);
    }
    if (code == 40) {
      console.log("arrowDown");
      ActualizaBotonFocus(1);
    }

    if (code == 37) {
      console.log("arrowLeft");
    }

    if (code == 39) {
      console.log("arrowRight");
    }

    if (code == 27) {
      opcionMenu = 0;
      SetBotonFocus(opcionMenu);
      console.log("esc");
    }
  });
};

const ActualizaBotonFocus = (mod) => {
  if (opcionMenu < 2 && mod == -1) {
    opcionMenu = 4;
  } else if (opcionMenu == 4 && mod == 1) {
    opcionMenu = 1;
  } else if (mod == -1) {
    opcionMenu--;
  } else if (mod == 1) {
    opcionMenu++;
  }
  SetBotonFocus(opcionMenu);
};

const SetBotonFocus = (opcSelect) => {
  switch (opcSelect) {
    case 0:
      $("#btnCrearSala").removeClass("btnHover-Active");
      $("#btnCrearSala").addClass("btnNotHover-Active");
      $("#btnCrearSala").removeClass("btnBorder-Focus");
      $("#btnCrearSala").addClass("btnBorder-NotFocus");
      $("#btnPerfil").removeClass("btnHover-Active");
      $("#btnPerfil").addClass("btnNotHover-Active");
      $("#btnPerfil").removeClass("btnBorder-Focus");
      $("#btnPerfil").addClass("btnBorder-NotFocus");
      $("#btnConfiguracion").removeClass("btnHover-Active");
      $("#btnConfiguracion").addClass("btnNotHover-Active");
      $("#btnConfiguracion").removeClass("btnBorder-Focus");
      $("#btnConfiguracion").addClass("btnBorder-NotFocus");
      $("#btnCerrarSesion").removeClass("btnHover-Active");
      $("#btnCerrarSesion").addClass("btnNotHover-Active");
      $("#btnCerrarSesion").removeClass("btnBorder-Focus");
      $("#btnCerrarSesion").addClass("btnBorder-NotFocus");
      break;
    case 1:
      $("#btnCrearSala").removeClass("btnNotHover-Active");
      $("#btnCrearSala").addClass("btnHover-Active");
      $("#btnCrearSala").removeClass("btnBorder-NotFocus");
      $("#btnCrearSala").addClass("btnBorder-Focus");
      $("#btnPerfil").removeClass("btnHover-Active");
      $("#btnPerfil").addClass("btnNotHover-Active");
      $("#btnPerfil").removeClass("btnBorder-Focus");
      $("#btnPerfil").addClass("btnBorder-NotFocus");
      $("#btnConfiguracion").removeClass("btnHover-Active");
      $("#btnConfiguracion").addClass("btnNotHover-Active");
      $("#btnConfiguracion").removeClass("btnBorder-Focus");
      $("#btnConfiguracion").addClass("btnBorder-NotFocus");
      $("#btnCerrarSesion").removeClass("btnHover-Active");
      $("#btnCerrarSesion").addClass("btnNotHover-Active");
      $("#btnCerrarSesion").removeClass("btnBorder-Focus");
      $("#btnCerrarSesion").addClass("btnBorder-NotFocus");
      break;
    case 2:
      $("#btnCrearSala").removeClass("btnHover-Active");
      $("#btnCrearSala").addClass("btnNotHover-Active");
      $("#btnCrearSala").removeClass("btnBorder-Focus");
      $("#btnCrearSala").addClass("btnBorder-NotFocus");
      $("#btnPerfil").removeClass("btnNotHover-Active");
      $("#btnPerfil").addClass("btnHover-Active");
      $("#btnPerfil").removeClass("btnBorder-NotFocus");
      $("#btnPerfil").addClass("btnBorder-Focus");
      $("#btnConfiguracion").removeClass("btnHover-Active");
      $("#btnConfiguracion").addClass("btnNotHover-Active");
      $("#btnConfiguracion").removeClass("btnBorder-Focus");
      $("#btnConfiguracion").addClass("btnBorder-NotFocus");
      $("#btnCerrarSesion").removeClass("btnHover-Active");
      $("#btnCerrarSesion").addClass("btnNotHover-Active");
      $("#btnCerrarSesion").removeClass("btnBorder-Focus");
      $("#btnCerrarSesion").addClass("btnBorder-NotFocus");
      break;
    case 3:
      $("#btnCrearSala").removeClass("btnHover-Active");
      $("#btnCrearSala").addClass("btnNotHover-Active");
      $("#btnCrearSala").removeClass("btnBorder-Focus");
      $("#btnCrearSala").addClass("btnBorder-NotFocus");
      $("#btnPerfil").removeClass("btnHover-Active");
      $("#btnPerfil").addClass("btnNotHover-Active");
      $("#btnPerfil").removeClass("btnBorder-Focus");
      $("#btnPerfil").addClass("btnBorder-NotFocus");
      $("#btnConfiguracion").removeClass("btnNotHover-Active");
      $("#btnConfiguracion").addClass("btnHover-Active");
      $("#btnConfiguracion").removeClass("btnBorder-NotFocus");
      $("#btnConfiguracion").addClass("btnBorder-Focus");
      $("#btnCerrarSesion").removeClass("btnHover-Active");
      $("#btnCerrarSesion").addClass("btnNotHover-Active");
      $("#btnCerrarSesion").removeClass("btnBorder-Focus");
      $("#btnCerrarSesion").addClass("btnBorder-NotFocus");
      break;
    case 4:
      $("#btnCrearSala").removeClass("btnHover-Active");
      $("#btnCrearSala").addClass("btnNotHover-Active");
      $("#btnCrearSala").removeClass("btnBorder-Focus");
      $("#btnCrearSala").addClass("btnBorder-NotFocus");
      $("#btnPerfil").removeClass("btnHover-Active");
      $("#btnPerfil").addClass("btnNotHover-Active");
      $("#btnPerfil").removeClass("btnBorder-Focus");
      $("#btnPerfil").addClass("btnBorder-NotFocus");
      $("#btnConfiguracion").removeClass("btnHover-Active");
      $("#btnConfiguracion").addClass("btnNotHover-Active");
      $("#btnConfiguracion").removeClass("btnBorder-Focus");
      $("#btnConfiguracion").addClass("btnBorder-NotFocus");
      $("#btnCerrarSesion").removeClass("btnNotHover-Active");
      $("#btnCerrarSesion").addClass("btnHover-Active");
      $("#btnCerrarSesion").removeClass("btnBorder-NotFocus");
      $("#btnCerrarSesion").addClass("btnBorder-Focus");
      break;
  }
};

export const OptMove = () => {
  var gamepads = navigator.getGamepads
    ? navigator.getGamepads()
    : navigator.webkitGetGamepads
    ? navigator.webkitGetGamepads()
    : [];
  var gamepadsConnected = 0;
  for (let index = 0; index < gamepads.length; index++) {
    if (gamepads[index] != null) {
      gamepadsConnected++;
    }
  }

  if (!gamepads || gamepadsConnected == 0) {
    return;
  }

  let p1 = gamepads[0];
  if (canInput) {
    if (p1.axes[0] > 0.1 || p1.axes[0] < -0.1) {
    }
    if (p1.axes[1] > 0.1 || p1.axes[1] < -0.1) {
      if (p1.axes[1] > 0.1) {
        ActualizaBotonFocus(1);
        canInput = false;
      } else {
        ActualizaBotonFocus(-1);
        canInput = false;
      }
      setTimeout(() => {
        canInput = true;
      }, 200);
    }
  }
};

export { GeneraEventos };
