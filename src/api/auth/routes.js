const routes = (handler) => ([
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.loginHandler,
  },
  {
    method: 'POST',
    path: '/authenticationsAdmin',
    handler: handler.loginAdminHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.refreshAuthHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.logoutHandler,
  },
])

  
module.exports = routes
  