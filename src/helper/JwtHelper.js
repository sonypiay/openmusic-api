import Jwt from '@hapi/jwt';
import UnauthorizedException from "../exception/UnauthorizedException.js";
import ResponseException from "../exception/ResponseException.js";
import Logging from "../application/Logging.js";

class JwtHelper {
    payload = undefined;

    constructor() {
        this.algorithm = process.env.JWT_ALGORITHM ?? 'HS256';
    }

    generateToken(key, expiry) {
        if( ! this.getPayload() ) throw new ResponseException(400, 'fail', 'Payload is required');

        return Jwt.token.generate(
            this.getPayload(),
            this.getKey(key),
            expiry
        );
    }

    setPayload(payload) {
        this.payload = payload;
    }

    getPayload() {
        return this.payload;
    }

    getAccessToken() {
        return this.generateToken(process.env.JWT_ACCESS_TOKEN_KEY,{
            ttlSec: process.env.JWT_ACCESS_TOKEN_AGE,
        });
    }

    getRefreshToken() {
        return this.generateToken(process.env.JWT_REFRESH_TOKEN_KEY,{
            ttlSec: process.env.JWT_REFRESH_TOKEN_AGE,
        });
    }

    getKey(key) {
        return {
            key: key,
            algorithm: this.algorithm,
        };
    }

    getDecodedPayload(token) {
        return Jwt.token.decode(token);
    }

    verifyToken(token) {
        try {
            const decoded = this.getDecodedPayload(token);
            Jwt.token.verify(decoded, this.getKey())

            return decoded.token;
        } catch (error) {
            Logging.error(error.message);
            throw new UnauthorizedException("Unauthorized access");
        }
    }
}

export default JwtHelper;