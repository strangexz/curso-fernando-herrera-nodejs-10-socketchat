const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            });
        }

        client.join(data.sala);

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listarPersonas', usuarios.getPersonasPorSala());

        callback(usuarios.getPersonasPorSala(data.sala));

    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.data).emit('crearMensaje', mensaje);
    });

    client.on('disconnect', function () {
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada).emit('crearMensaje', crearMensaje('Administrdor', `${personaBorrada.nombre} salió`));
        client.broadcast.to(personaBorrada).emit('listarPersonas', usuarios.getPersonasPorSala());
    });

    client.on('mensajePrivado', (data) => {
        
        if (!data.para) {
            return callback({
                error: true,
                mensaje: 'El ID es necesario'
            });
        }

        if (!data.mensaje) {
            return callback({
                error: true,
                mensaje: 'El mensaje es necesario'
            });
        }

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});