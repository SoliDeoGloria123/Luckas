require('dotenv').config();

module.exports={
    secret: process.env.AUTH_SECRET || '123456',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h', // 24 horas
    saltRounds: process.env.SALT_ROUNDS || 8
};