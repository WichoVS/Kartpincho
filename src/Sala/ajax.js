const GetModalidades = async () => {
  const resp = await fetch("http://localhost:3000/api/modalidad/getAll");
  const { success, message, data } = await resp.json();

  if (success) {
    data.forEach((m) => {
      $("#divModalidades").append(`
        <div class="div-modojuego">
          <img
            id="${m._id}"
            src="${m.Imagen}"
            alt=""
          />
          <label>${m.Nombre}</label>
        </div>
          `);
    });
    $(".div-modojuego").on("click", (e) => {
      opcionesJuego.Modalidad = e.target.id;
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
  } else {
    Swal.fire({
      icon: "error",
      title: "Modalidades",
      text: message,
    });
  }
};

const GetMapas = async () => {
  const resp = await fetch("http://localhost:3000/api/pista/getAll");
  const { success, message, data } = await resp.json();

  if (success) {
    data.forEach((m) => {
      $("#selMapa").append(
        `
            <option value="${m._id}" attr-imagen="${m.Imagen}">${m.Nombre}</option>
        `
      );
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Mapas",
      text: message,
    });
  }
};

const GetPlaylistUsuario = async () => {
  var user = localStorage.getItem("UsuarioLog");
  const resp = await fetch("http://localhost:3000/api/playlist/getByOwner", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ UsuarioOwner: user }),
  });
  const { success, message, data } = await resp.json();

  data.forEach((p) => {
    $("#selPlaylist").append(
      `
        <option value="${p._id}">${p.Nombre}</option>
      `
    );
  });
};
