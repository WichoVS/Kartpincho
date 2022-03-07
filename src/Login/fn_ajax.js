function SignIn(inputData)
{
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/api/usuarios/registro",
        data: inputData,
        dataType: "json",
        contentType: "application/json"
      }).done(function(data)
      {
        alert("Success! uwu");
        window.open("../Juego/Juego.html");
      })
      .fail(function()
      {
        alert("Fail unu");
      });
}

function Login(inputForm)
{
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/api/usuarios/login",
    data: inputForm,
    dataType: "json",
    contentType: "application/json"
  }).done(function(data)
  {
    console.log(data);
    const credentials = JSON.parse(inputForm);
    if(data)
      if(credentials.Password == data.data.Password)
      {
        alert("Logged! uwu");
        window.open("../Juego/Juego.html");
      }
  })
  .fail(function()
  {
    alert("Fail unu");
  });
}

