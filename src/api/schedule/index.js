
const ScheduleHandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: "schedule",
  version: "1.0.0",
  register: async (server) => {
    const scheduleHandler = new ScheduleHandler()
    server.route(routes(scheduleHandler))
  },

}
