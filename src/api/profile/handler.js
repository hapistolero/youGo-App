
const { getUserById,UpdateUserById,getUserProfileById,pool} = require('../../services/profileServices')
const GcpBucket = require('../../infrastructures/gcpBucket')

class ProfileHandler{
  constructor(){
    this.postProfileData = this.postProfileData.bind(this)
    this.getAllUserProfileById = this.getAllUserProfileById.bind(this)
    this.updatedUserProfileById = this.updatedUserProfileById.bind(this)
    this._gcpBucket = new GcpBucket()
    this._pool = pool
  }

  async postProfileData(request,h){
    const {id,
      file,
      firstName,
      lastName,
      email,
      age,
      weight,
      height } = request.payload
    const {id:credentialId} = request.auth.credentials
    
    if(!id||!file||!firstName||!lastName||!email||!age||!weight||!height){
      const response = h.response({
        status:'fail',
        mesage:'input dont have specific property'
      })
      response.code(400)
      return response
    }

    if(
      typeof id !=='string'||
        typeof firstName !=='string' ||
        typeof lastName !=='string' ||
        typeof email !=='string' ||
        typeof age !=='string' ||
        typeof weight !== 'string'||
        typeof height !== 'string'
    ){
      const response = h.response({
        status:'fail',
        message:'not meet specific datatypes'
      })
      response.code(400)
      return response
    }

    const url = await this._gcpBucket.uploadImagToBucket('profile',file)
    
    const userData = await getUserById(credentialId,this._pool)
    const updatedUserData={
      ...userData,
      profile: {
        id,
        imageUrl: url,
        firstName,
        lastName,
        age,
        weight,
        height,
      },
    }

    const data = await UpdateUserById(updatedUserData,this._pool)

    const response = h.response({
      status:'success',
      message:data
    })
    response.code(400)
    return response


  }

  
  async getAllUserProfileById (request, h){

    try {
      const{id:userCredentialId} = request.auth.credentials
      
      const users = await getUserProfileById(userCredentialId,pool)
      const response = h.response({
        status: 'success',
        data:users,
      })
      response.header('Access-Control-Allow-Origin', '*')
      response.code(200)
      return response
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      })
      response.header('Access-Control-Allow-Origin', '*')
      response.code(500)
      return response
    }
      
  }

  async updatedUserProfileById (request, h){

    const {id,
      file,
      firstName,
      lastName,
      email,
      age,
      weight,
      height } = request.payload
    const {id:credentialId} = request.auth.credentials
    
    if(!id||!file||!firstName||!lastName||!email||!age||!weight||!height){
      const response = h.response({
        status:'fail',
        mesage:'input dont have specific property'
      })
      response.code(400)
      return response
    }

    if(
      typeof id !=='string'||
        typeof firstName !=='string' ||
        typeof lastName !=='string' ||
        typeof email !=='string' ||
        typeof age !=='string' ||
        typeof weight !== 'string'||
        typeof height !== 'string'
    ){
      const response = h.response({
        status:'fail',
        message:'not meet specific datatypes'
      })
      response.code(400)
      return response
    }
    // dia update tapi cuman hapus profile nya
    // 1.di kirim payload kosong
    // 2. kalo sebelumnya  dia punya imageUrl harus di check terus dihapus
    
    let url = ''
    const userData = await getUserById(credentialId,this._pool)
    if(userData.imageUrl){
      await this._gcpBucket.deleteFileFromBucket(userData?.profile.imageUrl)
      
    }
    
    if (file && file instanceof Buffer && file.length > 0) {
      url = await this._gcpBucket.uploadImagToBucket('profile',file)
    }   
   
    const updatedUserData={
      ...userData,
      profile: {
        id,
        imageUrl: url,
        firstName,
        lastName,
        age,
        weight,
        height,
      },
    }

    const data = await UpdateUserById(updatedUserData,this._pool)

    const response = h.response({
      status:'success',
      message:data
    })
    response.code(400)
    return response
  }
}

module.exports = ProfileHandler