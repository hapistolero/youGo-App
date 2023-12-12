/* eslint-disable linebreak-style */
const{addUser,
  verifyAvailableUsername,
  pool} = require('../../services/usersService')
const bcrypt = require('bcrypt')
class UsersHandler {
  constructor() {
    
    this.registerUsersHandler = this.registerUsersHandler.bind(this)
  }

  async registerUsersHandler(request, h) {
    try {
      const {email,password} = request.payload
    
      if (!email || !password) {
        const response = h.response({
          status: 'fail',
          message: 'not sending specific input'
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      }

      if (typeof email !== "string" || typeof password !== "string") {
        const response = h.response({
          status: 'fail',
          message: 'input not meet specific datatypes'
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response

      }

     
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
       

      
      if (!emailRegex.test(email) ) {
        const response = h.response({
          status: 'fail',
          message: 'email is not valid'
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      } 

      if (password.length < 6 ) {
        const response = h.response({
          status: 'fail',
          message: 'password must be more than 6 character'
        })
        response.header('Access-Control-Allow-Origin', '*')
        response.code(400)
        return response
      } 
      await verifyAvailableUsername(email,pool)
      const hashedPassword = await bcrypt.hash(password, 10)

      const registerUser = {
        id:`user-${Math.random()}`,
        email,
        password:hashedPassword
      }
      const res = await addUser(registerUser,pool)
    
      const response = h.response({
        status: 'success',
        user: res
      })
      response.header('Access-Control-Allow-Origin', '*')
      response.code(200)
      return response
        
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message
      })
      response.header('Access-Control-Allow-Origin', '*')
      response.code(200)
      return response
    }
    

  }
}
module.exports = UsersHandler
