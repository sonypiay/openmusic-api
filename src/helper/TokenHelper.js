import jwt from 'jsonwebtoken';
import Logging from "../application/Logging.js";
import BadRequestException from "../exception/BadRequestException.js";
import Configuration from "../application/Configuration.js";

class TokenHelper {
    payload = undefined;

    constructor() {
        this.algorithm = Configuration.jwt.algorithm;
    }

    generateToken(key, expiry) {
        if( ! this.getPayload() ) throw new BadRequestException('Payload is required');

        return jwt.sign(this.getPayload(), key, {
            algorithm: this.algorithm,
            expiresIn: expiry,
        });
    }

    setPayload(payload) {
        this.payload = payload;
    }

    getPayload() {
        return this.payload;
    }

    getAccessToken() {
        return this.generateToken(
            Configuration.jwt.accessToken.secret,
            Configuration.jwt.accessToken.expiresIn,
        );
    }

    getRefreshToken() {
        return this.generateToken(
            Configuration.jwt.refreshToken.secret,
            Configuration.jwt.refreshToken.expiresIn,
        );
    }

    getDecodedPayload(token) {
        return jwt.decode(token);
    }

    verifyToken(token, type = 'access') {
        if( ! token ) throw new BadRequestException("Token is required");

        const key = type === 'access'
            ? Configuration.jwt.accessToken.secret
            : Configuration.jwt.refreshToken.secret;

        try {
            jwt.verify(token, key);
            return this.getDecodedPayload(token);
        } catch (error) {
            Logging.error(error.message);

            throw new BadRequestException("Invalid token!");
        }
    }
}

export default TokenHelper;