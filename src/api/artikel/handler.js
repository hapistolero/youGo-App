
const { postArtikel,getAllArticles,getArticleById,UpdateArticleById,pool, deleteArticle } = require("../../services/artikelService")
const {areYouAdmin} = require('../../services/adminService')
const GcpBucket = require('../../infrastructures/gcpBucket')

class ArtikelHandler {
  constructor() {
    this.postArtikelHandler = this.postArtikelHandler.bind(this)
    this.getAllArticlesHandler = this.getAllArticlesHandler.bind(this)
    this.getArticleByIdHandler = this.getArticleByIdHandler.bind(this)
    this.updateArticle = this.updateArticle.bind(this)
    this.deleteArticleByIdHandler = this.deleteArticleByIdHandler.bind(this)
    this._pool = pool
    this._gcpBucket = new GcpBucket()
  }

  async postArtikelHandler(request, h) {
    try {
      const { id, title, description, imageUrl, webUrl } = request.payload
      const {id:adminCredentials} = request.auth.credentials
      const isAdmin = await areYouAdmin(adminCredentials,pool)
      if(!isAdmin){
        const response = h.response({
          status: 'fail',
          message: 'you are not admin',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
      if (!id || !title || !description  || !imageUrl || !webUrl) {
        const response = h.response({
          status: 'fail',
          message: 'Not sending specific input',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

      if (typeof id !== "string" || typeof title !== "string" || typeof description !== "string" || typeof webUrl !== 'string') {
        const response = h.response({
          status: 'fail',
          message: 'Input does not meet specific datatypes',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

      const foundedArticle = await getArticleById(id,this._pool)
      if(foundedArticle.length > 0){
        const response = h.response({
          status:"fail",
          message:"artikel id is exist"
        })
        
     
        response.code(400)
        return response
      }


      const url = await this._gcpBucket.uploadImagToBucket('articles',imageUrl)
      // Now you can save the article details to Firestore or perform other actions
      const articleDetails = {
        id,
        title,
        description,
        createdAt:Date.now(),
        updateAt:Date.now(),
        imageUrl: url, // Example URL to access the uploaded image
        webUrl
      }

      const res = await postArtikel(articleDetails, pool)

      const response = h.response({
        status: 'success',
        artikel:res,
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
        artikel:article,
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
        artikel: article,
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
  async deleteArticleByIdHandler(request, h) {
    try {
      const { id } = request.params // Use request.params instead of request.param
      const {id:adminCredentials} = request.auth.credentials
      const isAdmin = await areYouAdmin(adminCredentials,pool)
      if(!isAdmin){
        const response = h.response({
          status: 'fail',
          message: 'you are not admin',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }
      const foundedArticle =await getArticleById(id,pool)
      this._gcpBucket.deleteFileFromBucket(foundedArticle.imageUrl)
      const articleIsDeleted = await deleteArticle(id, pool)
     
      if(!articleIsDeleted){
        const Response = h.response({
          status: 'fail',
          data: 'article is not found',
        })
        Response.header('Access-Control-Allow-Origin', '*')
        Response.code(200)
        return Response
      }
      const successResponse = h.response({
        status: 'success',
        artikel: articleIsDeleted,
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

  async updateArticle (request, h){
    const {
      imageUrl,
      title ,
      description,
      webUrl
    } = request.payload

    const {id} = request.params

    const {id:adminCredentials} = request.auth.credentials
    const isAdmin = await areYouAdmin(adminCredentials,pool)
    if(!isAdmin){
      const response = h.response({
        status: 'fail',
        message: 'you are not admin',
      })
      response.header('Access-Control-Allow-Origin', '*')
      response.code(400)
      return response
    }

    if(!id||!imageUrl||!title||!description||!webUrl){
      const response = h.response({
        status:'fail',
        mesage:'input dont have specific property'
      })
      response.code(400)
      return response
    }

    if(
      typeof id !=='string'||
        typeof title !=='string' ||
        typeof description !=='string'||
        typeof webUrl !=='string'
    ){
      const response = h.response({
        status:'fail',
        message:'not meet specific datatypes'
      })
      response.code(400)
      return response
    }
    // dia update tapi cuman hapus profile nya
    // 1.di kirim payload kosong
    // 2. kalo sebelumnya  dia punya imageUrl harus di check terus dihapus
    
   
    const article = await getArticleById(id,this._pool)
    await this._gcpBucket.deleteFileFromBucket(article.imageUrl)
    if (imageUrl && imageUrl instanceof Buffer && imageUrl.length > 0) {
      const response = h.response({
        status:'fail',
        message:'not sending image'
      })
      response.code(400)
      return response
    }   
    const url = await this._gcpBucket.uploadImagToBucket('articles',imageUrl)
    const updatedArticle={
      id,
      imageUrl:url,
      title,
      description,
      webUrl,
      updateAt: new Date(Date.now()).toLocaleString(),
      createdAt:article[0].createdAt,
    }

    await UpdateArticleById(updatedArticle,this._pool)
    
    const response = h.response({
      status:'success',
      artikel:updatedArticle
    })
    response.code(400)
    return response
  }
    
    

}

 
module.exports = ArtikelHandler
