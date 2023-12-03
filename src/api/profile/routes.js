const routes = (handler) => [
  {
    method: "POST",
    path: "/profile",
    handler: (request, h) => handler.postProfileData(request, h),
    options:{
      auth:'yoga_app_jwt',
      payload: {
        parse: true,
        multipart: {
          output: 'stream'
        },
        maxBytes: 1000 * 1000 * 5, // 5 Mb
      }
    }
  },
  {
    method: "GET",
    path: "/profile",
    handler: (request,h) => handler.getAllUserProfileById(request,h),
    options:{
      auth:'yoga_app_jwt',
    }
  },
  {
    method: "PUT",
    path: "/profile",
    handler: (request,h) => handler.updatedUserProfileById(request,h),
    options:{
      auth:'yoga_app_jwt',
      payload: {
        parse: true,
        multipart: {
          output: 'stream'
        },
        maxBytes: 1000 * 1000 * 5, // 5 Mb
      }
    }
  },
]
  
module.exports = routes