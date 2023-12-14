const { pool } = require("../../infrastructures/firestore")
const GcpBucket = require('../../infrastructures/gcpBucket')
const PredictionPythonService = require('../../services/predictionPythonService')
const { postPose, getAllPoses, getPoseById, UpdatePoseById, deletePoseById } = require("../../services/poseService")
const {areYouAdmin} = require('../../services/adminService')


class PosesHandler {
  constructor() {
    this.postPoseHandler = this.postPoseHandler.bind(this)
    this.getAllPosesHandler = this.getAllPosesHandler.bind(this)
    this.getPoseByIdHandler = this.getPoseByIdHandler.bind(this)
    this.updatePoseHandler = this.updatePoseHandler.bind(this)
    this.deletePoseByIdHandler = this.deletePoseByIdHandler.bind(this)
    this.postCheckMyPoseByIdHandler = this.postCheckMyPoseByIdHandler.bind(this)
    this._predictionPythonService =new PredictionPythonService()
    this._pool = pool
    this._gcpBucket = new GcpBucket()
  }

  async postPoseHandler (request, h) {
    try {
      const {id, title, imageUrl, category, step, time} = request.payload
      const {id:adminCredentials} = request.auth.credentials
      const isAdmin = await areYouAdmin(adminCredentials,pool)
      if(!isAdmin){
        const response = h.response({
          status: 'fail',
          message: 'you are not admin',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
      if (!id || !title || !imageUrl || !category || !step || !time) {
        const response = h.response({
          status: 'fail', 
          message: 'Not sending specific input',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
      //id using integer/number
      //gimana upload imageurlnyaa?
      if (typeof id !== "string" || typeof title !== "string" || typeof category !== "string" || typeof step !== "string" || typeof time !== "string") {
        const response = h.response({
          status: 'fail',
          message: 'Input does not meet specific datatypes',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

      const foundedPose = await getPoseById(id,this._pool)
      if(foundedPose){
        const response = h.response({
          status:"fail",
          message:"pose id is exist"
        })
        
     
        response.code(400)
        return response
      }
      const url = await this._gcpBucket.uploadImagToBucket('poses',imageUrl)

      const poseDetails = {
        id,
        title,
        imageUrl: url,
        category,
        step,
        time,
        createdAt:new Date(Date.now()).toLocaleString(),
        updatedAt:new Date(Date.now()).toLocaleString(),
      }

      const res = await postPose(poseDetails, pool)

      const response = h.response({
        status: 'success',
        pose: res,
      })
      response.header('Access-Control-ALlow-Origin', '*')
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

  async getAllPosesHandler (request, h) {
    try {
      const pose = await getAllPoses(pool)
      const response = h.response({
        status: 'success',
        pose: pose,
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

  async getPoseByIdHandler(request, h) {
    try {
      const { id } = request.params
            
      const pose = await getPoseById(id, pool)

      if (!pose) {
        const notFoundResponse = h.response({
          status: 'fail',
          message: 'Pose not found',
        })
        notFoundResponse.header('Access-Control-Allow-Origin', '*')
        notFoundResponse.code(404)
        return notFoundResponse
      }

      const successResponse = h.response({
        status: 'success',
        pose: pose,
      })
      successResponse.header('Access-Control-Allow-Origin', '*')
      successResponse.code(200)
      return successResponse
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

  async updatePoseHandler (request, h){
    const {
      title,imageUrl, category, step, time
    } = request.payload

    const {id} = request.params

    const {id:adminCredentials} = request.auth.credentials
    const isAdmin = await areYouAdmin(adminCredentials,pool)
    if(!isAdmin){
      const response = h.response({
        status: 'fail',
        message: 'you are not admin',
      })
      response.header('Access-Control-Allow-Origin', '*')
      response.code(400)
      return response
    }
    if(!id||!title||!imageUrl||!category||!step||!time){
      const response = h.response({
        status:'fail',
        mesage:'input dont have specific property'
      })
      response.code(400)
      return response
    }

    if(
      typeof id !=='string'||
      typeof title !=='string'||
        typeof step !=='string' ||
        typeof time !=='string' ||
        typeof category !=='string'
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
    
   
    const foundedPose = await getPoseById(id,this._pool)
    await this._gcpBucket.deleteFileFromBucket(foundedPose.imageUrl)
    if (imageUrl && imageUrl instanceof Buffer && imageUrl.length > 0) {
      const response = h.response({
        status:'fail',
        message:'not sending image'
      })
      response.code(400)
      return response
    }   
    const url = await this._gcpBucket.uploadImagToBucket('poses',imageUrl)
    console.log(foundedPose)
    const updatedPose={
      id:foundedPose.id,
      title:title,
      imageUrl:url,
      category:category,
      step:step,
      time:time,
      updatedAt: new Date(Date.now()).toLocaleString()
    }

    await UpdatePoseById(updatedPose,this._pool)

    const response = h.response({
      status:'success',
      pose:updatedPose
    })
    response.code(400)
    return response
  }

  async deletePoseByIdHandler(request,h){
    try {
      const { id } = request.params
      const {id:adminCredentials} = request.auth.credentials
      const isAdmin = await areYouAdmin(adminCredentials,pool)
      if(!isAdmin){
        const response = h.response({
          status: 'fail',
          message: 'you are not admin',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
      const foundedPose = await getPoseById(id,this._pool)
      await this._gcpBucket.deleteFileFromBucket(foundedPose.imageUrl)
      const pose = await deletePoseById(id, pool)

      if (!pose) {
        const notFoundResponse = h.response({
          status: 'fail',
          message: 'Pose not found',
        })
        notFoundResponse.header('Access-Control-Allow-Origin', '*')
        notFoundResponse.code(404)
        return notFoundResponse
      }

      const successResponse = h.response({
        status: 'success',
        pose: pose,
      })
      successResponse.header('Access-Control-Allow-Origin', '*')
      successResponse.code(200)
      return successResponse
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

  


  async  postCheckMyPoseByIdHandler(request, h) {
    try {
      const { id } = request.params
      const { image } = request.payload // Assuming the image is sent as part of the payload

      const pose = await getPoseById(id,pool)
     
      if (!pose) {
        const response = h.response({
          status: "fail",
          message: "pose is not found",
        })
        response.code(400)
        return response
      }

      if (!image) {
        const response = h.response({
          status: "fail",
          message: "not sending specific input",
        })
        response.code(400)
        return response
      }

      const poseName = pose.title



      const {predictedClassLabel,confidence} = await this._predictionPythonService.makePosePrediction(id,image)

      // Return the result in the response
      const response = h.response({
        status: "success",
        pose:{
          yoga_pose:predictedClassLabel,
          isCorrectPose:poseName === predictedClassLabel ? true : false,
          confidence
        }
      })
      response.code(200)
      return response
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      const response = h.response({
        status: "fail",
        message: "server error",
      })
      response.code(500)
      return response
    }
  }
}

module.exports = PosesHandler