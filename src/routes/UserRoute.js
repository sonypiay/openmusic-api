import UserController from "../controllers/UserController.js";

export const UserRoute = [
    {
        path: '/users',
        method: 'POST',
        handler: (request, response) => UserController.create(request, response),
    }
];