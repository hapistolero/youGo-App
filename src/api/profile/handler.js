
const { getUserById,UpdateUserById,getUserProfileById,pool} = require('../../services/profileServices')
const getUserBmi = require('../../services/bmiService')
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
      imageUrl,
      firstName,
      lastName,
      email,
      age,
      weight,
      height } = request.payload
    const {id:credentialId} = request.auth.credentials
    
    if(!id||!imageUrl||!firstName||!lastName||!email||!age||!weight||!height){
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

    const url = await this._gcpBucket.uploadImagToBucket('profile',imageUrl)
    const userData = await getUserById(credentialId,this._pool)
    const {bmi,status,idealWeight} = getUserBmi(height,weight)
    const updatedUserData={
      ...userData,
      profile: {
        id,
        imageUrl: url,
        firstName,
        lastName,
        age:Number(age),
        weight:Number(weight),
        height:Number(height),
        bmi:bmi,
        status:status,
        idealWeightRange:idealWeight
      },
    }

    const data = await UpdateUserById(updatedUserData,this._pool)

    const response = h.response({
      status:'success',
      userProfile:data
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
        userProfile:users,
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
      imageUrl,
      firstName,
      lastName,
      age,
      email,
      weight,
      height } = request.payload
    const {id:credentialId} = request.auth.credentials
    
    if(!id||!imageUrl||!firstName||!lastName||!email||!age||!weight||!height){
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
    if(userData.profile.imageUrl !==''){
      await this._gcpBucket.deleteFileFromBucket(userData?.profile.imageUrl)
    }
    
    if (imageUrl.hapi.filename !== '') {
      url = await this._gcpBucket.uploadImagToBucket('profile', imageUrl) 
    }
    
    const {bmi,status,idealWeight} = getUserBmi(height,weight)
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
        bmi:bmi,
        status,
        idealWeightRange:idealWeight
      },
    }

    await UpdateUserById(updatedUserData,this._pool)

    const responseUpdateUser ={
      id:userData.id,
      email:userData.email,
      profile: {
        id,
        imageUrl: url,
        firstName,
        lastName,
        age,
        weight,
        height,
        bmi:bmi,
        status,
        idealWeightRange:idealWeight
      },
    }
    const response = h.response({
      status:'success',
      updatedUserProfile:responseUpdateUser
    })
    response.code(200)
    return response
  }
}

module.exports = ProfileHandler