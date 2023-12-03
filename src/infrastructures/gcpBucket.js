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

  async  deleteFileFromBucket(fileUrl) {
    try {
      const { Storage } = require('@google-cloud/storage')
      const storage = new Storage()
  
      const urlParts = fileUrl.split('/')
      const bucketName = urlParts[3] // Extract bucket name from URL
      const filePath = urlParts.slice(4).join('/')
  
      const file = storage.bucket(bucketName).file(filePath)
  
      await file.delete()
      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      return false
    }
  
  
  }
}
module.exports = GcpBucket 