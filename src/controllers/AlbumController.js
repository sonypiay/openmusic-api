import AlbumService from "../services/AlbumService.js";
import AlbumValidation from "../validation/AlbumValidation.js";

class AlbumController {
    async getById (req, res){
        const { id } = req.params;

        const result = await AlbumService.getById(id);

        return res.response({
            status: "success",
            ...result,
        }).code(200);
    }

    async create (req, res) {
        const payload = AlbumValidation.createOrUpdate(req.payload);
        const result = await AlbumService.create(payload);

        return res.response({
            status: "success",
            ...result,
        }).code(201);
    }

    async update (req, res) {
        const { id } = req.params;
        const payload = AlbumValidation.createOrUpdate(req.payload);
        const result = await AlbumService.update(id, payload);

        return res.response({
            status: "success",
            ...result,
        }).code(200);
    }

    async delete (req, res) {
        const { id } = req.params;
        const result = await AlbumService.delete(id);

        return res.response({
            status: "success",
            ...result,
        });
    }
}

export default new AlbumController;