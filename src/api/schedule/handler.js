const GcpBucket = require('../../infrastructures/gcpBucket')
const { getPoseById,postSchedule,getUserAllSchedule,UpdateScheduleById,getUserScheduleById,
  deleteSchedule,pool } = require("../../services/scheduleService")

class ScheduleHandler {
  constructor() {
    this.postScheduleHandler = this.postScheduleHandler.bind(this)
    this.getAllScheduleHandler = this.getAllScheduleHandler.bind(this)
    this.updateSchedule = this.updateSchedule.bind(this)
    this.getUserScheduleByIdHandler = this.getUserScheduleByIdHandler.bind(this)
    this.deleteUserScheduleByIdHandler = this.deleteUserScheduleByIdHandler.bind(this)
    this._pool = pool
    this._gcpBucket = new GcpBucket()
  }

  async postScheduleHandler(request, h) {
    try {
      const { id:credentialId} = request.auth.credentials
      const {poseId,scheduleName,dayTime} = request.payload
      if (!poseId || !scheduleName ||!dayTime) {
        const response = h.response({
          status: 'fail',
          message: 'not sending specific input',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      if (typeof scheduleName !== 'string' ||typeof dayTime !=='string') {
        const response = h.response({
          status: 'fail',
          message: 'not meet dataatype specification',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

    
      const validPoses = []
      for (const id of poseId) {
        // Validate each poseId
        const isValidPoseId = typeof id === 'string' && id.trim() !== ''
        if (!isValidPoseId) {
          const response = h.response({
            status: 'fail',
            message: 'Invalid poseId provided',
          })
          response.header('Access-Control-Allow-Origin', '*')
          response.code(400)
          return response
        }
  
        // Fetch pose data for each poseId
        const poseData = await getPoseById(id, this._pool)
        if (!poseData) {
          const response = h.response({
            status: 'fail',
            message: `Pose with ID ${id} not found`,
          })
          response.code(404)
          return response
        }
  
        validPoses.push(poseData) // Add poseData to the array
      }
  
      // Continue with the rest of your code...
      // ...
  
      const schedule = {
        scheduleId:`schedule-${Math.random()}`,
        userId: credentialId,
        scheduleName,
        dayTime,
        createdAt:new Date(Date.now()).toLocaleString(),
        updateAt: new Date(Date.now()).toLocaleString(),
        schedule: validPoses, // Assign the array of pose data
      }

      const res = await postSchedule(schedule, this._pool)

      const response = h.response({
        status: 'success',
        schedule:res,
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

  async getAllScheduleHandler (request, h){

    try {
      const{id:userId} = request.auth.credentials
      const schedule = await getUserAllSchedule(userId,this._pool)
      const response = h.response({
        status: 'success',
        schedule:schedule,
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
  async getUserScheduleByIdHandler (request, h){

    try {
      const{id} = request.params
      const schedule = await getUserScheduleById(id,this._pool)
      const response = h.response({
        status: 'success',
        schedule:schedule,
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

  async deleteUserScheduleByIdHandler (request, h){

    try {
      const{id} = request.params
      const {id:credentialId} =request.auth.credentials
      
      const foundedSchedule = await getUserScheduleById(id,pool)

      if(foundedSchedule.userId !== credentialId){
        const response = h.response({
          status: 'fail',
          message: 'you are not the owner of this schedule',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

      const schedule = await deleteSchedule(id,this._pool)
      const response = h.response({
        status: 'success',
        schedule:schedule,
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

  
  async updateSchedule (request, h){
    const { id:credentialId} = request.auth.credentials
    const {poseId,scheduleName,dayTime} = request.payload
    const{id:scheduleId} = request.params
  
    if (!poseId || !scheduleName ||!dayTime || !scheduleId) {
      const response = h.response({
        status: 'fail',
        message: 'not sending specific input',
      })
      response.header('Access-Control-Allow-Origin', '*')
      response.code(400)
      return response
    }
  
    if (typeof scheduleName !== 'string' ||typeof dayTime !=='string' || typeof scheduleId !=='string') {
      const response = h.response({
        status: 'fail',
        message: 'not meet dataatype specification',
      })
      response.header('Access-Control-Allow-Origin', '*')
      response.code(400)
      return response
    }
   
    const foundedSchedule = await getUserScheduleById(scheduleId,pool)

    if(foundedSchedule.userId !== credentialId){
      const response = h.response({
        status: 'fail',
        message: 'you are not the owner of this schedule',
      })
      response.header('Access-Control-Allow-Origin', '*')
      response.code(400)
      return response
    }

    const validPoses = []
    for (const id of poseId) {
      // Validate each poseId
      const isValidPoseId = typeof id === 'string' && id.trim() !== ''
      if (!isValidPoseId) {
        const response = h.response({
          status: 'fail',
          message: 'Invalid poseId provided',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
  
      // Fetch pose data for each poseId
      const poseData = await getPoseById(id, this._pool)
      if (!poseData) {
        const response = h.response({
          status: 'fail',
          message: `Pose with ID ${id} not found`,
        })
        response.code(404)
        return response
      }
  
      validPoses.push(poseData) // Add poseData to the array
    }
  
    // Continue with the rest of your code...
    // ...
    const newSchedule = {
      scheduleId:scheduleId,
      userId: credentialId,
      scheduleName,
      dayTime,
      createdAt: new Date(Date(foundedSchedule.createdAt)).toLocaleString(),
      updateAt:new Date(Date.now()).toLocaleString(),
      schedule: validPoses, // Assign the array of pose data
    }


    await UpdateScheduleById(newSchedule,this._pool)

    const response = h.response({
      status:'success',
      newSchedule:newSchedule
    })
    response.code(400)
    return response
  }
    

  
    

}

 
module.exports = ScheduleHandler
