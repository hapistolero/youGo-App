const routes = (handler) => [
  {
    method: "POST",
    path: "/schedule",
    handler: (request, h) => handler.postScheduleHandler(request, h),
    options:{
      auth: "yoga_app_jwt", // false by default
    },
  },
  {
    method: "GET",
    path: "/schedule",
    handler: (request, h) => handler.getAllScheduleHandler(request,h),
    options:{
      auth: "yoga_app_jwt", // false by default
    },
  },
  {
    method: "GET",
    path: "/schedule/{id}",
    handler: (request, h) => handler.getUserScheduleByIdHandler(request,h),
    options:{
      auth: "yoga_app_jwt", // false by default
    },
  },
  {
    method: "DELETE",
    path: "/schedule/{id}",
    handler: (request, h) => handler.deleteUserScheduleByIdHandler(request,h),
    options:{
      auth: "yoga_app_jwt", // false by default
    },
  },
  {
    method: "PUT",
    path: "/schedule/{id}",
    handler: (request, h) => handler.updateSchedule(request,h),
    options:{
      auth: "yoga_app_jwt", // false by default
    }
  },
]
module.exports = routes
  