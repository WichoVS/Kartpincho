const GetModalidades = async () => {
  const resp = await fetch(
    "https://kartpinchoapi.onrender.com/api/modalidad/getAll"
  );
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
      var opt = $("#selMapa option:selected").attr("attr-imagen");
      $("#imgMapa").attr("src", opt);
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
  const resp = await fetch(
    "https://kartpinchoapi.onrender.com/api/pista/getAll"
  );
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
  const resp = await fetch(
    `https://kartpinchoapi.onrender.com/api/playlist/getByOwner/${user}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const { success, message, data } = await resp.json();

  data.forEach((p) => {
    $("#selPlaylist").append(
      `
        <option value="${p._id}">${p.Nombre}</option>
      `
    );
  });
};

const CrearPartida = async (partida, jugadores) => {
  const resp = await fetch(
    "https://kartpinchoapi.onrender.com/api/partida/createPartida",
    {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partida),
    }
  );

  const { success, message, data } = await resp.json();
  console.log(data);
  jugadores.forEach((j) => {
    j.Partida = data._id;
  });
  AddJugadoresAPartida(jugadores);
};

const AddJugadoresAPartida = async (jugadores) => {
  const resp = await fetch(
    "https://kartpinchoapi.onrender.com/api/jugadorPartida/createJugadores",
    {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Jugadores: jugadores }),
    }
  );

  const { success, message, data } = await resp.json();
  window.location.href = `../Juego/Juego.html?p=${jugadores[0].Partida}`;
  return success;
};
