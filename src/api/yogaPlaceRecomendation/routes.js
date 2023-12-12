const routes = (handler) =>[
  {
    method: "POST",
    path: "/yogaPlaceRecomendation",
    handler: (request, h) => handler.getYogaPlaceRecommendationHandler(request, h),
  },
]

module.exports = routes