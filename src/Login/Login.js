const btnRegistro = $("#btn-registrarse");
const formRegistro = $("#form-registro");
const fileInput = $("#input-profile-pic");
const btnLogin = $("#btnLogin");
const formLogin = $("#login-form");

$(document).ready(function () {
  btnRegistro.on("click", async function (e) {
    e.preventDefault();
    let formData = new FormData(formRegistro[0]);
    if (fileInput[0].files[0])
      formData.append("Imagen", await toBase64(fileInput[0].files[0]));
    else formData.append("Imagen", "");

    var object = {};
    formData.forEach((value, key) => (object[key] = value));
    var json = JSON.stringify(object);

    SignIn(json);
  });

  btnLogin.on("click", function (e) {
    e.preventDefault(e);

    let formData = new FormData(formLogin[0]);
    var object = {};
    formData.forEach((value, key) => (object[key] = value));
    var json = JSON.stringify(object);

    Login(json);
  });
});

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
