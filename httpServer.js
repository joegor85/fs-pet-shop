const fs = require("fs");
const http = require("http");
const port = process.env.PORT || 8000;
const petRegExp = /^\/pets\/(.*)$/;
//let regex = "/pets/somerandomtext".match(petRegExp);
//console.log(regex);

// Tell the server what to do when it gets a request
var handleRequest = http.createServer((req, res) => {
  console.log();
  if (req.method == "GET") {
    let urlSplit = req.url.split("/");
    //console.log(index);

    fs.readFile("pets.json", "UTF-8", (error, data) => {
      if (error) {
        console.error(error);
      } else {
        readSomething(JSON.parse(data));
      }
    });

    function readSomething(data) {
      //console.log(data);
      //let index = urlSplit[2];
      //   if (req.url == "/pets") {
      //     res.writeHead(200, { "Content-Type": "application/json" });
      //     res.write(JSON.stringify(data));
      //     res.end("Here is your request");
      //   } else if (index < data.length && index >= 0) {
      //     console.log(data[index]);
      //     res.writeHead(200, { "Content-Type": "application/json" });
      //     res.write(JSON.stringify(data[index]));
      //     res.end();
      //   } else {
      //     res.writeHead(404, { "Content-Type": "text/plain" });
      //     res.end("Not Found");
      //   }

      if (req.url == "/pets") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data));
        res.end();
      } else if (petRegExp.test(req.url)) {
        let index = req.url.match(petRegExp)[1];
        console.log(index);
        if (index.trim() === "" || isNaN(index)) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not Found");
        } else if (index >= data.length || index < 0) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not Found");
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(data[index]));
          res.end();
        }
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    }
  } else if (req.method == "POST") {
    let string = "";
    req.on("data", (chunk) => {
      string += chunk;
    });
    req.on("end", () => {
      let parsedString = JSON.parse(string);
      if (
        isNaN(parsedString.age) ||
        parsedString.name == "" ||
        parsedString.kind == ""
      ) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
        return;
      }
      //console.log(JSON.parse(string));
      fs.readFile("pets.json", "UTF-8", (error, data2) => {
        let parsedString = JSON.parse(string);
        parsedString.age = Number(parsedString.age);
        console.log(parsedString);
        if (error) {
          console.error(error);
        } else {
          writeJSON(data2, parsedString);
        }
      });
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("Received POST data\n");
      res.write(string);
      res.end();
    });
  } else {
    console.error("Please use the correct method");
  }
});

// Make server listen
handleRequest.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Server running on ${port}`);
  }
});

function writeJSON(data, string) {
  let parsedData = JSON.parse(data);
  parsedData.push(string);
  console.log(parsedData);
  fs.writeFile("pets.json", JSON.stringify(parsedData), function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Pet created.");
    }
  });
}
