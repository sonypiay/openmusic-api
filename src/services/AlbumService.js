class AlbumService {
    async getById (id) {
        return {
            service: 'getById',
            data: id
        };
     }

     async create (data) {
        return {
            data: {
                album: data,
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