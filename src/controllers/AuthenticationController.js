import UserValidation from "../validation/UserValidation.js";
import AuthService from "../services/AuthService.js";

class AuthenticationController {
    constructor() {
        this.authService = new AuthService;
        this.validate = new UserValidation;
    }

    async login(req, res) {
        const { username, password } = this.validate.login(req.payload);
        const userToken = await this.authService.login(username, password);

        return res.response({
            status: "success",
            ...userToken,
        }).code(201);
    }

    async updateToken(req, res) {
        const { refreshToken } = this.validate.hasToken(req.payload);
        const userToken = await this.authService.updateToken(refreshToken);

        return res.response({
            status: "success",
            ...userToken,
        });
    }

    async logout(req, res) {
        const { refreshToken } = this.validate.hasToken(req.payload);
        await this.authService.logout(refreshToken);

        return res.response({
            status: "success",
            message: "Logout successfully",
        });
    }
}

export default new AuthenticationController;