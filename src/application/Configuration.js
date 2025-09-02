export default {
    environment: process.env.NODE_ENV,
    application: {
        protocol: process.env.PROTOCOL ?? 'http',
        host: process.env.HOST ?? 'localhost',
        port: process.env.PORT ?? 5000,
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL,
    },
    jwt: {
        algorithm: process.env.JWT_ALGORITHM ?? 'HS256',
        accessToken: {
            secret: process.env.JWT_ACCESS_TOKEN_KEY,
            expiresIn: process.env.JWT_ACCESS_TOKEN_AGE ?? '1h',
        },
        refreshToken: {
            secret: process.env.JWT_REFRESH_TOKEN_KEY,
            expiresIn: process.env.JWT_REFRESH_TOKEN_AGE ?? '1h',
        },
    },
    storage: {
        type: process.env.STORAGE_TYPE ?? 'local',
        local: {
            path: process.env.STORAGE_PATH ?? 'storage',
        },
    },
}