function SignIn(inputData) {
  $.ajax({
    type: "POST",
    url: "https://kartpinchoapi.onrender.com/api/usuarios/registro",
    data: inputData,
    dataType: "json",
    contentType: "application/json",
  })
    .done(({ success, message, data }) => {
      console.log(data);
      Swal.fire({
        icon: "success",
        title: "Registro",
        text: "Usuario registrado con Exito.",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("UsuarioLog", data._id);
          window.location.href = "../MenuInicio/Inicio.html";
        }
      });
    })
    .fail((data) => {
      Swal.fire({
        icon: "error",
        text: data.responseJSON.message,
        title: "Registro",
      });
    });
}

function Login(inputForm) {
  $.ajax({
    type: "POST",
    url: "https://kartpinchoapi.onrender.com/api/usuarios/login",
    data: inputForm,
    dataType: "json",
    contentType: "application/json",
  })
    .done(({ success, message, data }) => {
      console.log(data);
      Swal.fire({
        icon: "success",
        title: "Inicio de Sesión",
        text: "Inicio de Sesión Correcto.",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("UsuarioLog", data._id);
          window.location.href = "../MenuInicio/Inicio.html";
        }
      });
    })
    .fail((err) => {
      Swal.fire({
        icon: "error",
        title: "Inicio de Sesión",
        text: err.responseJSON.message,
      });
    });
}
