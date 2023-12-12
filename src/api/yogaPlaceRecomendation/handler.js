
const getNearbyYogaPlaces = require('../../services/placeRecomendation')
class YogaPlaceRecommendationHandler {
  constructor(){
    this.getYogaPlaceRecommendationHandler = this.getYogaPlaceRecommendationHandler.bind(this)
  }

  async getYogaPlaceRecommendationHandler(request,h){
    try {   
      const {lattitude,longitude} = request.payload
      if(!lattitude,!longitude){
        const response = h.response({
          status:'fail',
          message:'not sending specific input'
        })
        response.code(400)
        return response
      }
      if(typeof lattitude !== 'string',typeof longitude !== 'string'){
        const response = h.response({
          status:'fail',
          message:'not sending specific input'
        })
        response.code(400)
        return response
      }
      const placeRecomendation = await getNearbyYogaPlaces(lattitude,longitude)
      console.log(placeRecomendation[0].photos)

      const response = h.response({
        status:'success',
        placeRecomendation:placeRecomendation
      })
      response.code(200)
      return response

    } catch (error) {
      const response = h.response({
        status:'fail',
        message:`Internal Server Error ${error.message}`
      })
      response.code(500)
      return response
    }
  }
}

module.exports = YogaPlaceRecommendationHandler