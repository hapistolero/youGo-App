
const YogaPlaceRecommendationHandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: "yogaPlace",
  version: "1.0.0",
  register: async (server) => {
    const yogaPlaceRecommendationHandler = new YogaPlaceRecommendationHandler()
    server.route(routes(yogaPlaceRecommendationHandler))
  },

}
