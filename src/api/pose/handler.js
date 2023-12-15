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
    this.addPoseDetail = this.addPoseDetail.bind(this)
    this.updatePoseDetail = this.updatePoseDetail.bind(this)
    this.deletePoseDetail = this.deletePoseDetail.bind(this)
    this._predictionPythonService =new PredictionPythonService()
    this._pool = pool
    this._gcpBucket = new GcpBucket()
  }

  async postPoseHandler (request, h) {
    try {
      const {id, title, imageUrl, category} = request.payload
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
      if (!id || !title || !imageUrl || !category ) {
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
      if (typeof id !== "string" || typeof title !== "string" || typeof category !== "string" ) {
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
        createdAt:new Date(Date.now()).toLocaleString(),
        updatedAt:new Date(Date.now()).toLocaleString(),
        detail:[]
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



  async addPoseDetail(request, h) {
    try {
      const { step, time, image } = request.payload
      const { id } = request.params
      const { id: adminCredentials } = request.auth.credentials
      const isAdmin = await areYouAdmin(adminCredentials, pool)
  
      if (!isAdmin) {
        const response = h.response({
          status: 'fail',
          message: 'You are not an admin',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      if (!id || !time || !image) {
        const response = h.response({
          status: 'fail',
          message: 'Not sending specific input',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      if (typeof id !== 'string' || typeof step !== 'string' || typeof time !== 'string') {
        const response = h.response({
          status: 'fail',
          message: 'Input does not meet specific datatypes',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      const foundedPose = await getPoseById(id, this._pool)
  
      if (!foundedPose) {
        const response = h.response({
          status: 'fail',
          message: 'Pose is not found',
        })
        response.code(400)
        return response
      }
  
      const url = await this._gcpBucket.uploadImagToBucket('step', image)
  
      let detail = {
        stepId: `step-${Math.random()}`,
        step,
        time,
        image: url,
      }
  
      let uploadedDetail = []
  
      if (foundedPose.detail && foundedPose.detail.length > 0) {
        uploadedDetail = [...foundedPose.detail]
        uploadedDetail.push(detail)
      } else {
        uploadedDetail.push(detail)
      }
  
      const poseDetails = {
        ...foundedPose,
        detail: uploadedDetail,
      }
  
      await UpdatePoseById(poseDetails, pool)
  
      const response = h.response({
        status: 'success',
        pose: poseDetails,
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


  async updatePoseDetail(request, h) {
    try {
      const { step, time, image } = request.payload
      const { poseId, stepId } = request.params
      const { id: adminCredentials } = request.auth.credentials
      const isAdmin = await areYouAdmin(adminCredentials, pool)
  
      if (!isAdmin) {
        const response = h.response({
          status: 'fail',
          message: 'You are not an admin',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      if (!poseId || !stepId || !step || !time || !image) {
        const response = h.response({
          status: 'fail',
          message: 'Not sending specific input',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      if (
        typeof poseId !== 'string' ||
        typeof stepId !== 'string' || // Fix the variable name from detailId to stepId
        typeof step !== 'string' ||
        typeof time !== 'string'
      ) {
        const response = h.response({
          status: 'fail',
          message: 'Input does not meet specific datatypes',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      const foundedPose = await getPoseById(poseId, this._pool)
  
      if (!foundedPose) {
        const response = h.response({
          status: 'fail',
          message: 'Pose is not found',
        })
        response.code(400)
        return response
      }
  
      const existingDetail = foundedPose.detail.find((item) => item.stepId === stepId)
  
      if (!existingDetail) {
        const response = h.response({
          status: 'fail',
          message: 'Detail is not found',
        })
        response.code(400)
        return response
      }
  
      // Delete the existing image associated with the step
      await this._gcpBucket.deleteFileFromBucket(existingDetail.image)
  
      // Upload the new image
      const newImageUrl = await this._gcpBucket.uploadImagToBucket('step', image)
  
      const updatedDetail = {
        stepId,
        step,
        time,
        image: newImageUrl,
      }
  
      const updatedDetails = foundedPose.detail.map((item) =>
        item.stepId === stepId ? updatedDetail : item
      )
  
      const poseDetails = {
        ...foundedPose,
        detail: updatedDetails,
      }
  
      const res = await UpdatePoseById(poseDetails, pool)
  
      const response = h.response({
        status: 'success',
        pose: res,
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
  
  
  async deletePoseDetail(request, h) {
    try {
      const { poseId, stepId } = request.params
      const { id: adminCredentials } = request.auth.credentials
      const isAdmin = await areYouAdmin(adminCredentials, pool)
  
      if (!isAdmin) {
        const response = h.response({
          status: 'fail',
          message: 'You are not an admin',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      if (!poseId || !stepId) {
        const response = h.response({
          status: 'fail',
          message: 'Not sending specific input',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      if (typeof poseId !== 'string' || typeof stepId !== 'string') {
        const response = h.response({
          status: 'fail',
          message: 'Input does not meet specific datatypes',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      const foundedPose = await getPoseById(poseId, this._pool)
  
      if (!foundedPose) {
        const response = h.response({
          status: 'fail',
          message: 'Pose is not found',
        })
        response.code(400)
        return response
      }
  
      const existingDetail = foundedPose.detail.find((item) => item.stepId === stepId)
  
      if (!existingDetail) {
        const response = h.response({
          status: 'fail',
          message: 'Detail is not found',
        })
        response.code(400)
        return response
      }
  
      // Delete the existing image associated with the step
      await this._gcpBucket.deleteFileFromBucket(existingDetail.image)
  
      // Filter out the deleted detail
      const updatedDetails = foundedPose.detail.filter((item) => item.stepId !== stepId)
  
      const poseDetails = {
        ...foundedPose,
        detail: updatedDetails,
      }
  
      const res = await UpdatePoseById(poseDetails, pool)
  
      const response = h.response({
        status: 'success',
        pose: res,
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
      title,imageUrl, category
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
    if(!id||!title||!imageUrl||!category){
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
    const updatedPose={
      id:foundedPose.id,
      title:title,
      imageUrl:url,
      category:category,
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

  async deletePoseByIdHandler(request, h) {
    try {
      const { id } = request.params
      const { id: adminCredentials } = request.auth.credentials
      const isAdmin = await areYouAdmin(adminCredentials, pool)
  
      if (!isAdmin) {
        const response = h.response({
          status: 'fail',
          message: 'You are not an admin',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      const foundedPose = await getPoseById(id, this._pool)
  
      if (!foundedPose) {
        const notFoundResponse = h.response({
          status: 'fail',
          message: 'Pose not found',
        })
        notFoundResponse.header('Access-Control-Allow-Origin', '*')
        notFoundResponse.code(404)
        return notFoundResponse
      }
  
      // Delete all images associated with the details
      for (const detail of foundedPose.detail) {
        await this._gcpBucket.deleteFileFromBucket(detail.image)
      }
  
      // Delete the main image
      await this._gcpBucket.deleteFileFromBucket(foundedPose.imageUrl)
  
      const pose = await deletePoseById(id, pool)
  
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