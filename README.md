# Mocks y normalización

## Ruta localhost/api/productos-test
Esta ruta genera 5 productos al azar utilizando [*faker.js*](https://fakerjs.dev/)

## Formato mensajes
Se modificó el formato según la plantilla:

```
{ 
    author: {
        id: 'mail del usuario', 
        nombre: 'nombre del usuario', 
        apellido: 'apellido del usuario', 
        edad: 'edad del usuario', 
        alias: 'alias del usuario',
        avatar: 'url avatar (foto, logo) del usuario'
    },
    text: 'mensaje del usuario'
}
```
## Normalización de mensajes
El server entrega los mensajes obtenidos desde *MongoDB Atlas* normalizados haciendo uso de [*Normalizr*](https://github.com/paularmstrong/normalizr)

## Observaciones
Se dejan en la base de datos algunos productos y mensajes a modo de prueba