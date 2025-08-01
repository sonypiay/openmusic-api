import AuthenticationController from "../controllers/AuthenticationController.js";

export default [
    {
        path: '/authentications',
        method: 'POST',
        handler: (request, response) => AuthenticationController.login(request, response),
    },
    {
        path: '/authentications',
        method: 'PUT',
        handler: (request, response) => AuthenticationController.updateToken(request, response),
    },
    {
        path: '/authentications',
        method: 'DELETE',
        handler: (request, response) => AuthenticationController.logout(request, response),
    }
];