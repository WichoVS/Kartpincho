const InicializaEventos = () => {
  $("#btnBack").on("click", () => {
    window.location.href = "../MenuInicio/Inicio.html";
  });

  $("#btnModificar").on("click", (e) => {
    $("#modalModificar").css("display", "flex");
  });

  $("#btnPlaylist").on("click", (e) => {
    $("#modalPlaylist").css("display", "flex");
  });

  $("#btnSaveMods").on("click", (e) => {
    $("#modalModificar").css("display", "none");
  });

  $("#btnCancelarMods").on("click", (e) => {
    $("#modalModificar").css("display", "none");
  });

  $("#btnSaveList").on("click", (e) => {
    const name = $("#lblPlaylistName").val();
    const url = $("#lblPlaylistUrl").val();
    GuardaPlaylist(name, url);
    $("#modalPlaylist").css("display", "none");
  });

  $("#btnCancelarList").on("click", (e) => {
    $("#modalPlaylist").css("display", "none");
  });
};
