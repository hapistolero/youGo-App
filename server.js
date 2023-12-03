/* eslint-disable linebreak-style */
// berkas penampung kode untuk membuat , mengkonfigurasi, dan menjalankan http server

require('dotenv').config()

const users = require('./src/api/users')
const authentications = require('./src/api/auth')
const artikel = require('./src/api/artikel')
const profile = require('./src/api/profile')
const Hapi = require('@hapi/hapi')

const Jwt = require('@hapi/jwt')

const Inert = require('@hapi/inert')


const init = async () => {
  const server = Hapi.server({

    port: process.env.PORT,

    host: process.env.HOST,

    routes: {

      cors: {

        origin: ['*'],

      },

    },

  })

  await server.register([

    {

      plugin: Jwt,

    },

  ])

 

  server.auth.strategy('yoga_app_jwt', 'jwt', {

    keys: process.env.ACCESS_TOKEN_KEY,

    verify: {

      aud: false,

      iss: false,

      sub: false,

      maxAgeSec: process.env.ACCESS_TOKEN_AGE,

    },

    validate: (artifacts) => ({

      isValid: true,

      credential: {

        id: artifacts.decoded.payload.id,

      },

    }),

  })

  await server.register([{plugin:Inert}])

  await server.register([{
    plugin: users
  },
  {
    plugin:authentications
  },
  {
    plugin:artikel
  },
  {
    plugin:profile
  }])


  // server.ext('onPreResponse', (request, h) => {
  //   const { response } = request;

  //   if (response instanceof Error) {
  //     if (response instanceof ClientError) {
  //       const clientResponseError = h.response({

  //         status: 'fail',

  //         message: response.message,

  //       });

  //       clientResponseError.code(response.statusCode);

  //       return clientResponseError;
  //     }

  //     if (response instanceof InvariantError) {
  //       const InvariantErrorResponse = h.response({

  //         status: 'fail',

  //         message: response.message,

  //       });

  //       InvariantErrorResponse.code(response.statusCode);

  //       return InvariantErrorResponse;
  //     }

  //     if (!response.isServer) {
  //       return h.continue;
  //     }

  //     const serverResponseError = h.response({

  //       status: 'error',

  //       message: 'terjadi kegagalan pada server kami',

  //     });

  //     serverResponseError.code(500);

  //     return serverResponseError;
  //   }

  //   return h.continue;
  // });

  await server.start()

  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
