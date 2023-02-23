# Inicio de sesión

Se modificó el desafío de *login por formulario* agregando un form de registro, con persistencia de session en *MongoDB*

## Ruta /register
La app comienza en esta ruta, presentando el form de registro, donde se pide email y crear una contraseña, que queda encriptada usando la librería *bcrypt*.  En caso de ser exitoso redirige a */successreg* que muestra mensaje de éxito en el registro y un link a */login*

## Ruta /login
El acceso se controla con *passport local*.  En caso de logueo exitoso redirige a */home*, que renderiza los productos y centro de mensajes.  A través del middleware *userLoginWatcher* se controla si expiró o cerró la session (tiempo de 10 minutos, recargable con cada visita), en tal caso redirige a */timeout.hbs* que muestra un mensaje y en dos segundos redirige a */login*

## Ruta /logout
El cliente es redireccionado a esta ruta luego de hacer click en el botón logout, y luego de dos segundos es redirigido a */login*

## Rutas /failreg y /faillogin
son renderizadas en caso de fallo en registro o acceso login