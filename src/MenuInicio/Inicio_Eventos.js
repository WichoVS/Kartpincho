import { clock, delta, camera, pivot, arrayLights } from "./Inicio.js";
import * as THREE from "../../libs/threejs/src/Three.js";
import lights_toon_fragmentGlsl from "../../libs/threejs/src/renderers/shaders/ShaderChunk/lights_toon_fragment.glsl.js";
var opcionMenu = 0;
var canInput = [true, true, true, true];
var gamepads = {};
var gpsStateLF = []; //new GamepadState();
var arrayPlaylistVideos = [];

const APIKEY = "AIzaSyCahpRLo0SMKUbnrzzgOjZjwdZXRy6wwso";

function gamepadHandler(event, connecting) {
  var gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if (connecting) {
    gamepads[gamepad.index] = gamepad;
    let gamepadState = new GamepadState(gamepad.index);
    gpsStateLF.push(gamepadState);
  } else {
    delete gamepads[gamepad.index];
    delete gpsStateLF[gamepad.index];
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
    SetBotonFocus(1);
    opcionMenu = 1;
  });
  $("#btnCrearSala").on("mouseleave", () => {
    SetBotonFocus(0);
    opcionMenu = 0;
  });

  $("#btnPerfil").on("mouseover", () => {
    SetBotonFocus(2);
    opcionMenu = 2;
  });
  $("#btnPerfil").on("mouseleave", () => {
    SetBotonFocus(0);
    opcionMenu = 0;
  });

  $("#btnConfiguracion").on("mouseover", () => {
    SetBotonFocus(3);
    opcionMenu = 3;
  });
  $("#btnConfiguracion").on("mouseleave", () => {
    SetBotonFocus(0);
    opcionMenu = 0;
  });

  $("#btnCerrarSesion").on("mouseover", () => {
    SetBotonFocus(4);
    opcionMenu = 4;
  });
  $("#btnCerrarSesion").on("mouseleave", () => {
    SetBotonFocus(0);
    opcionMenu = 0;
  });

  $(window).on("keydown", (e) => {
    var code = e.keyCode || e.which;
    if (code == 38) {
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

    if (code == 32) {
      //Input de Prueba
      GetVideosPlaylist("PLGINh0aYNOJu2tZeqW8Yzcjo02WSQc4OH");
      //playerPlayVideo("lbxfbp9KPUQ");
    }

    if (code == 13) {
      console.log("entra");
      switch (opcionMenu) {
        case 1:
          window.location.href = "../Sala/Sala.html";
          break;
        case 2:
          window.location.href = "../Perfil/Perfil.html";
          break;
        case 3:
          window.location.href = "../Configuracion/Configuracion.html";
          break;
        case 4:
          //Hacer Procedimiento para cerrar la sesión
          window.location.href = "../Login/Login.html";
          break;
        default:
          break;
      }
    }
  });

  $("#btnCrearSala").on("click", () => {
    window.location.href = "../Sala/Sala.html";
  });

  $("#btnPerfil").on("click", () => {
    window.location.href = "../Perfil/Perfil.html";
  });

  $("#btnConfiguracion").on("click", () => {
    window.location.href = "../Configuracion/Configuracion.html";
  });

  $("#btnCerrarSesion").on("click", () => {
    //Agregar el proceso para cerrar la sesión
    window.location.href = "../Login/Login.html";
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
      //rectLight.color.setHex("#FFFFFF");

      for (let index = 0; index < arrayLights.length; index++) {
        if (index == opcSelect) {
          arrayLights[index].intensity = 20;
        } else {
          arrayLights[index].intensity = 0;
        }
      }
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
      //rectLight.color.setHex("#BF0413");

      for (let index = 0; index < arrayLights.length; index++) {
        if (index == opcSelect) {
          arrayLights[index].intensity = 20;
        } else {
          arrayLights[index].intensity = 0;
        }
      }
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
      //rectLight.color.setHex("#5A37A6");

      for (let index = 0; index < arrayLights.length; index++) {
        if (index == opcSelect) {
          arrayLights[index].intensity = 20;
        } else {
          arrayLights[index].intensity = 0;
        }
      }
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
      //rectLight.color.setHex("#393073");

      for (let index = 0; index < arrayLights.length; index++) {
        if (index == opcSelect) {
          arrayLights[index].intensity = 20;
        } else {
          arrayLights[index].intensity = 0;
        }
      }
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
      //rectLight.color.setHex("#04BFBF");

      for (let index = 0; index < arrayLights.length; index++) {
        if (index == opcSelect) {
          arrayLights[index].intensity = 20;
        } else {
          arrayLights[index].intensity = 0;
        }
      }
      //Otros colores #F2B705
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

  for (let index = 0; index < gamepads.length; index++) {
    if (gamepads[index] != null) {
      if (canInput[index]) {
        if (gamepads[index].axes[0] > 0.1 || gamepads[index].axes[0] < -0.1) {
          //pivot.translateX(gamepads[index].axes[0]);
        }
        if (gamepads[index].axes[1] > 0.1 || gamepads[index].axes[1] < -0.1) {
          //pivot.translateZ(gamepads[index].axes[1]);

          if (gamepads[index].axes[1] > 0.1) {
            ActualizaBotonFocus(1);
            canInput[index] = false;
          } else {
            ActualizaBotonFocus(-1);
            canInput[index] = false;
          }
          setTimeout(() => {
            canInput[index] = true;
          }, 300);
        }
      }
      if (gamepads[index].axes[2] > 0.1 || gamepads[index].axes[2] < -0.1) {
        let yRot = THREE.Math.radToDeg(
          pivot.rotation.y +
            THREE.Math.degToRad(2 * -1 * gamepads[index].axes[2])
        );
        pivot.rotation.y = THREE.Math.degToRad(yRot);
      }
      if (gamepads[index].axes[3] > 0.1 || gamepads[index].axes[3] < -0.1) {
        let xRot = THREE.Math.radToDeg(
          pivot.rotation.x +
            THREE.Math.degToRad(2 * -1 * gamepads[index].axes[3])
        );
      }
      ///////////////////////////////////////////////////////////////////////////////
      ////////////////////      BTN A          //////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////
      if (
        gamepads[index].buttons[0].pressed &&
        gpsStateLF[index].GetBtnA() != gamepads[index].buttons[0].pressed
      ) {
        console.log("Button A pressed");
        switch (opcionMenu) {
          case 1:
            window.location.href = "../Sala/Sala.html";
            break;
          case 2:
            window.location.href = "../Perfil/Perfil.html";
            break;
          case 3:
            window.location.href = "../Configuracion/Configuracion.html";
            break;
          case 4:
            //Hacer Procedimiento para cerrar la sesión
            window.location.href = "../Login/Login.html";
            break;

          default:
            break;
        }
        gpsStateLF[index].SetBtnA(true);
      } else if (!gamepads[index].buttons[0].pressed) {
        gpsStateLF[index].SetBtnA(false);
      }

      ///////////////////////////////////////////////////////////////////////////////
      ////////////////////      BTN B          //////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////
      if (
        gamepads[index].buttons[1].pressed &&
        gpsStateLF[index].GetBtnB() != gamepads[index].buttons[1].pressed
      ) {
        console.log("Button B pressed");
        gpsStateLF[index].SetBtnB(true);
      } else if (!gamepads[index].buttons[1].pressed) {
        gpsStateLF[index].SetBtnB(false);
      }

      ///////////////////////////////////////////////////////////////////////////////
      ////////////////////      BTN X          //////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////
      if (
        gamepads[index].buttons[2].pressed &&
        gpsStateLF[index].GetBtnX() != gamepads[index].buttons[2].pressed
      ) {
        console.log("Button X pressed");
        gpsStateLF[index].SetBtnX(true);
      } else if (!gamepads[index].buttons[2].pressed) {
        gpsStateLF[index].SetBtnX(false);
      }

      ///////////////////////////////////////////////////////////////////////////////
      ////////////////////      BTN Y          //////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////
      if (
        gamepads[index].buttons[3].pressed &&
        gpsStateLF[index].GetBtnY() != gamepads[index].buttons[3].pressed
      ) {
        console.log("Button Y pressed");
        gpsStateLF[index].SetBtnY(true);
      } else if (!gamepads[index].buttons[3].pressed) {
        gpsStateLF[index].SetBtnY(false);
      }
    }
  }
};

const GetVideosPlaylist = (playlistID) => {
  $.ajax({
    url: `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistID}&key=${APIKEY}&maxResults=50`,
    type: "GET",
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    success: (data) => {
      data.items.forEach((e) => {
        let videoYT = new YTVideo(
          e.snippet.title,
          e.snippet.thumbnails.default,
          e.snippet.position,
          e.snippet.resourceId.videoId
        );

        arrayPlaylistVideos.push(videoYT);
      });

      playerPlayVideo(arrayPlaylistVideos, 0);
      $("#divSong").css("display", "flex");
    },
    error: (xmlHttpRequest, errorThrown) => {
      console.log(errorThrown);
    },
  });
};

export { GeneraEventos };