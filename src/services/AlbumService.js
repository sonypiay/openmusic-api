import { v4 as uuidv4 } from 'uuid';
import AlbumRepository from "../repositories/AlbumRepository.js";

class AlbumService {
    async getById (id) {
        return {
            service: 'getById',
            data: id
        };
     }

     async create (data) {
        data.id = uuidv4();

        const result = await AlbumRepository.create(data);

        return {
            data: {
                albumId: result,
            },
        };
     }

     async update (id, data) {
        return {
            id,
            ...data,
        };
     }

     async delete (id) {
        return {
            data: id,
        };
     }
}

export default new AlbumService;