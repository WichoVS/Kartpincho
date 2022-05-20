const GetPartida = async (manager) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const p = urlParams.get("p");
  const resp = await fetch(
    `https://kartpinchoapi.onrender.com/api/partida/getPartidaById/${p}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const { success, message, data } = await resp.json();

  if (success) {
    partida = data;
    const respPlayers = await fetch(
      `https://kartpinchoapi.onrender.com/api/jugadorPartida/getJugadoresByPartida/${p}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { success: sPs, message: mPs, data: dPs } = await respPlayers.json();
    if (success) jugadoresData = dPs;
  }
};

const IniciaPartida = async () => {};

const FinalizaPartida = async () => {};

const ActualizaVueltaMasRapida = async () => {};

const ActualizaGanador = async () => {};
