const ProfileHandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: "profile",
  version: "1.0.0",
  register: async (server) => {
    const profileHandler = new ProfileHandler()
    server.route(routes(profileHandler))
  },

}
