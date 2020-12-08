const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lolapp',
  password: 'magdalena10',
  port: 5432,
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

  let query = "SELECT id_partida, id_campeon, id_perfil, duracion, winorlose, fechayhora, to_char( fechayhora, 'DD-MM-YYYY') as dateformat FROM partida ORDER BY id_partida ASC"
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

const campeones = (request, response) => {

  let query = 'SELECT * FROM campeon'
  pool.query(query)
  .then(res => {
    response.status(200).json(res.rows)
    })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}


/* [POST] Crear vinculos de la partida */
const tiene = (request, response) => {

  const { id_partida, id_runas } = request.body

  let query = 'INSERT INTO tiene( id_partida, id_runas ) VALUES ($1, $2)'
  let values = [ id_partida, id_runas]
  pool.query(query, values)
  .then(res => {
    response.status(200)
    console.log('tiene', id_partida + " <-> " + id_runas)
    })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

const dispone = (request, response) => {

  const { id_partida, id_item } = request.body

  let query = 'INSERT INTO dispone( id_partida, id_item ) VALUES ($1, $2)'
  let values = [ id_partida, id_item]
  pool.query(query, values)
  .then(res => {
    response.status(200)
    console.log('tiene', id_partida + " <-> " + id_item)
    })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}


/* Consultas hechas */

/* [POST] Obtener el promedio de la duracion de las partidas entre distintas fechas */

const getAVGPartidasDates = (request, response) => {

  const { date1, date2 } = request.body

  let query = "SELECT AVG(duracion) FROM partida WHERE fechayhora BETWEEN $1 AND $2"
  let values = [ date1, date2 ]
  pool.query(query, values)
  .then(res => {
    response.status(200).json(res.rows[0])
    console.log("Promedio entre", date1 , "y", date2, res.rows[0])
  })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}


/* ¨[POST] Partidas mas jugadas con un campeon entre dos fechas por los profesionales */

const mostPlayedChampByPros = (request, response) => {

  const { date1, date2 } = request.body

  let query = "SELECT count(p.id_campeon), c.nombre FROM partida AS p, campeon AS c, perfil AS z WHERE c.id_campeon = p.id_campeon AND p.id_perfil = z.id_perfil AND z.tipo = 'Profesional' AND p.fechayhora BETWEEN $1 AND $2 GROUP BY c.nombre ORDER BY count DESC LIMIT 1;"
  let values = [ date1, date2 ]
  
  pool.query(query, values)
  .then(res => {
    response.status(200).json(res.rows[0])
    console.log("Campeon más jugado por los pros", date1 , "y", date2, res.rows[0])
  })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

/* [POST] Item más utilizado por un campeón */

const mostUsedItemByChamp = (request, response) => {

  const { champ } = request.body

  let query = "SELECT count(i.id_item), i.id_item, i.nombre FROM partida as part, campeon as champ, dispone as d, item as i WHERE champ.nombre = $1 and d.id_partida = part.id_partida and i.id_item = d.id_item GROUP BY i.id_item ORDER BY count DESC LIMIT 1"
  let values = [ champ ]
  
  pool.query(query, values)
  .then(res => {
    response.status(200).json(res.rows[0])
    console.log("Item más usado por el champ", champ, res.rows[0])
  })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

/* [POST] Runas mas usadas por un campeon */

const mostUsedRunesByChamp = (request, response) => {

  const { champ } = request.body

  let query = "SELECT count(r.id_runas), r.id_runas, r.nombre FROM partida as part, campeon as champ, tiene as t, runas as r WHERE champ.nombre = $1 and t.id_partida = part.id_partida and r.id_runas = t.id_runas GROUP BY r.id_runas ORDER BY count DESC LIMIT 1"
  let values = [ champ ]
  
  pool.query(query, values)
  .then(res => {
    response.status(200).json(res.rows[0])
    console.log("Runa más usada por el champ", champ, res.rows[0])
  })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

/* [POST] Campeon mas utilizado por un perfil */

const mostUsedChampbyProfile = (request, response) => {

  const { id_perfil, date1, date2 } = request.body

  let query = "SELECT count(p.id_campeon), c.nombre FROM partida AS p, campeon AS c WHERE c.ID_campeon = p.ID_campeon AND p.ID_perfil = $1 AND p.fechayhora BETWEEN $2 AND $3 GROUP BY c.nombre ORDER BY count DESC LIMIT 1"
  let values = [ id_perfil, date1, date2 ]
  
  pool.query(query, values)
  .then(res => {
    response.status(200).json(res.rows[0])
    console.log("Campeon mas usado en cierto tiempo", date1, 'y', date2, champ, res.rows[0])
  })
  .catch(e => {
    response.status(500)
    console.error(e.stack)
  })

}

/* [POST] Campeon mas popular en cierto tiempo */

const mostUsedChampGeneral = (request, response) => {
  
  const { date1, date2 } = request.body

  let query = "SELECT count(p.id_campeon), c.nombre FROM partida AS p, campeon AS c WHERE c.ID_campeon = p.ID_campeon AND p.fechayhora BETWEEN $1 AND $2 GROUP BY c.nombre ORDER BY count DESC LIMIT 1"
  let values = [ date1, date2 ]
  
  pool.query(query, values)
  .then(res => {
    response.status(200).json(res.rows[0])
    console.log("Campeon mas utilizado entre", date1, 'y', date2, res.rows[0])
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

  campeones,

  tiene,
  dispone,

  getAVGPartidasDates,
  mostPlayedChampByPros,
  mostUsedItemByChamp,
  mostUsedRunesByChamp,
  mostUsedChampbyProfile,
  mostUsedChampGeneral

}
