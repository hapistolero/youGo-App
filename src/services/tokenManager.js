const JWT = require('@hapi/jwt')
class TokenManager {
  constructor() {
    this._jwt = JWT
  }

  async createAccessToken(payload) {
    return this._jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY)
  }

  async createRefreshToken(payload) {
    return this._jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY)
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.token.decode(token)
      this._jwt.token.verify(artifacts, process.env.REFRESH_TOKEN_KEY)
      // eslint-disable-next-line no-console
      console.log('Verification successful')
    } catch (error) {
      throw new Error('Refresh token is not valid')
    }
  }

  async decodePayload(token) {
    const { decoded } = this._jwt.token.decode(token)
    return decoded.payload
  }
}

module.exports = TokenManager
