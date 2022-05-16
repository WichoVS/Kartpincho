var opcionesJuego = {
  _id: "",
  Modalidad: "",
  Pista: "",
  Ganador: "",
  Vueltas: 0,
  Bots: false,
  NoBots: 0,
  Jugadores: 0,
  Dificultad: 0,
  VueltaMasRapida: -1,
  Playlist: "",
  CreadaPor: "",
  Iniciada: false,
  Finalizada: false,
};

var jugadoresArray = [];

$(() => {
  Init();
  GetModalidades();
  GetMapas();
  GetPlaylistUsuario();
});
