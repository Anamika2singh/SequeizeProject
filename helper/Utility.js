require('dotenv').config()
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
var fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    region: process.env.AWS_S3_REGION

});

exports.hashPassword = (myPlaintextPassword) => {
    return bcrypt.hashSync(myPlaintextPassword, saltRounds);

}

exports.compareHashPassword = (myPlaintextPassword, hash) => {
    return bcrypt.compareSync(myPlaintextPassword, hash);
}

exports.generateToken = (data) => {
    return jwt.sign(data, process.env.PASSPORT_KEY, {expiresIn: process.env.JWT_TIMEOUT_DURATION});
}

exports.uploadFile = (path, fileName, content_type, bucket) => {
    return new Promise(function (resolve, reject) {
        const fileContent = fs.readFileSync(path + fileName);
        const readStream = fs.createReadStream(path + fileName);
        // Setting up S3 upload parameters
        // Uploading files to the bucket

        var response = {};
        const params = {
            Bucket: bucket,
            Key: fileName,
            Body: readStream,
            ContentType: content_type
        };

        s3.upload(params, async function (err, data) {
            readStream.destroy();
            if (err) {
                console.log(err)
                response = {
                    message: 'error',
                    data: err
                }
            }

            if (data) {
                // console.log(data)
                fs.unlink(path + fileName, function (err) {
                    if (err) {
                        response = {
                            message: 'error',
                            data: err
                        }
                        reject(response);
                    } else {
                        //  console.log(`File uploaded successfully. ${data.Location}`);
                        response = {
                            message: 'success',
                            data: data.Location
                        }
                        resolve(response);
                    }
                });
            }
        });
    });
};

exports.deleteS3File = (fileName, bucket_name) => {
    return new Promise(function (resolve, reject) {
        var response = {};
        const params = {
            Bucket: bucket_name,
            Key: fileName,
        };
        //console.log(params);
        s3.deleteObject(params, function (err, data) {
            if (err) {
                response = {
                    message: 'error',
                    data: err
                }
                reject(response);
            }
            response = {
                message: "Deleted Successfully.",
                data: fileName
            }
            resolve(response);
        });
    });
};

