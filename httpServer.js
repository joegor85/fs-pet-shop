const fs = require("fs");
const http = require("http");
const port = process.env.PORT || 8000;

var handleRequest = http.createServer((req, res) => {
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
      console.log(data);
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
  } else {
    console.error("Please use the correct method");
  }
});

handleRequest.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Server running on ${port}`);
  }
});
