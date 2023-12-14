const routes = (handler) => [
  {
    method: "POST",
    path: "/articles",
    handler: (request, h) => handler.postArtikelHandler(request, h),
    options:{
      auth:'yoga_app_jwt', // false by default
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
  {
    method: "DELETE",
    path: "/articles/{id}",
    handler: (request, h) => handler.deleteArticleByIdHandler(request,h),
    options:{
      auth:'yoga_app_jwt',
     
    }
  },
  {
    method: "PUT",
    path: "/articles/{id}",
    handler: (request, h) => handler.updateArticle(request,h),
    options:{
      auth:'yoga_app_jwt', // false by default
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
