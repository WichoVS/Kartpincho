const InicializaEventos = () => {
  $("#btnBack").on("click", () => {
    window.location.href = "../MenuInicio/Inicio.html";
  });
  $("#btnNext").on("click", () => {
    localStorage.setItem("Config", JSON.stringify(Configuracion));
    Swal.fire({
      icon: "success",
      text: "Se ha Guardado la Configuración",
      title: "Configuración",
    });
  });

  $("#btnSiSonido").on("click", (e) => {
    $("#btnSiSonido").addClass("btn-Checked");
    $("#btnSiSonido").removeClass("btn-Unchecked");
    $("#btnNoSonido").removeClass("btn-Checked");
    $("#btnNoSonido").addClass("btn-Unchecked");

    Configuracion.Sonido = true;
  });

  $("#btnNoSonido").on("click", (e) => {
    $("#btnNoSonido").addClass("btn-Checked");
    $("#btnNoSonido").removeClass("btn-Unchecked");
    $("#btnSiSonido").removeClass("btn-Checked");
    $("#btnSiSonido").addClass("btn-Unchecked");
    Configuracion.Sonido = false;
  });

  $("#btnSiMusica").on("click", (e) => {
    $("#btnSiMusica").addClass("btn-Checked");
    $("#btnSiMusica").removeClass("btn-Unchecked");
    $("#btnNoMusica").removeClass("btn-Checked");
    $("#btnNoMusica").addClass("btn-Unchecked");

    Configuracion.Musica = true;
  });

  $("#btnNoMusica").on("click", (e) => {
    $("#btnNoMusica").addClass("btn-Checked");
    $("#btnNoMusica").removeClass("btn-Unchecked");
    $("#btnSiMusica").removeClass("btn-Checked");
    $("#btnSiMusica").addClass("btn-Unchecked");

    Configuracion.Musica = false;
  });
};
