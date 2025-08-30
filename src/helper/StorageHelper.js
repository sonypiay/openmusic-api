import Configuration from "../application/Configuration.js";
import path from "node:path";
import * as fs from "node:fs";

class StorageHelper {
    constructor() {
        this.rootDirectory = Configuration.storage.local.path;
    }

    /**
     * Get file url
     * @param file
     * @returns {string|null}
     */
    url(file) {
        if( !file ) return null;

        const protocol = Configuration.application.protocol;
        const host = Configuration.application.host;
        const port = Configuration.application.port;
        let url = `${protocol}://${host}`;

        if( port !== 80 ) url += `:${port}/${this.rootDirectory}`;
        return `${url}/${file}`;
    }

    /**
     * Make directory
     * @param directory
     * @returns {void}
     */
    makeDirectory(directory) {
        const directoryPath = path.join(this.rootDirectory, directory);
        const isDirectory = fs.lstatSync(directoryPath).isDirectory();
        if( isDirectory ) return;

        if( ! fs.existsSync(directoryPath) ) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
    }

    /**
     * Store file
     *
     * @param directory
     * @param file
     * @param name
     * @returns {void}
     */
    store(directory, file, name) {
        if( file ) {
            this.makeDirectory(directory);

            const filePath = path.join(this.rootDirectory, directory, name ?? file.hapi.filename);
            fs.writeFileSync(filePath, file._data);
        }
    }

    /**
     * Delete file
     * @param file
     * @returns {void}
     */
    delete(file) {
        if( this.exists(file) ) fs.unlinkSync(path.join(this.rootDirectory, file));
    }

    /**
     * Check file exists
     *
     * @param file
     * @returns {boolean}
     */
    exists(file) {
        return fs.existsSync(path.join(this.rootDirectory, file));
    }
}

export default StorageHelper;