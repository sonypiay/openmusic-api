import Configuration from "../application/Configuration.js";

class StorageHelper {
    constructor() {
        this.rootDirectory = Configuration.storage.local.path;
    }

    url(file) {
        if( !file ) return null;

        const protocol = Configuration.application.protocol;
        const host = Configuration.application.host;
        const port = Configuration.application.port;
        let url = `${protocol}://${host}`;

        if( port !== 80 ) url += `:${port}/${this.rootDirectory}`;
        return `${url}/${file}`;
    }
}

export default StorageHelper;