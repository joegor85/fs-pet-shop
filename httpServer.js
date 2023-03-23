const fs = require("fs");
const http = require("http");
const port = process.env.PORT || 8000;

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
      let index = urlSplit[2];
      //console.log(data);
      if (req.url == "/pets") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data));
        res.end("Here is your request");
      } else if (index < data.length && index >= 0) {
        console.log(data[index]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data[index]));
        res.end();
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
      res.write(string);
      res.end("Received POST data\n");
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
}
