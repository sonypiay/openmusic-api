import AlbumController from "../controllers/AlbumController.js";

export default [
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
    },
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: (request, response) => AlbumController.uploadCover(request, response),
        options: {
            payload: {
                output: 'stream',
                parse: true,
                multipart: true,
            },
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: (request, response) => AlbumController.getLikesCount(request, response),
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: (request, response) => AlbumController.addLike(request, response),
        options: {
            auth: 'token',
        },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: (request, response) => AlbumController.removeLike(request, response),
        options: {
            auth: 'token',
        },
    },
]