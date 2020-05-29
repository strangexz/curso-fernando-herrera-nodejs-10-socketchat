// Comando para establecer la conexión
var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala'),
}

/* Conectandonos al servidor */
socket.on('connect', function () {
    console.log('Usuario conectado al server');

    socket.emit('entrarChat', usuario, function (resp) {
        console.log('Usuarios conectados', resp);
        redenderizarUsuarios(resp);
        scrollBottom();
    });
});

socket.on('disconnect', function (data) {
    console.log('Perdimos conexión con el servidor');

    // socket.emit('entrarChat', {usuario: 'Alberto'});
});

/* Escuchar información */
socket.on('crearMensaje', function (mensaje) {
    // console.log('Servidor:', mensaje);
    renderizarMensjar(mensaje, false);
});

/*  
    Escuchar cambios de usuarios
    cuando un usuario entra o sale del chat
*/
socket.on('listarPersonas', function (personas) {
    console.log(personas);
    redenderizarUsuarios(personas);
});

/* Mensajes privados */
socket.on('mensajePrivado', function (mensaje) {
    console.log('Mensaje privado: ', mensaje);
});