const { Storage } = require('@google-cloud/storage')
class GcpBucket{
  constructor(){
    this._storage = new Storage({
      projectId: 'serene-sentinel-401201', // Replace with your Google Cloud Project ID
      keyFilename: 'credentials.json', // Replace with the path to your service account key file
    })
  }

  async uploadImagToBucket(folder,file){
    // Handle file upload to Google Cloud Storage
    const bucketName = 'yoga-app-bucket-test' // Replace with your Google Cloud Storage bucket name
    const fileName = `${folder}/${Math.random()}` // Adjust the file path as needed

    const fileStream = this._storage.bucket(bucketName).file(fileName).createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.hapi.headers['content-type'],
      },
    })

    file.on('data', (chunk) => {
      fileStream.write(chunk)
    })

    file.on('end', async () => {
      fileStream.end()
    })
    const imageUrl =`https://storage.googleapis.com/${bucketName}/${fileName}`
    return imageUrl
  }
}

module.exports = GcpBucket 