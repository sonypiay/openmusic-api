import SongsController from "../controllers/SongsController.js";

export default [
    {
        path: '/songs',
        method: 'GET',
        handler: (request, response) => SongsController.getAll(request, response),
    },
    {
        path: '/songs',
        method: 'POST',
        handler: (request, response) => SongsController.create(request, response),
    },
    {
        path: '/songs/{id}',
        method: 'GET',
        handler: (request, response) => SongsController.getById(request, response),
    },
    {
        path: '/songs/{id}',
        method: 'PUT',
        handler: (request, response) => SongsController.update(request, response),
    },
    {
        path: '/songs/{id}',
        method: 'DELETE',
        handler: (request, response) => SongsController.delete(request, response),
    }
];