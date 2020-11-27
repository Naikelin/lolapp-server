const fetch = require("node-fetch");
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lolapp',
  password: 'patesanjorge1',
  port: 9000,
})

const urlchamps =
  "http://ddragon.leagueoflegends.com/cdn/10.24.1/data/es_AR/champion.json";
const urlitems =
  "http://ddragon.leagueoflegends.com/cdn/10.24.1/data/es_AR/item.json";
const sc =
  "http://ddragon.leagueoflegends.com/cdn/10.24.1/data/es_AR/champion/";
const rr =
  "http://ddragon.leagueoflegends.com/cdn/10.24.1/data/es_AR/runesReforged.json";

function getAllChamps() {
  fetch(urlchamps)
    .then((res) => res.json())
    .then((res1) => {
      Object.keys(res1.data).forEach((champ, index_champ) => {
        const champurl = sc + champ + ".json";
        fetch(champurl)
          .then((res) => res.json())
          .then((res2) => {
            var object = {}
            /* console.log(res2.data[champ]) */
            /*  CHAMP */
            object["nombre"] = champ;
            object["id_campeon"] = index_champ;
            /*  HISTORY */
            object["historia"] = res2.data[champ].lore;

            /* ROL */
            object["rol"] = (res2.data[champ].tags)[0];

            /* SPELLS */
            var spells = res2.data[champ].spells;
            spells.map((skill, index, array) => {
              if (index === 0){
                object["q"] = skill.name
              } else if (index === 1){
  
                object["w"] = skill.name
              } else if (index === 2){

                object["e"] = skill.name
              } else {

                object["r"] = skill.name
              }
            });

            /*(object["spells"])["passive"] = res2.data[champ].passive.name*/

            console.log(object)
            const { nombre, rol, historia, q, w, e, r, id_campeon } = object

            let query = 'INSERT INTO campeon( nombre, rol, historia, q, w, e, r, id_campeon ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
            let values = [ nombre, rol, historia, q, w, e, r, id_campeon ]
            pool.query(query, values)
            .then(res => {
                console.log(nombre + " insertado con exito")
              })
            .catch(e => {
              console.error(e.stack)
            })
            });
                });
              });
}

function getAllItems() {
  fetch(urlitems)
    .then((res) => res.json())
    .then((res) => {
      
      Object.values(res.data).forEach((item, index) => {
        /* console.log(item) */
        var datos = {}
        /* NOMBRE */
        datos["nombre"] = item.name;
        /* STATS */
        datos["estadistica"] = item.stats;
        /* IMAGEN */
        datos["imagen"] = item.image.full;
        /* GOLD */
        datos["costo"] = item.gold.total;

        datos["id_item"] = index

        console.log(datos)
        const { costo, estadistica, imagen, id_item, nombre} = datos

            let query = 'INSERT INTO item( costo, estadistica, imagen, id_item, nombre ) VALUES ($1, $2, $3, $4, $5)'
            let values = [ costo, estadistica, imagen, id_item, nombre ]
            pool.query(query, values)
            .then(res => {
                console.log(nombre + " insertado con exito")
              })
            .catch(e => {
              console.error(e.stack)
            })

      });
    });
}

function getAllRunes() {
    var indexd = 0;
    fetch(rr)
      .then((res) => res.json())
      .then((res) => {
        res.map((rune, index1, array) => {
            slots = res[index1].slots
            slots.map((value, index, array) => {
                value.runes.map((subrunes, index2, array) => {
                    
                    var object = {}
                    object['rama'] = res[index1].name
                    object['nombre'] = subrunes.name
                    object['id_runas'] = indexd
                  indexd += 1
                    console.log(object)
            const { rama, nombre, id_runas } = object

            let query = 'INSERT INTO runas( rama, nombre, id_runas) VALUES ($1, $2, $3)'
            let values = [ rama, nombre, id_runas ]
            pool.query(query, values)
            .then(res => {
                console.log(nombre + " insertado con exito")
              })
            .catch(e => {
              console.error(e.stack)
            })
                })
            })
            console.log('--------------------------')
        })
      });
  }

/* getAllChamps() */
/* getAllItems() */
getAllRunes()

/* console.log(key, res.data[key]) */

