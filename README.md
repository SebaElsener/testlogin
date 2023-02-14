# Login por formulario

Se modificó el desafío de *mocks y normalización* para agregar un login sencillo por formulario, con persistencia de session en *MongoDB*

## Ruta /login
La app comienza en esta ruta, presentando el form de logueo.  Luego redirige a */home*, que renderiza index.hbs.  A través del middleware *userLoginWatcher* se controla si expiró o cerró la session, en tal caso redirige a */timeout.hbs* que muestra un mensaje y en dos segundos redirige a */login*

## Ruta /logout
El cliente es redireccionado a esta ruta luego de hacer click en el botón logout, y luego de dos segundos es redirigido a */login*