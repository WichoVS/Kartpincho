var opcionesJuego = {
  Modalidad: "",
  Pista: "",
  Ganador: "",
  Vueltas: 0,
  Bots: false,
  NoBots: 0,
  Jugadores: 0,
  Dificultad: 0,
  VueltaMasRapida: 0,
  Playlist: "",
};

$(() => {
  Init();
  GetModalidades();
  GetMapas();
  GetPlaylistUsuario();
});
