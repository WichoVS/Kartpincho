var opcionMenu = 0;
var canInput = [true, true, true, true];
var gamepads = {};
var gpsStateLF = []; //new GamepadState();
var arrayPlaylistVideos = [];

const APIKEY = "AIzaSyCahpRLo0SMKUbnrzzgOjZjwdZXRy6wwso";

const InicializaEventos = () => {
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
