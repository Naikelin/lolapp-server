const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lolapp',
  password: 'patesanjorge1',
  port: 9000,
})

  
/* [GET] Se obtienen todos los perfiles en un json */
const getPerfiles = (request, response) => {

  let query = 'SELECT * FROM perfil ORDER BY id_perfil ASC'
  pool.query(query)
.then(res => {
    response.status(200).json(res.rows)
    })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

/* [GET] Se obtiene un perfil por id */
const getPerfilById = (request, response) => {

  const id = parseInt(request.params.id)
  let query = 'SELECT * FROM perfil WHERE id_perfil = $1'
  pool.query(query, [id])
    .then(res => {
      response.status(200).json(res.rows[0])
    })
    .catch(e => {
      response.status(500)
    })

}

/* [POST] Se crea un perfil y se responde el id en el que se inserto */
const createPerfil = (request, response) => {

  const { tipo, servidor, division, nombre } = request.body

  let query = 'INSERT INTO perfil(tipo, servidor, division, nombre) VALUES ($1, $2, $3, $4) RETURNING id_perfil'
  let values = [tipo, servidor, division, nombre]
  pool.query(query, values)
  .then(res => {
    response.status(200).json(res.rows[0])
    console.log('Perfil creado:', res.rows[0])
    })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

/* [GET] Se obtienen todas las partidas en un JSON */
const getPartidas = (request, response) => {

  let query = 'SELECT * FROM partida ORDER BY id_partida ASC'
  pool.query(query)
.then(res => {
    response.status(200).json(res.rows)
    })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

/* [GET] Se obtiene una partida por id_partida */
const getPartidaById = (request, response) => {

  const id = parseInt(request.params.id)
  let query = 'SELECT * FROM partida WHERE id_partida = $1'
  pool.query(query, [id])
    .then(res => {
      response.status(200).json(res.rows[0])
    })
    .catch(e => {
      response.status(500)
    })

}

/* [POST] Crear partida retornando id_partida como JSON */
const createPartida = (request, response) => {

  const { id_perfil, duracion, id_campeon, id_partida, winorlose } = request.body

  let query = 'INSERT INTO partida( id_perfil, duracion, id_campeon, winorlose, fechayhora ) VALUES ($1, $2, $3, $4, current_timestamp) RETURNING id_partida'
  let values = [ id_perfil, duracion, id_campeon, winorlose ]
  pool.query(query, values)
  .then(res => {
    response.status(200).json(res.rows[0])
    console.log('Partida creada:', res.rows[0])
    })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

/* [POST] Crear vinculos de la partida */
const tiene = (request, response) => {

  const { id_campeon, id_runas } = request.body

  let query = 'INSERT INTO tiene( id_campeon, id_runas ) VALUES ($1, $2)'
  let values = [ id_campeon, id_runas]
  pool.query(query, values)
  .then(res => {
    response.status(200)
    console.log('tiene', id_campeon + " <-> " + id_runas)
    })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

const dispone = (request, response) => {

  const { id_campeon, id_item } = request.body

  let query = 'INSERT INTO dispone( id_campeon, id_item ) VALUES ($1, $2)'
  let values = [ id_perfil, id_item]
  pool.query(query, values)
  .then(res => {
    response.status(200)
    console.log('tiene', id_campeon + " <-> " + id_item)
    })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

/* Exports */

module.exports = {
  getPerfiles,
  createPerfil,
  getPerfilById,

  getPartidas,
  getPartidaById,
  createPartida,

  tiene,
  dispone
}
