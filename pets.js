#!/usr/bin/env node
// put this in the command line to give it permissions: chmod u+x pets.js
let fs = require("fs");
//console.log(fs);

let option = process.argv[2];
let index1 = process.argv[3];
let index2 = process.argv[4];
let index3 = process.argv[5];
let index4 = process.argv[6];

switch (option) {
  case "read":
    //console.log("You selected read");
    fs.readFile("pets.json", "utf8", function (error, data) {
      if (error) {
        console.log(error);
      } else {
        let pets = JSON.parse(data);
        readPets(pets);
      }
    });
    break;
  case "create":
    createPet();
    //console.log("You selected create");
    break;
  case "update":
    updatePet();
    //console.log("You selected update");
    break;
  case "destroy":
    destroyPet();
    //console.log("You selected destroy");
    break;
  default:
    console.error("Usage: node pets.js [read | create | update | destroy]");
  //process.exit(1); //a way to signal to the user an error
}

// let name = process.argv[2];
// console.log(`Hello ${name}`);

//create readPets function
function readPets(data) {
  if (option === "read") {
    if (index1 !== undefined && index1 < data.length) {
      console.log(data[index1]);
    } else if (index1 >= data.length || index1 < 0) {
      console.error("Usage: node pets.js read INDEX (INDEX is out of bounds)");
    } else {
      console.log(data);
    }
  }
}

//create createPet function
function createPet() {
  if (index1 !== undefined && index2 !== undefined && index3 !== undefined) {
    fs.readFile("pets.json", "utf8", function (error, data) {
      if (error) {
        console.log(error);
      } else {
        let pets = JSON.parse(data);
        let newPet = {};
        if (isNaN(index1)) {
          console.error("Age must be a number");
          return;
        }
        newPet.age = Number(index1);
        newPet.kind = index2;
        newPet.name = index3;
        //console.log(newPet);
        pets.push(newPet);
        //console.log(pets);
        fs.writeFile("pets.json", JSON.stringify(pets), function (error) {
          if (error) {
            console.log(error);
          } else {
            console.log("Pet created.");
          }
        });
      }
    });
  } else {
    console.error(
      "Usage: node pets.js create AGE KIND NAME (input these 3 arguments)"
    );
  }
}

// create updatePet function
function updatePet() {
  if (index4 !== undefined) {
    fs.readFile("pets.json", "utf8", function (error, data) {
      if (error) {
        console.log(error);
      } else {
        let pets = JSON.parse(data);
        if (isNaN(index2)) {
          console.error("Age must be a number");
          return;
        }
        let petToWorkWith = pets[index1];
        petToWorkWith.age = index2;
        petToWorkWith.kind = index3;
        petToWorkWith.name = index4;
        pets[index1] = petToWorkWith;
        console.log(pets[index1]);
        fs.writeFile("pets.json", JSON.stringify(pets), function (error) {
          if (error) {
            console.log(error);
          } else {
            console.log("Pet updated.");
          }
        });
      }
    });
  } else {
    console.error(
      "Usage: node pets.js update INDEX AGE KIND NAME (input all 4 arguments after 'update'"
    );
  }
}

function destroyPet() {
  if (index1 === undefined) {
    console.error(
      "Usage: node pets.js destroy INDEX (input an index to destroy"
    );
  } else {
    fs.readFile("pets.json", "utf8", function (error, data) {
      if (error) {
        console.log(error);
      } else {
        let pets = JSON.parse(data);
        let petToRemove = pets[index1];
        let stringedPetToRemove = JSON.stringify(petToRemove);
        //console.log(petToRemove);
        console.log(`Pet(${stringedPetToRemove}) destroyed.`);
        //console.log("Pet(" + petToRemove + ") destroyed.");
        pets.splice(index1, 1);
        fs.writeFile("pets.json", JSON.stringify(pets), function (error) {
          if (error) {
            console.log(error);
          } else {
          }
        });
      }
    });
  }
}
