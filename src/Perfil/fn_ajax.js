const LoadPerfilData = async () => {
  const user = localStorage.getItem("UsuarioLog");
  const resp = await fetch(
    `http://localhost:3000/api/usuarios/perfil/${user}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const { success, message, data } = await resp.json();
  if (success) {
    return data;
  }
};

const GuardaPlaylist = async (nombre, url) => {
  const user = localStorage.getItem("UsuarioLog");
  const resp = await fetch(`http://localhost:3000/api/playlist/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      UsuarioOwner: user,
      Nombre: nombre,
      Imagen: "",
      Url: url,
    }),
  });

  const { success, message, data } = await resp.json();

  if (success) {
    LoadPlaylistTable();
  }
};

const CargaPlaylist = async () => {
  const user = localStorage.getItem("UsuarioLog");
  const resp = await fetch(
    `http://localhost:3000/api/playlist/getByOwner/${user}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const { success, message, data } = await resp.json();
  if (success) {
    return data;
  }
};
