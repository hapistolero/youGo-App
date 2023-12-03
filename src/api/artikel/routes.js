const routes = (handler) => [
  {
    method: "POST",
    path: "/articles",
    handler: (request, h) => handler.postArtikelHandler(request, h),
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
    path: "/articles",
    handler: (request, h) => handler.getAllArticlesHandler(request,h),
  },
  {
    method: "GET",
    path: "/articles/{id}",
    handler: (request, h) => handler.getArticleByIdHandler(request,h),
  },
]
module.exports = routes
