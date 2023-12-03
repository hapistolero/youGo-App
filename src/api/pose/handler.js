const { pool } = require("../../infrastructures/firestore")
const GcpBucket = require('../../infrastructures/gcpBucket')
const { postPose, getAllPoses, getPoseById } = require("../../services/poseService")

class PosesHandler {
  constructor() {
    this.postPoseHandler = this.postPoseHandler.bind(this)
    this.getAllPosesHandler = this.getAllPosesHandler.bind(this)
    this.getPoseByIdHandler = this.getPoseByIdHandler.bind(this)

    this._gcpBucket = new GcpBucket()
  }

  async postPoseHandler (request, h) {
    try {
      const {id, title, imageurl, category, step, time} = request.payload

      if (!id || !title || !imageurl || !category || !step || !time) {
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
      const url = await this._gcpBucket.uploadImagToBucket('poses',imageurl)

      const poseDetails = {
        id,
        title,
        imageurl: url,
        category,
        step,
        time,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      const res = await postPose(poseDetails, pool)

      const response = h.response({
        status: 'success',
        data: res,
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
        data: pose,
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
        data: pose,
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
}

module.exports = PosesHandler