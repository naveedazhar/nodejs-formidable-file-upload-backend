require("custom-env").env("staging");
// .env.staging file will be used so port=8088 will be effective (not the value in .env file or 8080 mention in this file)

var http = require("http");
var formidable = require("formidable");
var fs = require("fs");

// use port 8080 unless there exists a preconfigured port
var port = process.env.port || 8080;

http
  .createServer(function (req, res) {
    if (req.url == "/fileupload") {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = "/var/www/html/uploads/" + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
          res.write("File uploaded sucessfully and moved to uploads folder.");
          res.end();
        });
      });
    } else if (req.url == "/upload-form") {
        // only allow Form Upload UI from local host
      if (req.connection.remoteAddress === req.connection.localAddress) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(
          '<form action="fileupload" method="post" enctype="multipart/form-data">'
        );
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write("</form>");
        return res.end();
      } else {
        res.write("only local connection is allowed for this operation.");
      }
    }
  })
  .listen(port);

console.log("node server running on " + port);
