const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 25000
const allowedOrigins = ["http://localhost:3000", "http://localhost:8100"];

/* importing db + queries */
const db = require('./db')

/* middlewares */

app.use(
    cors({
        origin: function(origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    })
);
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

/* Partidas */

app.get('/partidas', db.getPartidas)
app.get('/partida/:id', db.getPartidaById)
app.post('/crear_partida', db.createPartida)

/* Campeones */
app.get('/campeones', db.campeones)

app.post('/tiene', db.tiene)
app.post('/dispone', db.dispone)

/* Consultas */

app.post('/avgp_dates', db.getAVGPartidasDates)
app.post('/mostplayedchamp_bypros', db.mostPlayedChampByPros)
app.post('/mostuseditem_bychamp', db.mostUsedItemByChamp)
app.post('/mostusedrunes_bychamp', db.mostUsedRunesByChamp)
app.post('/mostusedchamp_byprofile', db.mostUsedChampbyProfile)
app.post('/mostusedchamp', db.mostUsedChampGeneral)


/* socket */

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})