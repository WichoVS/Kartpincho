const LoadPlaylistTable = async () => {
  const playlists = await CargaPlaylist();
  $("#tblPlaylistBody").html("");
  playlists.forEach((p) => {
    $("#tblPlaylistBody").append(
      `
              <tr>
                <td>${p.Nombre}</td>
                <td>
                  ${p.Url}
                </td>
                <td><button>Borrar</button></td>
              </tr>
      `
    );
  });
};

$(async () => {
  const data = await LoadPerfilData();
  $("#lblUsername").html(data.Usuario.Username);
  $("#lblPartidasTotales").html(data.PartidasJugadasTotales);
  $("#lblPistaPreferidaTotal").html(data.PistaPreferida);
  $("#lblModalidadPreferidaTotal").html(data.ModalidadPreferida);
  $("#lblPartidasJugadasCirc").html(data.Circuito.PartidasJugadasTotales);
  $("#lblPistaPreferidaCirc").html(data.Circuito.PistaPreferida);
  $("#lblVueltaMasRapidaCirc").html(
    data.Circuito.VueltaMasRapidaEnModalidad === -1
      ? ""
      : data.Circuito.VueltaMasRapidaEnModalidad
  );
  $("#lblPartidasJugadasElim").html(data.Eliminacion.PartidasJugadasTotales);
  $("#lblPistaPreferidaElim").html(
    data.Eliminacion.PartidasJugadasTotales === 0
      ? "-"
      : data.Eliminacion.PistaPreferida
  );
  $("#lblVueltaMasRapidaElim").html(
    data.Eliminacion.VueltaMasRapidaEnModalidad === -1
      ? "-"
      : data.Eliminacion.VueltaMasRapidaEnModalidad
  );

  LoadPlaylistTable();

  InicializaEventos();
});
