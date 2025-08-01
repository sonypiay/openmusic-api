import UserController from "../controllers/UserController.js";

export default [
    {
        path: '/users',
        method: 'POST',
        handler: (request, response) => UserController.create(request, response),
    }
];