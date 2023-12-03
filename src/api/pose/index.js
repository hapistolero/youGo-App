const PosesHandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: "pose",
  version: "1.0.0",
  register: async (server) => {
    const posesHandler = new PosesHandler()
    server.route(routes(posesHandler))
  },
}