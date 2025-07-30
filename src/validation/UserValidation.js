import Validation from "./Validation.js";
import Joi from "joi";

class UserValidation extends Validation {
    create(request) {
        const schema = Joi.object({
            username: Joi.string().max(100).required(),
            password: Joi.string().max(100).required(),
            fullname: Joi.string().max(100),
        }) ;

        return this.validate(schema, request);
    }

    login(request) {
        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        });

        return this.validate(schema, request);
    }

    hasToken(request) {
        const schema = Joi.object({
            refreshToken: Joi.string().required(),
        });

        return this.validate(schema, request);
    }
}

export default UserValidation;