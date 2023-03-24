const fs = require("fs");
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
//app.use(express.json());

// Let's just be able to access the localhost
app.get("/", (req, res) => {
  res.send("Welcome to the Pet Shop");
});

// handle anything other than "pets"
app.get("/:something", (req, res) => {
  res.sendStatus(404, "Not Found");
});

// Set a route to pets
app.get("/pets", function (req, res, next) {
  fs.readFile("pets.json", "UTF-8", (error, pets) => {
    if (error) {
      res.sendStatus(500);
      res.end();
    } else {
      res.json(JSON.parse(pets));
      res.status(200);
      res.end();
    }
  });
});

// Handle the routes for certain pets
app.get("/pets/:id", function (req, res) {
  fs.readFile("pets.json", "UTF-8", (error, petsString) => {
    if (error) {
      res.sendStatus(500);
      res.end();
    } else {
      let pets = JSON.parse(petsString);
      if (!pets[req.params.id]) {
        res.sendStatus(404, "Not Found");
      } else {
        res.json(pets[req.params.id]);
        res.status(200);
        res.end();
      }
    }
  });
});

// Make the server start listening for requests
app.listen(port, function () {
  console.log(`Server listening on port:${port}`);
});
