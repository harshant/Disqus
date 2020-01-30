// config file to use environment variables

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    api_endpoint: process.env.API_URL,
    jwt_secret: process.env.JWT_SECRET,
    hasura_key: process.env.HASURA_KEY
};
