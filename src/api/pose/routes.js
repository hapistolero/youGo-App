const routes = (handler) => [
  {
    method: "POST",
    path: "/poses",
    handler: (request, h) => handler.postPoseHandler(request, h),
    options:{
        auth: false, // false by default
        payload: {
           parse: true,
           multipart: {
                  output: 'stream'
           },
           maxBytes: 1000 * 1000 * 5, // 5 Mb
        }
     }, 
  }, 

  {
    method: "GET",
    path: "/poses",
    handler: (request, h) => handler.getAllPosesHandler(request, h),
  },

  {
    method: "GET",
    path: "/poses/{id}",
    handler: (request, h) => handler.getPoseByIdHandler(request, h),
  },
]

module.exports = routes