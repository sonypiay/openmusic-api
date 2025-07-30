import Validation from "./Validation.js";
import Joi from "joi";

class PlaylistsValidation extends Validation {
    create(request) {
        const schema = Joi.object({
            name: Joi.string().max(100).required(),
        });

        return this.validate(schema, request);
    }
}

export default PlaylistsValidation;