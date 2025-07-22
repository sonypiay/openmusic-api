import hapi from '@hapi/hapi';

const server = hapi.server({
    port: 3000,
    host: 'localhost'
});

await server.start();
console.log('Server running on %s', server.info.uri);