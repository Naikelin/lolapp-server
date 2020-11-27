const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 25000

/* importing db + queries */
const db = require('./db')

/* middlewares */
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

/* routes */

app.get('/', (request, response) => {
  response.json({ info: 'Testing la lolapp' })
})

/* Perfiles */

app.get('/perfiles', db.getPerfiles)
app.get('/perfil/:id', db.getPerfilById)
app.post('/crear_perfil', db.createPerfil)

app.get('/partidas', db.getPartidas)
app.get('/partida/:id', db.getPartidaById)
app.post('/crear_partida', db.createPartida)

app.post('/tiene', db.tiene)
app.post('/dispone', db.dispone)

/* socket */

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
