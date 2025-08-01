import UnauthorizedException from "../exception/UnauthorizedException.js";
import TokenHelper from "../helper/TokenHelper.js";

const TokenMiddleware = () => {
    return {
        authenticate: (request, response) => {
            const authorization = request.headers.authorization ?? '';

            if( authorization === '' ) {
                throw new UnauthorizedException('Unauthorized');
            }

            const token = authorization.replace('Bearer ', '');
            const tokenHelper = new TokenHelper;

            try {
                const users = tokenHelper.verifyToken(token, 'access');

                return response.authenticated({
                    credentials: users
                });
            } catch (error) {
                throw new UnauthorizedException(error.message);
            }
        }
    }
};

export default TokenMiddleware;