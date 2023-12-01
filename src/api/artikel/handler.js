
const { pool } = require("../../infrastructures/firestore")
const { postArtikel,getAllArticles,getArticleById } = require("../../services/artikelService")
const GcpBucket = require('../../infrastructures/gcpBucket')

class ArtikelHandler {
  constructor() {
    this.postArtikelHandler = this.postArtikelHandler.bind(this)
    this.getAllArticlesHandler = this.getAllArticlesHandler.bind(this)
    this.getArticleByIdHandler = this.getArticleByIdHandler.bind(this)
    
    this._gcpBucket = new GcpBucket()
  }

  async postArtikelHandler(request, h) {
    try {
      const { id, title, description, file } = request.payload

      if (!id || !title || !description  || !file) {
        const response = h.response({
          status: 'fail',
          message: 'Not sending specific input',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

      if (typeof id !== "string" || typeof title !== "string" || typeof description !== "string") {
        const response = h.response({
          status: 'fail',
          message: 'Input does not meet specific datatypes',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
      const url = await this._gcpBucket.uploadImagToBucket('articles',file)
      // Now you can save the article details to Firestore or perform other actions
      const articleDetails = {
        id,
        title,
        description,
        createdAt:Date.now(),
        updateAt:Date.now(),
        imageUrl: url, // Example URL to access the uploaded image
      }

      const res = await postArtikel(articleDetails, pool)

      const response = h.response({
        status: 'success',
        data:res,
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

  async getAllArticlesHandler (request, h){

    try {
      
      const article = await getAllArticles(pool)
      const response = h.response({
        status: 'success',
        data:article,
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

  async getArticleByIdHandler(request, h) {
    try {
      const { id } = request.params // Use request.params instead of request.param
    
      const article = await getArticleById(id, pool)
    
      if (!article) {
        const notFoundResponse = h.response({
          status: 'fail',
          message: 'Article not found',
        })
        notFoundResponse.header('Access-Control-Allow-Origin', '*')
        notFoundResponse.code(404)
        return notFoundResponse
      }
    
      const successResponse = h.response({
        status: 'success',
        data: article,
      })
      successResponse.header('Access-Control-Allow-Origin', '*')
      successResponse.code(200)
      return successResponse
    } catch (error) {
      // Log the error for debugging purposes
    
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

 
module.exports = ArtikelHandler
