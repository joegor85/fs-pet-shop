const express = require("express"); //npm i express
//npm i nodemon
const app = express();
const dotenv = require("dotenv"); //need to do npm install dotenv
dotenv.config();
//const postgres = require("postgres");
//But actually, should use pg to learn about the new way:
//need:
//const pg = require("pg");
//const { Client } = pg;  //use client if only one service will be pulling from your server, use pool if multiple
//Jarrett/Jullian way of doing it:
const { Pool } = require("pg"); //npm i pg

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: connectionString,
});
pool.connect();
const PORT = process.env.PORT || 3000;

//const client = new Client(process.env.DATABASE_URL);
//client.connect();
//let db_URL = process.env.DATABASE_URL;
//const sql = postgres(db_URL);

app.use(express.json());
app.use(express.static("/client"));
app.use(require("body-parser").urlencoded({ extended: false }));

// working on authorization
// app.use((req,res, next)=>{
//   const authHeader = req.headers.authorization;
// })

// Testing the server:
// app.get('/',(req,res)=>{
//     res.send({'hello':'world'});
// })

app.get("/pets", (req, res) => {
  pool.query(`SELECT * FROM pets`).then((result) => {
    res.json(result.rows);
  });
});

app.post("/pets", (req, res, next) => {
  let pet = req.body;
  if (!pet.name || !pet.kind) {
    const error = new Error("Bad Request: missing required parameter");
    error.statusCode = 400;
    return next(error);
  } else if (isNaN(pet.age)) {
    //res.status(400).send("Bad Request");
    const error = new Error("Bad Request: incorrect age variable type");
    error.statusCode = 400;
    return next(error);
  } else {
    pool
      .query(`INSERT INTO pets(age, kind, name) VALUES ($1, $2, $3)`, [
        pet.age,
        pet.kind,
        pet.name,
      ])
      .then((result) => {
        res.send(pet);
      });
  }
});

app.patch("/pets/:petId", (req, res, next) => {
  let petId = req.params.petId;
  if (isNaN(req.params.petId)) return next();
  pool.query(`SELECT * FROM pets WHERE id = $1`, [petId]).then((result) => {
    if (result.length === 0) {
      console.log("There are not that many pets.");
      return next();
    } else {
      let key = Object.keys(req.body)[0];
      let value = Object.values(req.body)[0];
      pool
        .query(`UPDATE pets SET ${key}=$1 WHERE id=$2 RETURNING *`, [
          value,
          petId,
        ])
        .then((result) => {
          result = result.rows[0];
          delete result.id;
          res.send(result); //or can use res.json()
        })
        .catch((e) => {
          return next(e);
        });
    }

    //sql `UPDATE pets SET age = COALESCE(${data['age']? data['age']:null}, age),
    //                     name = COALESCE(${data['name']? data['name']:null}, name),
    //                     kind = COALESCE(${data['kind']? data['kind']:null}, kind)
    //                     WHERE id = ${petId}`.then(respond=>{
    //                         res.json(respond[0]);
    //})

    // else if (key === "age")
    //   pool
    //     .query(`UPDATE pets SET age = ${data[key]} WHERE id = ${petId}`)
    //     .then(() => {
    //       pool
    //         .query(`SELECT name, age, kind FROM pets WHERE id = ${petId}`)
    //         .then((response) => {
    //           res.send(response);
    //         });
    //     });
    // else if (key === "kind")
    //   pool
    //     .query(`UPDATE pets SET kind = ${data[key]} WHERE id = ${petId}`)
    //     .then(() => {
    //       pool
    //         .query(`SELECT name, age, kind FROM pets WHERE id = ${petId}`)
    //         .then((response) => {
    //           res.send(response);
    //         });
    //     });
    // else if (key === "name")
    //   pool
    //     .query(`UPDATE pets SET name = ${data[key]} WHERE id = ${petId}`)
    //     .then(() => {
    //       pool
    //         .query(`SELECT name, age, kind FROM pets WHERE id = ${petId}`)
    //         .then((response) => {
    //           res.send(response);
    //         });
    //     });
    // else res.status(400).send("Bad Request");
  });
});

app.delete("/pets/:petId", (req, res, next) => {
  let petId = req.params.petId;
  //pool.query(`SELECT COUNT(name) FROM pets`).then((result) => {

  pool.query(`SELECT * FROM pets WHERE id = $1`, [petId]).then((result) => {
    if (result.length === 0) {
      console.log("There are not that many pets.");
      return next();

      //if (petId > result[0].count) {
      //console.log("There are not that many pets.");
      //return next(); //res.status(400).send('Bad Request');
    } else {
      pool
        .query(`DELETE FROM pets WHERE id = ${petId} RETURNING *`)
        .then((result) => {
          result = result.rows[0];
          delete result.id;
          res.send(result);
        });
    }
  });
});

app.use("*", (error, req, res, next) => {
  if (error.statusCode === 400) res.status(400).send(error.message);
  else next();
});

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, (error) => {
  if (error) console.log(error);
  else {
    console.log(`Listening on port: ${PORT}`);
  }
});

// app.patch('/pets/:id', (req, res)=>{
//   let key = Object.keys(req.body)[0]
//   let value = Object.values(req.body)[0]
//   sql `UPDATE pets SET ${key} = '${value}' WHERE id = ${req.params.id} RETURNING *`;
// })

// const pg = require('pg');
// pg.Query(`UPDATE pets SET ${key} = '${value}' WHERE id = ${req.params.id} RETURNING *`, (result)=>{})
