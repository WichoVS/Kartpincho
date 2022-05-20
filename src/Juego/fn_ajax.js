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

const FinalizaPartida = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const p = urlParams.get("p");
  const resp = await fetch(
    `https://kartpinchoapi.onrender.com/api/partida/finalizaPartida/${p}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const { success, message, data } = await resp.json();
  if (!success) {
    console.log(data);
    return success;
  } else {
    return success;
  }
};

const ActualizaVueltaMasRapida = async (tiempo) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const p = urlParams.get("p");
  const resp = await fetch(
    `https://kartpinchoapi.onrender.com/api/partida/updateVueltaMasRapida/${p}`,
    {
      method: "POST",
      cors: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ VueltaMasRapida: tiempo }),
    }
  );

  const { success, message, data } = await resp.json();
  if (!success) {
    console.log(data);
    return success;
  } else {
    return success;
  }
};

const ActualizaGanador = async (jugador) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const p = urlParams.get("p");
  const resp = await fetch(
    `https://kartpinchoapi.onrender.com/api/partida/updateGanador/${p}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Ganador: jugador }),
    }
  );

  const { success, message, data } = await resp.json();
  if (!success) {
    console.log(data);
    return success;
  } else {
    return success;
  }
};
