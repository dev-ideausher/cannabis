const AWS = require('aws-sdk')
const config = require('../helper/config').get(process.env.NODE_ENV)

const s3 = new AWS.S3({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
})

const uploadFile = (filename, bucketname, file,ContentType) => {
    
    return new Promise((resolve, reject) => {
        const params = {
            Key: filename,
            Bucket: bucketname,
            Body: file,
            ContentType: ContentType,  //'audio/mpeg',
            ACL: 'public-read'
        }

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.Location)
            }
        })
    })
}

module.exports = uploadFile