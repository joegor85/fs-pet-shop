const express = require("express"); //npm i express
//npm i nodemon
const app = express();
const dotenv = require("dotenv"); //need to do npm install dotenv
dotenv.config();
const postgres = require("postgres");
//But actually, should use pg to learn about the new way:
//need:
//const pg = require("pg");
//const { Client } = pg;  //use client if only one service will be pulling from your server, use pool if multiple
//Jarrett way of doing it:
//const { Pool } = require("pg";)

// const connectionString = process.env.DATABASE_URL;
// const pool = new Pool({
//   connectionString: connectionString,
// });
// pool.connect();
const PORT = process.env.PORT || 3000;

let db_URL = process.env.DATABASE_URL;
//const client = new Client(process.env.DATABASE_URL);
//client.connect();
const sql = postgres(db_URL);

app.use(express.json());
// app.use(express.static("client"));
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
  sql`SELECT * FROM pets`.then((result) => {
    res.json(result);
  });
});

app.post("/pets", (req, res, next) => {
  let pet = req.body;
  //console.log(pet);
  if (!pet.name || !pet.kind) {
    //res.status(400).send("Bad Request");
    const err = new Error("Bad Request: missing required parameter");
    err.statusCode = 400;
    return next(err);
  } else if (isNaN(pet.age)) {
    //res.status(400).send("Bad Request");
    const err = new Error("Bad Request: incorrect age variable type");
    err.statusCode = 400;
    return next(err);
  } else {
    sql`INSERT INTO pets(age, kind, name) VALUES (${pet.age}, ${pet.kind}, ${pet.name})`.then(
      (result) => {
        res.send(pet);
      }
    );
  }
});

app.patch("/pets/:petId", (req, res, next) => {
  let data = req.body;
  let key = Object.keys(data)[0];
  let petId = req.params.petId;
  if (isNaN(req.params.petId)) return next();
  sql`SELECT COUNT(name) FROM pets`.then((result) => {
    //can do this instead to only run one query:
    //sql`SELECT * FROM pets WHERE id = ${petId}`.then((result) => {
    //if (result.length === 0) return next();
    if (petId * 1 > result[0].count) {
      console.log("There are not that many pets.");
      return next();
    }
    //sql `UPDATE pets SET age = COALESCE(${data['age']? data['age']:null}, age),
    //                     name = COALESCE(${data['name']? data['name']:null}, name),
    //                     kind = COALESCE(${data['kind']? data['kind']:null}, kind)
    //                     WHERE id = ${petId}`.then(respond=>{
    //                         res.json(respond[0]);
    //})
    else if (key === "age")
      sql`UPDATE pets SET age = ${data[key]} WHERE id = ${petId}`.then(() => {
        sql`SELECT name, age, kind FROM pets WHERE id = ${petId}`.then(
          (response) => {
            res.send(response);
          }
        );
      });
    else if (key === "kind")
      sql`UPDATE pets SET kind = ${data[key]} WHERE id = ${petId}`.then(() => {
        sql`SELECT name, age, kind FROM pets WHERE id = ${petId}`.then(
          (response) => {
            res.send(response);
          }
        );
      });
    else if (key === "name")
      sql`UPDATE pets SET name = ${data[key]} WHERE id = ${petId}`.then(() => {
        sql`SELECT name, age, kind FROM pets WHERE id = ${petId}`.then(
          (response) => {
            res.send(response);
          }
        );
      });
    else res.status(400).send("Bad Request");
  });
});

app.delete("/pets/:petId", (req, res, next) => {
  let petId = req.params.petId;
  sql`SELECT COUNT(name) FROM pets`.then((result) => {
    if (petId > result[0].count) {
      console.log("There are not that many pets.");
      return next(); //res.status(400).send('Bad Request');
    } else {
      let msg;
      sql`SELECT * FROM pets WHERE id = ${petId}`.then((result) => {
        msg = result;
      });
      sql`DELETE FROM pets WHERE id = ${petId}`.then((result) => {
        res.send(msg);
      });
    }
  });
});

app.use("*", (error, req, res, next) => {
  if (error.statusCode === 400) res.status(400).send(error.message);
  else next();
});

app.use((error, req, res, next) => {
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
