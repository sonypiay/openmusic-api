import UserService from "../services/UserService.js";
import UserValidation from "../validation/UserValidation.js";

class UserController {
    constructor() {
        this.userService = new UserService;
        this.validate = new UserValidation;
    }

    async create(req, res) {
        const payload = this.validate.create(req.payload);
        const result = await this.userService.create(payload);

        return res.response({
            status: "success",
            ...result,
        }).code(201);
    }
}

export default new UserController;