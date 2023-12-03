
const ArtikelHandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: "artikel",
  version: "1.0.0",
  register: async (server) => {
    const artikelHandler = new ArtikelHandler()
    server.route(routes(artikelHandler))
  },

}
