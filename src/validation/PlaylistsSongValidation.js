import Validation from "./Validation.js";
import Joi from "joi";

class PlaylistsSongValidation extends Validation {
    addOrDelete(request) {
        const schema = Joi.object({
            songId: Joi.string().required(),
        });

        return this.validate(schema, request);
    }
}

export default PlaylistsSongValidation;