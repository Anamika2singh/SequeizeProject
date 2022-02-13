require('dotenv').config(); // this is important!
module.exports = {
    "development": {
        "username": process.env.AWS_RDS_USERNAME,
        "password": process.env.AWS_RDS_PASSWORD,
        "database": process.env.AWS_DATABASE_NAME,
        "host":     process.env.AWS_RDS_HOSTNAME,
        "dialect":  "mysql",
        "logging":  false
    },
    "test": {
        "username": process.env.AWS_RDS_USERNAME,
        "password": process.env.AWS_RDS_PASSWORD,
        "database": process.env.AWS_DATABASE_NAME,
        "host":     process.env.AWS_RDS_HOSTNAME,
        "dialect": "mysql"
    },
    "production": {
        "username": process.env.AWS_RDS_USERNAME,
        "password": process.env.AWS_RDS_PASSWORD,
        "database": process.env.AWS_DATABASE_NAME,
        "host":     process.env.AWS_RDS_HOSTNAME,
        "dialect":  "mysql"
    }
};
