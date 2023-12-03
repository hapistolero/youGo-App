const { getPasswordByUsername, getIdByUsername,pool } = require('../../services/usersService')
const {addToken,
  checkAvailableToken,
  deleteToken} = require('../../services/authService')
const TokenManager = require('../../services/tokenManager')
const bcrypt = require('bcrypt')
class UsersHandler {
  constructor() {
    this.tokenManager = new TokenManager()
    this.loginHandler = this.loginHandler.bind(this)
    this.logoutHandler = this.logoutHandler.bind(this)
  }

  async loginHandler(request, h) {
    try {
      const { email, password } = request.payload

      if (!email || !password) {
        const response = h.response({
          status: 'fail',
          message: 'Not sending specific input',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

      if (typeof email !== 'string' || typeof password !== 'string') {
        const response = h.response({
          status: 'fail',
          message: 'Input does not meet specific datatypes',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

      const hashedPassword = await getPasswordByUsername(email, pool)
      
      const passwordMatch = await bcrypt.compare(password, hashedPassword)

      if (!passwordMatch) {
        throw new Error('Invalid email or password')
      }

     
      const id = await getIdByUsername(email,pool)
     
      const accessToken = await this.tokenManager.createAccessToken({ id })
      const refreshToken = await this.tokenManager.createRefreshToken({ id })
      await addToken(refreshToken,pool)

      const response = h.response({
        status: 'success',
        userId:id,
        accessToken,
        refreshToken,
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
      response.code(200)
      return response
    }
  }

  async refreshAuthHandler(request, h) {
    try {
      const { refreshToken } = request.payload
      const tokenManager = new TokenManager()

      if (!refreshToken) {
        const response = h.response({
          status: 'fail',
          message: 'Refresh token not provided',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

      await tokenManager.verifyRefreshToken(refreshToken)
      await checkAvailableToken(refreshToken,pool)

      const decodedToken = await tokenManager.decodePayload(refreshToken)

      const { email, id } = decodedToken

      const newAccessToken = await tokenManager.createAccessToken({ email,id })

      const response = h.response({
        status: 'success',
        accessToken: newAccessToken,
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
      response.code(200)
      return response
    }
  }

  async logoutHandler(request,h){
    try{
      const {refreshToken} = request.payload

      if(!refreshToken){
        const response = h.response({
          status: 'fail',
          message: 'Refresh token not provided',
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

      await checkAvailableToken(refreshToken,pool)
      await deleteToken(refreshToken,pool)

      const response = h.response({
        status: 'success',
        message:'refreshToken is deleted',
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
      response.code(200)
      return response
    

    }
  }
}

module.exports = UsersHandler
