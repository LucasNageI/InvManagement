carpetas de src:

    -config: se encarga de la logica de las variables de entorno y conexion a base de datos
    -controllers: es el archivo donde se procesan solicitudes, se ejecuta la logica de negocio y se envian respuestas
    -errors: manejo de errores del proyecto
    -helpers: funciones que facilitan el desarrollo de la aplicacion
    -middlewares: son verificaciones que se hacen antes de que la consulta llegue al controller, verifican cosas como el token, los roles, etc
    -models: crea el modelo o Schema de mongo para saber que datos se necesitan en el programa
    -repositories: funciones basicas de la base de datos: create, update, get all, get by id, delete
    -routes: a cada ruta le asigna un controller y/o un middleware
    
    -server.js: es el archivo que inicia el servidor