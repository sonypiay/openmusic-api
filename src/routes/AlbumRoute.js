import AlbumController from "../controllers/AlbumController.js";

export const AlbumRoute = [
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: (request, response) => AlbumController.getById(request, response)
    },
    {
        method: 'POST',
        path: '/albums',
        handler: (request, response) => AlbumController.create(request, response),
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: (request, response) => AlbumController.update(request, response),
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: (request, response) => AlbumController.delete(request, response),
    }
]